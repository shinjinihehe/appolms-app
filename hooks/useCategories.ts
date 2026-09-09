import { useState, useCallback } from "react";
import { useApp } from "../app/context/AppContext";
import { useAuth } from "../app/context/AuthContext";

export function useCategories() {
  const { baseUrl } = useApp();
  const { token } = useAuth();
  
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [errorCategories, setErrorCategories] = useState<string | null>(null);

  const [categoryCourses, setCategoryCourses] = useState<any[]>([]);
  const [isLoadingCategoryCourses, setIsLoadingCategoryCourses] = useState(false);
  const [errorCategoryCourses, setErrorCategoryCourses] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    if (!baseUrl) return;
    setIsLoadingCategories(true);
    setErrorCategories(null);
    try {
      const headers: Record<string, string> = {
        "Accept": "application/json"
      };
      if (token) headers["Authorization"] = `Bearer ${token}`;
      const res = await fetch(`${baseUrl}/api/categories`, { headers });
      if (!res.ok) throw new Error("Failed to fetch categories");
      const data = await res.json();
      setCategories(data || []);
      return data;
    } catch (err: any) {
      setErrorCategories(err.message);
      return [];
    } finally {
      setIsLoadingCategories(false);
    }
  }, [baseUrl, token]);

  const fetchCategoryWiseCourses = useCallback(async (categoryId: string | number) => {
    if (!baseUrl) return;
    setIsLoadingCategoryCourses(true);
    setErrorCategoryCourses(null);
    try {
      const headers: Record<string, string> = {
        "Accept": "application/json"
      };
      if (token) headers["Authorization"] = `Bearer ${token}`;
      const res = await fetch(`${baseUrl}/api/category_wise_course?category_id=${categoryId}`, { headers });
      if (!res.ok) throw new Error("Failed to fetch category courses");
      const data = await res.json();
      setCategoryCourses(data || []);
      return data;
    } catch (err: any) {
      setErrorCategoryCourses(err.message);
      return [];
    } finally {
      setIsLoadingCategoryCourses(false);
    }
  }, [baseUrl, token]);

  return {
    categories,
    isLoadingCategories,
    errorCategories,
    fetchCategories,
    categoryCourses,
    isLoadingCategoryCourses,
    errorCategoryCourses,
    fetchCategoryWiseCourses,
  };
}
