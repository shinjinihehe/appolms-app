import { useState, useCallback } from "react";
import { useApp } from "../app/context/AppContext";

export function useCategories() {
  const { baseUrl } = useApp();
  
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
      const res = await fetch(`${baseUrl}/api/categories`);
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
  }, [baseUrl]);

  const fetchCategoryWiseCourses = useCallback(async (categoryId: string | number) => {
    if (!baseUrl) return;
    setIsLoadingCategoryCourses(true);
    setErrorCategoryCourses(null);
    try {
      const res = await fetch(`${baseUrl}/api/category_wise_course?category_id=${categoryId}`);
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
  }, [baseUrl]);

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
