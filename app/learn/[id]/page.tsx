"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useMyCourses } from "../../../hooks/useMyCourses";

export default function CoursePlayerPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;

  const { myCourses, fetchCourseSections } = useMyCourses();
  
  const [sections, setSections] = useState<any[]>([]);
  const [activeLesson, setActiveLesson] = useState<any>(null);
  const [expandedSection, setExpandedSection] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const course = myCourses.find(c => c.id.toString() === courseId) || { title: "Course Details" };

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const sectionsData = await fetchCourseSections(courseId);
        setSections(sectionsData || []);
        if (sectionsData && sectionsData.length > 0) {
          setExpandedSection(sectionsData[0].id);
          if (sectionsData[0].lessons && sectionsData[0].lessons.length > 0) {
            setActiveLesson(sectionsData[0].lessons[0]);
          }
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    if (courseId) {
      loadData();
    }
  }, [courseId, fetchCourseSections]);

  const toggleSection = (sectionId: number) => {
    if (expandedSection === sectionId) {
      setExpandedSection(null);
    } else {
      setExpandedSection(sectionId);
    }
  };

  if (isLoading) {
    return <div className="flex min-h-screen items-center justify-center bg-black text-white">Loading player...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-[var(--color-background)]">
      {/* Video Player Section */}
      <div className="w-full bg-black sticky top-0 z-50">
        <div className="relative pt-[56.25%]">
          {/* 16:9 Aspect Ratio Placeholder */}
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 text-white">
            <button 
              onClick={() => router.back()}
              className="absolute top-4 left-4 p-2 bg-black/50 rounded-full hover:bg-black/80 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
            </button>
            <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mb-4 cursor-pointer hover:bg-white/30 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
            </div>
            <p className="text-sm font-medium">{activeLesson ? activeLesson.title : "No lesson selected"}</p>
          </div>
        </div>
      </div>

      {/* Course Info & Curriculum */}
      <div className="flex-1 p-4 pb-12">
        <h1 className="text-xl font-bold text-[var(--color-text-dark)] mb-1">{course.title}</h1>
        <p className="text-sm text-[var(--color-primary)] font-medium mb-6">Curriculum</p>

        <div className="space-y-4">
          {sections.map((section) => (
            <div key={section.id} className="border border-gray-100 rounded-xl overflow-hidden bg-white shadow-sm">
              <button 
                onClick={() => toggleSection(section.id)}
                className="w-full px-4 py-3 flex justify-between items-center bg-[var(--color-background-input)] text-left"
              >
                <span className="font-bold text-sm text-[var(--color-text-dark)]">{section.title}</span>
                <svg 
                  xmlns="http://www.w3.org/2000/svg" width="16" height="16" 
                  viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                  className={`transform transition-transform ${expandedSection === section.id ? "rotate-180" : ""}`}
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>
              
              {expandedSection === section.id && (
                <div className="divide-y divide-gray-50">
                  {section.lessons?.map((lesson: any) => (
                    <div 
                      key={lesson.id} 
                      onClick={() => setActiveLesson(lesson)}
                      className={`px-4 py-3 flex items-start cursor-pointer transition-colors ${
                        activeLesson?.id === lesson.id ? "bg-primary/5" : "hover:bg-gray-50"
                      }`}
                    >
                      <div className="mr-3 mt-0.5">
                        {lesson.is_completed === "1" ? (
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" className="text-[var(--color-success)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                        ) : activeLesson?.id === lesson.id ? (
                          <div className="w-[18px] h-[18px] rounded-full border-2 border-[var(--color-primary)] flex items-center justify-center">
                            <div className="w-2 h-2 bg-[var(--color-primary)] rounded-full"></div>
                          </div>
                        ) : (
                          <div className="w-[18px] h-[18px] rounded-full border-2 border-gray-300"></div>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className={`text-sm ${activeLesson?.id === lesson.id ? "font-bold text-[var(--color-primary)]" : "font-medium text-[var(--color-text-dark)]"}`}>
                          {lesson.title}
                        </p>
                        <p className="text-xs text-[var(--color-text-grey)] mt-1 flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" className="mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                          {lesson.duration}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
