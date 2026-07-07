import { NextResponse } from "next/server";
import * as cheerio from "cheerio";

export const dynamic = "force-dynamic";

type QuizQuestion = {
  id: string;
  serial: number;
  type: "mcq" | "fill_blanks" | "true_false" | "unknown";
  title: string;
  htmlTitle: string;
  options: Array<{ value: string; label: string }>;
};

type QuizAnswer =
  | { type: "mcq"; value: string[] }
  | { type: "fill_blanks"; value: string[] | string }
  | { type: "true_false" | "unknown"; value: string };

type QuizSubmissionPayload = {
  answers?: Record<string, QuizAnswer | null | undefined>;
};

function cleanBaseUrl(baseUrl: string) {
  return baseUrl.replace(/\/+$/, "");
}

function buildCookieHeader(setCookieHeader: string | null) {
  if (!setCookieHeader) return "";

  return setCookieHeader
    .split(/,(?=[^;]+?=)/g)
    .map((cookiePart) => cookiePart.split(";")[0].trim())
    .filter(Boolean)
    .join("; ");
}

function parseQuizHtml(html: string) {
  const $ = cheerio.load(html);
  const questions: QuizQuestion[] = [];

  $(".question").each((index, element) => {
    const block = $(element);
    const serialText = block.find(".serial").first().text().trim();
    const titleContainer = block.find(".mb-3.d-flex.gap-3").first();
    const titleNode = titleContainer.find("div").last();
    const inputs = block.find("input");
    const firstInputName = inputs.first().attr("name") || "";
    const questionIdMatch = firstInputName.match(/^(\d+)/);

    let type: QuizQuestion["type"] = "unknown";
    if (block.find('input[type="checkbox"]').length > 0) {
      type = "mcq";
    } else if (block.find('input[type="radio"]').length > 0) {
      type = "true_false";
    } else if (block.find('input[type="text"]').length > 0) {
      type = "fill_blanks";
    }

    const options = block.find('input[type="checkbox"]').map((_, input) => {
      const inputElement = $(input);
      const value = String(inputElement.attr("value") || "").trim();
      const label = block.find(`label[for="${inputElement.attr("id")}"]`).first().text().trim();
      return {
        value: value || label,
        label: label || value,
      };
    }).get().filter((option) => option.value || option.label);

    questions.push({
      id: questionIdMatch?.[1] || String(index + 1),
      serial: Number.parseInt(serialText, 10) || index + 1,
      type,
      title: titleNode.text().replace(/\s+/g, " ").trim(),
      htmlTitle: titleNode.html() || titleNode.text(),
      options,
    });
  });

  return questions;
}

async function createQuizSession(baseUrl: string, token: string, quizId: string) {
  const url = new URL(`${cleanBaseUrl(baseUrl)}/payment/web_redirect_to_quiz`);
  url.searchParams.set("token", token);
  url.searchParams.set("quiz_id", quizId);

  const response = await fetch(url.toString(), {
    method: "GET",
    redirect: "manual",
    headers: {
      Accept: "text/html,application/xhtml+xml",
    },
  });

  const cookie = buildCookieHeader(response.headers.get("set-cookie"));
  const location = response.headers.get("location");

  return { cookie, location, status: response.status };
}

async function fetchQuizPage(baseUrl: string, quizId: string, cookie: string, location?: string | null) {
  const targetUrl = location
    ? new URL(location, cleanBaseUrl(baseUrl)).toString()
    : `${cleanBaseUrl(baseUrl)}/load/quiz/questions/?quiz_id=${encodeURIComponent(quizId)}`;

  const response = await fetch(targetUrl, {
    method: "GET",
    headers: {
      Accept: "text/html",
      ...(cookie ? { Cookie: cookie } : {}),
    },
  });

  return response.text();
}

async function submitQuizAnswers(baseUrl: string, quizId: string, cookie: string, answers: Record<string, QuizAnswer | null | undefined>) {
  const payload = new URLSearchParams();
  payload.set("quiz_id", quizId);

  Object.entries(answers).forEach(([questionId, answer]) => {
    if (!answer) return;

    if (answer.type === "mcq" && Array.isArray(answer.value)) {
      answer.value.forEach((value: string) => payload.append(`${questionId}[]`, value));
      return;
    }

    if (answer.type === "fill_blanks") {
      const blankValues = Array.isArray(answer.value)
        ? answer.value
        : String(answer.value || "")
            .split(/,|\n/)
            .map((value) => value.trim())
            .filter(Boolean);

      payload.set(
        questionId,
        JSON.stringify(blankValues.map((value: string) => ({ value })))
      );
      return;
    }

    payload.set(questionId, String(answer.value));
  });

  const response = await fetch(`${cleanBaseUrl(baseUrl)}/quiz/submit/${quizId}`, {
    method: "POST",
    headers: {
      Accept: "text/html",
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      ...(cookie ? { Cookie: cookie } : {}),
    },
    body: payload.toString(),
  });

  const html = await response.text();
  return { ok: response.ok, html };
}

export async function GET(request: Request, { params }: { params: Promise<{ quizId: string }> }) {
  const { quizId } = await params;
  const url = new URL(request.url);
  const baseUrl = url.searchParams.get("baseUrl")?.trim();
  const token = url.searchParams.get("token")?.trim();

  if (!baseUrl || !token || !quizId) {
    return NextResponse.json({ message: "Missing quiz connection details." }, { status: 400 });
  }

  try {
    const session = await createQuizSession(baseUrl, token, quizId);
    const html = await fetchQuizPage(baseUrl, quizId, session.cookie, session.location);
    const questions = parseQuizHtml(html);

    if (questions.length === 0) {
      return NextResponse.json({ message: "Quiz questions were not found." }, { status: 404 });
    }

    return NextResponse.json({ questions });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load quiz.";
    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function POST(request: Request, { params }: { params: Promise<{ quizId: string }> }) {
  const { quizId } = await params;
  const url = new URL(request.url);
  const baseUrl = url.searchParams.get("baseUrl")?.trim();
  const token = url.searchParams.get("token")?.trim();

  if (!baseUrl || !token || !quizId) {
    return NextResponse.json({ message: "Missing quiz connection details." }, { status: 400 });
  }

  try {
    const body = (await request.json().catch(() => null)) as QuizSubmissionPayload | null;
    const answers = body?.answers || {};
    const session = await createQuizSession(baseUrl, token, quizId);
    const submission = await submitQuizAnswers(baseUrl, quizId, session.cookie, answers);

    if (submission.html.includes("Please answer all questions before submitting")) {
      return NextResponse.json({ message: "Please answer all questions before submitting." }, { status: 400 });
    }

    if (submission.html.includes("Attempt has been over")) {
      return NextResponse.json({ message: "Attempt has been over." }, { status: 409 });
    }

    return NextResponse.json({ message: "Quiz submitted successfully." });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to submit quiz.";
    return NextResponse.json({ message }, { status: 500 });
  }
}