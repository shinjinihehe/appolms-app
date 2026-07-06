"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useMyCourses } from "../../../hooks/useMyCourses";

export default function MyCourseDetailPage() {
  const router = useRouter();
  const params = useParams();
  const courseId = params.id as string;

  const { myCourses, fetchCourseSections, fetchLiveClass, toggleLessonCompleted } = useMyCourses();
  
  const [activeTab, setActiveTab] = useState("lessons");
  const [openAccordionIds, setOpenAccordionIds] = useState<number[]>([]);
  const [sections, setSections] = useState<any[]>([]);
  const [liveClassData, setLiveClassData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);

  const course = myCourses.find(c => c.id.toString() === courseId) || null;

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [sectionsData, liveData] = await Promise.allSettled([
          fetchCourseSections(courseId),
          fetchLiveClass(courseId)
        ]);
        
        if (sectionsData.status === "fulfilled" && sectionsData.value) {
          setSections(sectionsData.value);
          if (sectionsData.value.length > 0) {
            setOpenAccordionIds([sectionsData.value[0].id]);
          }
        }
        
        if (liveData.status === "fulfilled" && liveData.value) {
          setLiveClassData(liveData.value);
        }
      } catch (e) {
        console.error("Failed to load course details", e);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (courseId) {
      loadData();
    }
  }, [courseId, fetchCourseSections, fetchLiveClass]);

  const toggleAccordion = (id: number) => {
    if (openAccordionIds.includes(id)) {
      setOpenAccordionIds(openAccordionIds.filter(aId => aId !== id));
    } else {
      setOpenAccordionIds([...openAccordionIds, id]);
    }
  };

  const PlaceholderImage = () => (
    <div className="w-full h-full bg-[#E8EDF1] flex items-center justify-center rounded-lg">
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#B0BEC5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
        <circle cx="8.5" cy="8.5" r="1.5"></circle>
        <polyline points="21 15 16 10 5 21"></polyline>
      </svg>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-[#FDFDFD] pt-10 pb-6">
      {/* Clipboard copy toast */}
      {shareCopied && (
        <div className="fixed top-14 left-1/2 -translate-x-1/2 z-[100] bg-[#333] text-white text-[13px] font-medium px-4 py-2 rounded-xl shadow-lg">
          Link copied to clipboard!
        </div>
      )}
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-white">
        <button onClick={() => router.back()} className="p-2 -ml-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
        </button>

      </div>

      <div className="px-5 mt-3">
        {/* Course Title above the card */}
        <h1 className="text-[17px] font-semibold text-[#111] mb-5 leading-snug">
          {course ? course.title : "Course Details"}
        </h1>

        {/* Course Info Card */}
        <div className="bg-white rounded-[16px] shadow-[0_2px_15px_rgba(0,0,0,0.04)] p-4 mb-6">
          <div className="flex items-start mb-6">
            <div className="w-[72px] h-[54px] shrink-0 mr-4">
              {course?.thumbnail ? (
                <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover rounded-lg" />
              ) : (
                <PlaceholderImage />
              )}
            </div>
            <div className="flex-1 flex justify-between relative">
              <h2 className="text-[15px] text-[#111] leading-tight pt-1 pr-2">
                {course ? course.title : ""}
              </h2>
              {/* 3-dot menu */}
              <div className="relative shrink-0">
                <button
                  className="text-[#757575] p-1 -mr-2 -mt-1"
                  onClick={(e) => { e.stopPropagation(); setShowShareMenu(v => !v); }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <circle cx="12" cy="5" r="2"></circle>
                    <circle cx="12" cy="12" r="2"></circle>
                    <circle cx="12" cy="19" r="2"></circle>
                  </svg>
                </button>
                {showShareMenu && (
                  <>
                    {/* backdrop to close */}
                    <div className="fixed inset-0 z-40" onClick={() => setShowShareMenu(false)} />
                    <div className="absolute right-0 top-7 z-50 bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.12)] min-w-[160px] overflow-hidden">
                      <button
                        className="w-full text-left px-4 py-3 text-[14px] text-[#111] hover:bg-[#F5F5F5] transition-colors flex items-center gap-2"
                        onClick={async () => {
                          setShowShareMenu(false);
                          const link = course?.shareable_link || window.location.href;
                          if (navigator.share) {
                            try {
                              await navigator.share({ title: course?.title, url: link });
                            } catch (_) {}
                          } else {
                            await navigator.clipboard.writeText(link);
                            setShareCopied(true);
                            setTimeout(() => setShareCopied(false), 2000);
                          }
                        }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle>
                          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                        </svg>
                        Share this Course
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
          
          <div className="w-full h-[6px] bg-gray-300 rounded-full mb-3 overflow-hidden">
            <div 
              className="h-full bg-[#5851EF] rounded-full transition-all duration-300"
              style={{ width: `${course?.completion || 0}%` }}
            ></div>
          </div>
          
          <div className="flex justify-between items-center text-[11px] text-[#757575] font-medium">
            <span>{course?.completion || 0}% Complete</span>
            <span>{course?.total_number_of_completed_lessons || 0}/{course?.total_number_of_lessons || 0}</span>
          </div>
        </div>

        {/* Tabs Row */}
        <div className="flex space-x-3 mb-6">
          <button 
            onClick={() => setActiveTab("lessons")}
            className={`flex-1 flex items-center justify-center py-3.5 rounded-2xl font-medium text-[15px] transition-colors ${
              activeTab === "lessons" 
                ? "bg-[#5851EF] text-white" 
                : "bg-white text-[#5851EF]"
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
            Lessons
          </button>
          
          <button 
            onClick={() => setActiveTab("liveClass")}
            className={`flex-1 flex items-center justify-center py-3.5 rounded-2xl font-medium text-[15px] transition-colors ${
              activeTab === "liveClass" 
                ? "bg-[#5851EF] text-white" 
                : "bg-white text-[#5851EF]"
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
              <polygon points="23 7 16 12 23 17 23 7"></polygon>
              <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
              <line x1="8" y1="8" x2="8" y2="16"></line>
              <line x1="4" y1="12" x2="12" y2="12"></line>
            </svg>
            Live Class
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "lessons" && (
          <div className="flex flex-col space-y-4">
            {isLoading ? (
              <div className="text-center text-[#757575] py-8 text-[14px]">Loading...</div>
            ) : sections.length === 0 ? (
              <div className="text-center text-[#757575] py-8 text-[14px]">
                No lessons found for this course.
              </div>
            ) : sections.map((section: any, sIdx: number) => {
              const isAccordionOpen = openAccordionIds.includes(section.id);
              
              return (
                <div key={section.id} className="bg-white rounded-[16px] shadow-[0_2px_20px_rgba(0,0,0,0.03)] p-4 cursor-pointer" onClick={() => toggleAccordion(section.id)}>
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-[16px] font-semibold text-[#111] mb-3">
                        {sIdx + 1}. {section.title}
                      </h3>
                      <div className="flex space-x-3">
                        <div className="bg-[#E0F7FA] text-[#00BCD4] px-2 py-1 rounded-[4px] text-[10px] font-medium tracking-wide">
                          {section.totalDuration || "00:00:00"}
                        </div>
                        <div className="bg-[#FFF3E0] text-[#FF9800] px-2 py-1 rounded-[4px] text-[10px] font-medium tracking-wide">
                          {section.lessons?.length || 0} Lessons
                        </div>
                      </div>
                    </div>
                    <div className="pt-1 pr-1">
                      {isAccordionOpen ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#5851EF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                      )}
                    </div>
                  </div>

                  {/* Expanded Lessons List */}
                  {isAccordionOpen && (
                    <div className="mt-6 flex flex-col cursor-default" onClick={(e) => e.stopPropagation()}>
                      {section.lessons?.map((lesson: any, idx: number, arr: any[]) => (
                        <div key={lesson.id} className="flex flex-col">
                          <div className="flex items-center py-4">
                            {/* Checkbox */}
                            <button 
                              className="mr-3 shrink-0 cursor-pointer p-1 -m-1"
                              onClick={async (e) => {
                                e.stopPropagation();
                                const newProgress = lesson.is_completed == 1 ? 0 : 1;
                                try {
                                  // Optimistically update UI if you want, but for now just call API and refresh data
                                  await toggleLessonCompleted(lesson.id, newProgress);
                                  // Re-fetch course sections to get updated progress
                                  const updatedSections = await fetchCourseSections(courseId);
                                  setSections(updatedSections);
                                } catch (err) {
                                  console.error("Error updating progress", err);
                                }
                              }}
                            >
                              {lesson.is_completed == 1 ? (
                                <div className="w-[18px] h-[18px] rounded-[3px] bg-[#5851EF] flex items-center justify-center">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                </div>
                              ) : (
                                <div className="w-[18px] h-[18px] rounded-[3px] border-2 border-[#111] bg-white"></div>
                              )}
                            </button>
                            
                            {/* Icon */}
                            <div className="mr-3 shrink-0 text-[#757575]">
                              {["video-url", "vimeo-url", "google_drive", "system-video"].includes(lesson.lesson_type) ? (
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                  <circle cx="12" cy="12" r="10"></circle>
                                  <polygon points="10 8 16 12 10 16 10 8"></polygon>
                                </svg>
                              ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                                  <path d="M12 2v20"></path>
                                </svg>
                              )}
                            </div>

                            {/* Title */}
                            <div className="flex-1 text-[#757575] text-[14px]">
                              {lesson.title}
                            </div>
                          </div>
                          {/* Divider */}
                          {idx < arr.length - 1 && (
                            <div className="h-[1px] bg-gray-200 w-full"></div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {activeTab === "liveClass" && (!liveClassData || !liveClassData.live_classes || liveClassData.live_classes.length === 0) && (
          <div className="mt-4 px-2">
            <div className="bg-[#2A2A2A] text-white p-4 text-center text-[15px] leading-relaxed">
              No live class is scheduled to this course yet. Please come back later.
            </div>
          </div>
        )}

        {activeTab === "liveClass" && liveClassData?.live_classes?.map((liveClass: any, index: number) => (
          <div key={index} className="bg-white rounded-[16px] shadow-[0_2px_20px_rgba(0,0,0,0.03)] flex flex-col p-4 mb-4 border border-gray-50">
            <div className="flex justify-center items-center py-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
              <span className="ml-2 text-[#111] text-[15px]">Zoom live class schedule</span>
            </div>
            <div className="text-center text-[#111] text-[15px] mb-3">
              {liveClassData.zoomSdk || "active"}
            </div>
            <div className="flex justify-center items-center pb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
              <span className="ml-2 text-[#111] text-[15px]">{liveClass.date_and_time}</span>
            </div>
            <div className="bg-gray-100 py-3 text-center text-[#111] text-[15px] mb-4">
              Everyone must join
            </div>
            <a 
              href={liveClass.join_url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-[#5851EF] text-white rounded-2xl py-3.5 flex justify-center items-center text-[16px] font-medium w-full mt-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect><line x1="8" y1="8" x2="8" y2="16"></line><line x1="4" y1="12" x2="12" y2="12"></line></svg>
              Join live video class
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
