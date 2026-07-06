import { useState, useEffect, useCallback } from "react";
import { useApp } from "../app/context/AppContext";
import { useAuth } from "../app/context/AuthContext";

export function useMyCourses() {
  const { baseUrl } = useApp();
  const { token } = useAuth();
  
  const [myCourses, setMyCourses] = useState<any[]>([]);
  const [isLoadingMyCourses, setIsLoadingMyCourses] = useState(false);
  const [errorMyCourses, setErrorMyCourses] = useState<string | null>(null);

  const fetchMyCourses = useCallback(async () => {
    if (!baseUrl || !token) return;
    setIsLoadingMyCourses(true);
    setErrorMyCourses(null);
    try {
      const res = await fetch(`${baseUrl}/api/my_courses`, {
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });
      if (!res.ok) throw new Error("Failed to fetch my courses");
      const data = await res.json();
      setMyCourses(data || []);
    } catch (err: any) {
      setErrorMyCourses(err.message);
    } finally {
      setIsLoadingMyCourses(false);
    }
  }, [baseUrl, token]);

  const fetchCourseSections = useCallback(async (courseId: string | number) => {
    if (!baseUrl || !token) throw new Error("Base URL or Token not set");
    const res = await fetch(`${baseUrl}/api/sections?course_id=${courseId}`, {
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });
    if (!res.ok) throw new Error("Failed to fetch course sections");
    return res.json();
  }, [baseUrl, token]);

  const fetchLiveClass = useCallback(async (courseId: string | number) => {
    if (!baseUrl || !token) throw new Error("Base URL or Token not set");
    const res = await fetch(`${baseUrl}/api/zoom/meetings?course_id=${courseId}`, {
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });
    if (!res.ok) throw new Error("Failed to fetch live class");
    return res.json();
  }, [baseUrl, token]);

  const toggleLessonCompleted = useCallback(async (lessonId: string | number, progress: number) => {
    if (!baseUrl || !token) throw new Error("Base URL or Token not set");
    // In Flutter, it passes progress indirectly or just hits the endpoint
    // `api/save_course_progress?lesson_id=X&progress=Y`
    const url = `${baseUrl}/api/save_course_progress?lesson_id=${lessonId}&progress=${progress}`;
    const res = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });
    if (!res.ok) throw new Error("Failed to save progress");
    return res.json();
  }, [baseUrl, token]);

  useEffect(() => {
    if (baseUrl && token) {
      fetchMyCourses();
    }
  }, [baseUrl, token, fetchMyCourses]);

  return {
    myCourses,
    isLoadingMyCourses,
    errorMyCourses,
    fetchMyCourses,
    fetchCourseSections,
    fetchLiveClass,
    toggleLessonCompleted,
  };
}
