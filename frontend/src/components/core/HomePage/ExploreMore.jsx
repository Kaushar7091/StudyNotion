import React, { useState, useEffect } from "react";
import { HomePageExplore } from "../../../data/homepage-explore";
import CourseCard from "./CourseCard";
import HighlightText from "./HighlightText";
import { getAllCourses } from "../../../services/operations/courseDetailsAPI";

const tabsName = [
  "Free",
  "New to coding",
  "Most popular",
  "Skills paths",
  "Career paths",
];

const ExploreMore = () => {
  const [currentTab, setCurrentTab] = useState(tabsName[0]);
  const [courses, setCourses] = useState(HomePageExplore[0].courses);
  const [currentCard, setCurrentCard] = useState(
    HomePageExplore[0].courses[0].heading
  );
  const [exploreData, setExploreData] = useState(HomePageExplore);

  const getDynamicExploreData = (dbCourses) => {
    const mapCourse = (c) => {
      let lessonCount = 0;
      c.courseContent?.forEach((section) => {
        lessonCount += section.subSection?.length || 0;
      });
      return {
        heading: c.courseName,
        description: c.courseDescription?.split(" ").slice(0, 15).join(" ") + "..." || "No description provided.",
        level: "Beginner",
        lessionNumber: lessonCount || 6,
      };
    };

    // Free: courses where price is 0
    const freeCourses = dbCourses.filter((c) => c.price === 0).map(mapCourse);
    
    // New to coding: newest courses
    const newCourses = [...dbCourses].map(mapCourse);

    // Most popular: sorted by enrolled students
    const popularCourses = [...dbCourses]
      .sort((a, b) => (b.studentsEnrolled?.length || 0) - (a.studentsEnrolled?.length || 0))
      .map(mapCourse);

    // Skills paths: final slice
    const skillsCourses = [...dbCourses].slice(Math.max(0, dbCourses.length - 3)).map(mapCourse);

    // Career paths: initial slice
    const careerCourses = [...dbCourses].slice(0, 3).map(mapCourse);

    return [
      {
        tag: "Free",
        courses: freeCourses.length >= 3 ? freeCourses.slice(0, 3) : [...freeCourses, ...HomePageExplore[0].courses].slice(0, 3),
      },
      {
        tag: "New to coding",
        courses: newCourses.length >= 3 ? newCourses.slice(0, 3) : [...newCourses, ...HomePageExplore[1].courses].slice(0, 3),
      },
      {
        tag: "Most popular",
        courses: popularCourses.length >= 3 ? popularCourses.slice(0, 3) : [...popularCourses, ...HomePageExplore[2].courses].slice(0, 3),
      },
      {
        tag: "Skills paths",
        courses: skillsCourses.length >= 3 ? skillsCourses.slice(0, 3) : [...skillsCourses, ...HomePageExplore[3].courses].slice(0, 3),
      },
      {
        tag: "Career paths",
        courses: careerCourses.length >= 3 ? careerCourses.slice(0, 3) : [...careerCourses, ...HomePageExplore[4].courses].slice(0, 3),
      },
    ];
  };

  useEffect(() => {
    const fetchCourses = async () => {
      const res = await getAllCourses();
      if (res && res.length > 0) {
        const dynamicData = getDynamicExploreData(res);
        setExploreData(dynamicData);
        
        // Load the courses for the currently active tab
        const activeResult = dynamicData.find((d) => d.tag === currentTab);
        if (activeResult) {
          setCourses(activeResult.courses);
          setCurrentCard(activeResult.courses[0]?.heading || "");
        }
      }
    };
    fetchCourses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setMyCards = (value) => {
    setCurrentTab(value);
    const result = exploreData.filter((course) => course.tag === value);
    if (result.length > 0) {
      setCourses(result[0].courses);
      setCurrentCard(result[0].courses[0]?.heading || "");
    }
  };

  return (
    <div>
      {/* Explore more section */}
      <div>
        <div className="text-4xl font-semibold text-center my-10">
          Unlock the
          <HighlightText text={"Power of Code"} />
          <p className="text-center text-richblack-300 text-lg font-semibold mt-1">
            Learn to Build Anything You Can Imagine
          </p>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="hidden lg:flex gap-5 -mt-5 mx-auto w-max bg-richblack-800 text-richblack-200 p-1 rounded-full font-medium drop-shadow-[0_1.5px_rgba(255,255,255,0.25)]">
        {tabsName.map((ele, index) => {
          return (
            <div
              className={` text-[16px] flex flex-row items-center gap-2 ${
                currentTab === ele
                  ? "bg-richblack-900 text-richblack-5 font-medium"
                  : "text-richblack-200"
              } px-7 py-[7px] rounded-full transition-all duration-200 cursor-pointer hover:bg-richblack-900 hover:text-richblack-5`}
              key={index}
              onClick={() => setMyCards(ele)}
            >
              {ele}
            </div>
          );
        })}
      </div>
      <div className="hidden lg:block lg:h-[200px]"></div>

      {/* Cards Group */}
      <div className="lg:absolute gap-10 justify-center lg:gap-0 flex lg:justify-between flex-wrap w-full lg:bottom-[0] lg:left-[50%] lg:translate-x-[-50%] lg:translate-y-[50%] text-black lg:mb-0 mb-7 lg:px-0 px-3">
        {courses.map((ele, index) => {
          return (
            <CourseCard
              key={index}
              cardData={ele}
              currentCard={currentCard}
              setCurrentCard={setCurrentCard}
            />
          );
        })}
      </div>
    </div>
  );
};

export default ExploreMore;