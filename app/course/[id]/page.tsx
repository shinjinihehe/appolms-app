"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useCourses } from "../../../hooks/useCourses";
import { useAuth } from "../../context/AuthContext";

const parseList = (data: any): string[] => {
  if (Array.isArray(data)) return data.map(String);
  if (data && typeof data === "object") return Object.values(data).map(String);
  if (typeof data === "string") {
    try { return JSON.parse(data); } catch { return []; }
  }
  return [];
};

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;
  const { fetchCourseDetails } = useCourses();
  const { token } = useAuth();

  const [course, setCourse] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"includes" | "outcomes" | "required">("includes");
  const [openSections, setOpenSections] = useState<number[]>([0]);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      const data = await fetchCourseDetails(id as string);
      setCourse(data);
      setIsLoading(false);
    };
    loadData();
  }, [id, fetchCourseDetails]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="w-10 h-10 border-4 border-[#5851EF] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex min-h-screen items-center justify-center text-[#757575]">
        Course not found.
      </div>
    );
  }

  const includes = parseList(course.includes);
  const outcomes = parseList(course.outcomes);
  const requirements = parseList(course.requirements);
  const sections: any[] = Array.isArray(course.sections) ? course.sections : Object.values(course.sections || {});

  const isPurchased = course.is_purchased === 1 || course.is_purchased === true;
  const isPaid = course.is_paid === 1;
  const price = isPaid ? (course.price ?? "") : "Free";

  const toggleSection = (i: number) => {
    setOpenSections(prev =>
      prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]
    );
  };

  const tabContent = {
    includes: (
      <div className="px-4 pt-3 pb-4">
        <p className="text-[15px] font-semibold text-[#111] mb-3">What is Included</p>
        {includes.length === 0 ? (
          <p className="text-[#757575] text-sm">No info available.</p>
        ) : (
          <ul className="space-y-2">
            {includes.map((item, i) => (
              <li key={i} className="flex items-center border-b border-[#F0F0F0] pb-2 last:border-0">
                <span className="text-[#757575] text-[14px]">{item}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    ),
    outcomes: (
      <div className="px-4 pt-3 pb-4">
        <p className="text-[15px] font-semibold text-[#111] mb-3">What you will learn</p>
        {outcomes.length === 0 ? (
          <p className="text-[#757575] text-sm">No outcomes listed.</p>
        ) : (
          <ul className="space-y-2">
            {outcomes.map((item, i) => (
              <li key={i} className="text-[14px] text-[#757575]">{item}</li>
            ))}
          </ul>
        )}
      </div>
    ),
    required: (
      <div className="px-4 pt-3 pb-4">
        <p className="text-[15px] font-semibold text-[#111] mb-3">Course Requirements</p>
        {requirements.length === 0 ? (
          <p className="text-[#757575] text-sm">No requirements listed.</p>
        ) : (
          <ul className="space-y-2">
            {requirements.map((item, i) => (
              <li key={i} className="text-[14px] text-[#757575]">{item}</li>
            ))}
          </ul>
        )}
      </div>
    ),
  };

  return (
    <div className="flex flex-col min-h-screen bg-white pb-24">
      {/* Thumbnail + Back + Play + Heart */}
      <div className="relative w-full bg-[#E8EDF1] rounded-b-[28px] overflow-hidden" style={{ height: "260px" }}>
        {course.thumbnail ? (
          <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#B0BEC5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <circle cx="8.5" cy="8.5" r="1.5"></circle>
              <polyline points="21 15 16 10 5 21"></polyline>
            </svg>
          </div>
        )}

        {/* Back */}
        <button onClick={() => router.back()} className="absolute top-10 left-4 z-10">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
        </button>


        {/* Play button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-[50px] h-[50px] rounded-full bg-white shadow-md flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="#333" stroke="#333" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
          </div>
        </div>

        {/* Heart / Wishlist */}
        <div className="absolute top-12 right-14 z-10">
          <div className="w-[38px] h-[38px] rounded-full flex items-center justify-center"
            style={{ background: course.is_wishlisted ? "white" : "rgba(150,150,150,0.35)" }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
              fill={course.is_wishlisted ? "#5851EF" : "white"} stroke={course.is_wishlisted ? "#5851EF" : "white"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </div>
        </div>
      </div>

      {/* Body content */}
      <div className="px-5 pt-5">
        {/* Title + Share */}
        <div className="flex items-start justify-between mb-2">
          <h1 className="text-[18px] font-medium text-[#111] flex-1 pr-4 leading-snug">{course.title}</h1>
          <button className="mt-1 shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle>
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
            </svg>
          </button>
        </div>

        {/* Rating + Reviews + Price */}
        <div className="flex items-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="#F5A623" stroke="#F5A623" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
          </svg>
          <span className="text-[15px] text-[#757575] mr-1">{course.average_rating ?? "0.0"}</span>
          <span className="text-[15px] text-[#757575]">({course.total_reviews ?? 0} Reviews)</span>
          <div className="flex-1" />
          <span className="text-[26px] font-medium text-[#111]">{price}</span>
        </div>

        {/* Includes / Outcomes / Required Tab Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#F0F0F0] mb-5 overflow-hidden">
          {/* Tab Header */}
          <div className="flex p-2 gap-1">
            {(["includes", "outcomes", "required"] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="flex-1 py-2 rounded-xl text-[13px] font-medium transition-colors"
                style={activeTab === tab
                  ? { background: "#5851EF", color: "white" }
                  : { background: "transparent", color: "#555" }
                }
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
          {/* Tab Content */}
          <div className="min-h-[150px] max-h-[215px] overflow-y-auto">
            {tabContent[activeTab]}
          </div>
        </div>

        {/* Course Curriculum */}
        <p className="text-[17px] font-medium text-[#111] mb-3 px-1">Course curriculum</p>
        {sections.length === 0 ? (
          <p className="text-[#757575] text-sm px-1">No curriculum available.</p>
        ) : (
          <div className="flex flex-col gap-2 mb-6">
            {sections.map((section: any, i: number) => {
              const isOpen = openSections.includes(i);
              const lessons: any[] = Array.isArray(section.lessons) ? section.lessons : Object.values(section.lessons || {});
              const totalDuration = section.total_duration ?? section.duration ?? "";
              const lessonCount = lessons.length;

              return (
                <div key={i} className="bg-white rounded-2xl border border-[#F0F0F0] shadow-sm overflow-hidden">
                  <button
                    className="w-full flex items-center justify-between px-4 py-4"
                    onClick={() => toggleSection(i)}
                  >
                    <div className="text-left flex-1">
                      <p className="text-[14px] font-medium text-[#111]">
                        {i + 1}. {section.title}
                      </p>
                      <div className="flex gap-2 mt-1">
                        {totalDuration ? (
                          <span className="text-[11px] px-2 py-0.5 rounded-full font-medium text-[#5851EF]" style={{ background: "#E8F0FE" }}>
                            {totalDuration}
                          </span>
                        ) : null}
                        <span className="text-[11px] px-2 py-0.5 rounded-full font-medium text-[#E67E22]" style={{ background: "#FEF5E8" }}>
                          {lessonCount} Lessons
                        </span>
                      </div>
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#5851EF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                      style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </button>

                  {isOpen && lessons.length > 0 && (
                    <div className="border-t border-[#F0F0F0]">
                      {lessons.map((lesson: any, li: number) => (
                        <div key={li} className="flex items-center px-4 py-3 border-b border-[#F8F8F8] last:border-0">
                          <div className="w-8 h-8 rounded-full border border-[#DDD] flex items-center justify-center mr-3 shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polygon points="5 3 19 12 5 21 5 3"></polygon>
                            </svg>
                          </div>
                          <span className="text-[13px] text-[#333] flex-1">{lesson.title ?? lesson.name}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Bottom bar — matches Flutter exactly */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#F0F0F0] px-5 py-3 flex items-center z-50">
        {/* Account icon */}
        <div className="flex flex-col items-center mr-4">
          <button onClick={() => router.push("/account")}>
            <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#B0BEC5" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle>
            </svg>
          </button>
          <span className="text-[11px] text-[#B0BEC5] font-medium">Account</span>
        </div>

        {/* Divider */}
        <div className="h-10 w-[1px] bg-[#E0E0E0] mr-4" />

        {/* Action buttons */}
        <div className="flex flex-1 gap-2">
          {isPurchased ? (
            /* Purchased → green button */
            <button
              onClick={() => router.push(`/my-course/${course.id}`)}
              className="flex-1 py-3 rounded-xl text-white text-[14px] font-medium"
              style={{ background: "#27AE60" }}
            >
              Purchased
            </button>
          ) : isPaid ? (
            <button
              onClick={() => router.push("/my-wishlists")}
              className="flex-1 py-3 rounded-xl text-[14px] font-medium border border-[#5851EF]"
              style={{ color: "#5851EF", background: "white" }}
            >
              {course.is_wishlisted ? "View Wishlist" : "Add to Wishlist"}
            </button>
          ) : (
            /* Free → Enroll Now */
            <button
              className="flex-1 py-3 rounded-xl text-white text-[14px] font-medium"
              style={{ background: "#5851EF" }}
            >
              Enroll Now
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
