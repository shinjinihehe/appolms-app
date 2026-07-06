import { useState, useEffect, useCallback } from "react";
import { useApp } from "../app/context/AppContext";
import { useAuth } from "../app/context/AuthContext";

export function useCourses() {
  const { baseUrl } = useApp();
  const { token } = useAuth();
  
  const [topCourses, setTopCourses] = useState<any[]>([]);
  const [isLoadingTopCourses, setIsLoadingTopCourses] = useState(false);
  const [errorTopCourses, setErrorTopCourses] = useState<string | null>(null);

  const fetchTopCourses = useCallback(async () => {
    if (!baseUrl) return;
    setIsLoadingTopCourses(true);
    setErrorTopCourses(null);
    try {
      const res = await fetch(`${baseUrl}/api/top_courses`);
      if (!res.ok) throw new Error("Failed to fetch top courses");
      const data = await res.json();
      setTopCourses(data || []);
      return data;
    } catch (err: any) {
      setErrorTopCourses(err.message);
      return [];
    } finally {
      setIsLoadingTopCourses(false);
    }
  }, [baseUrl]);

  const fetchFilteredCourses = useCallback(async (
    categoryId: string = "all", 
    price: string = "all", 
    level: string = "all", 
    language: string = "all", 
    rating: string = "all",
    search: string = ""
  ) => {
    if (!baseUrl) return [];
    setIsLoadingTopCourses(true);
    setErrorTopCourses(null);
    try {
      const url = `${baseUrl}/api/filter_course?selected_category=${categoryId}&selected_price=${price}&selected_level=${level}&selected_language=${language}&selected_rating=${rating}&selected_search_string=${encodeURIComponent(search)}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch filtered courses");
      const data = await res.json();
      setTopCourses(data || []);
      return data;
    } catch (err: any) {
      setErrorTopCourses(err.message);
      return [];
    } finally {
      setIsLoadingTopCourses(false);
    }
  }, [baseUrl]);

  const fetchCourseDetails = useCallback(async (courseId: string | number) => {
    if (!baseUrl) return null;
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "Accept": "application/json",
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    try {
      const res = await fetch(`${baseUrl}/api/course_details_by_id?course_id=${courseId}`, {
        headers,
      });
      if (!res.ok) throw new Error("Failed to fetch course details");
      const data = await res.json();
      return Array.isArray(data) && data.length > 0 ? data[0] : null;
    } catch (err: any) {
      console.error(err);
      return null;
    }
  }, [baseUrl, token]);

  useEffect(() => {
    if (baseUrl) {
      fetchTopCourses();
    }
  }, [baseUrl, fetchTopCourses]);

  return {
    topCourses,
    isLoadingTopCourses,
    errorTopCourses,
    fetchTopCourses,
    fetchFilteredCourses,
    fetchCourseDetails,
  };
}
