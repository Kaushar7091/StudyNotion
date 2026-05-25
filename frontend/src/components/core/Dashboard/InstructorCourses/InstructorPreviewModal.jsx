import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { toast } from "react-hot-toast"
import { RxCross2 } from "react-icons/rx"
import { FaChevronDown, FaChevronUp, FaPlayCircle } from "react-icons/fa"
import { Player, BigPlayButton } from "video-react"
import "video-react/dist/video-react.css"

import { getFullDetailsOfCourse } from "../../../../services/operations/courseDetailsAPI"

export default function InstructorPreviewModal({ course, onClose }) {
  const { token } = useSelector((state) => state.auth)
  const [loading, setLoading] = useState(true)
  const [courseData, setCourseData] = useState(null)
  const [activeVideo, setActiveVideo] = useState(null)
  const [activeLectureId, setActiveLectureId] = useState(null)
  const [expandedSections, setExpandedSections] = useState({})

  useEffect(() => {
    const fetchFullDetails = async () => {
      try {
        setLoading(true)
        const result = await getFullDetailsOfCourse(course._id, token)
        if (result && result.courseDetails) {
          setCourseData(result.courseDetails)
          
          // Auto-select first lecture video if available
          const firstSection = result.courseDetails.courseContent?.[0]
          const firstLecture = firstSection?.subSection?.[0]
          if (firstLecture) {
            setActiveVideo(firstLecture.videoUrl)
            setActiveLectureId(firstLecture._id)
          }

          // Expand the first section by default
          if (firstSection) {
            setExpandedSections({ [firstSection._id]: true })
          }
        }
      } catch (error) {
        console.error("Failed to load course details", error)
        toast.error("Could not fetch course lectures")
      } finally {
        setLoading(false)
      }
    }

    if (course?._id) {
      fetchFullDetails()
    }
  }, [course, token])

  const toggleSection = (sectionId) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }))
  }

  const handleLectureSelect = (lecture) => {
    if (!lecture.videoUrl) {
      toast.error("This lecture does not have a video yet")
      return
    }
    setActiveVideo(lecture.videoUrl)
    setActiveLectureId(lecture._id)
  }

  return (
    <div className="fixed inset-0 z-[1000] !mt-0 grid h-screen w-screen place-items-center overflow-y-auto bg-richblack-950 bg-opacity-70 backdrop-blur-md transition-all duration-300">
      <div className="relative my-8 w-11/12 max-w-[1050px] rounded-2xl border border-richblack-700 bg-richblack-800 p-1 shadow-2xl transition-all duration-300">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-richblack-700 bg-richblack-800 px-6 py-4 rounded-t-2xl">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-richblack-5">
              Quick Preview: {course.courseName}
            </h2>
            <p className="text-xs text-richblack-400">
              Browse through curriculum and play active lecture videos
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-richblack-300 hover:bg-richblack-700 hover:text-richblack-5 transition-all duration-200"
          >
            <RxCross2 size={24} />
          </button>
        </div>

        {/* Modal Content */}
        {loading ? (
          <div className="flex min-h-[450px] flex-col items-center justify-center space-y-4 py-20 text-center">
            <div className="spinner"></div>
            <p className="text-sm font-medium text-richblack-200">Loading course curriculum...</p>
          </div>
        ) : !courseData || !courseData.courseContent || courseData.courseContent.length === 0 ? (
          <div className="flex min-h-[350px] flex-col items-center justify-center py-20 text-center text-richblack-300">
            <p className="text-lg font-medium">No sections or lectures found for this course.</p>
            <p className="text-sm text-richblack-400 mt-2">Go to the course builder to add lectures.</p>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row min-h-[480px]">
            
            {/* Left Column: Video Player */}
            <div className="flex-1 bg-black p-4 flex items-center justify-center min-h-[250px] lg:min-h-0 rounded-bl-none lg:rounded-bl-2xl">
              {activeVideo ? (
                <div className="w-full aspect-video rounded-lg overflow-hidden shadow-lg border border-richblack-800">
                  <Player
                    key={activeVideo} // key re-mounts Player on video source change
                    aspectRatio="16:9"
                    playsInline
                    src={activeVideo}
                    autoPlay
                  >
                    <BigPlayButton position="center" />
                  </Player>
                </div>
              ) : (
                <div className="text-center text-richblack-400 space-y-2 p-8">
                  <p className="text-lg font-semibold">No Video Selected</p>
                  <p className="text-xs max-w-[280px]">
                    Select a lecture from the curriculum outline on the right to start playing.
                  </p>
                </div>
              )}
            </div>

            {/* Right Column: Curriculum Outline */}
            <div className="w-full lg:w-[380px] border-t lg:border-t-0 lg:border-l border-richblack-700 bg-richblack-900 max-h-[500px] overflow-y-auto rounded-br-2xl rounded-bl-2xl lg:rounded-bl-none">
              <div className="p-4 border-b border-richblack-800 bg-richblack-900 sticky top-0 z-10">
                <span className="text-xs font-bold uppercase tracking-wider text-richblack-400">
                  Course Structure ({courseData.courseContent.length} Sections)
                </span>
              </div>
              
              <div className="divide-y divide-richblack-800">
                {courseData.courseContent.map((section) => {
                  const isExpanded = !!expandedSections[section._id]
                  return (
                    <div key={section._id} className="flex flex-col">
                      {/* Section Header Button */}
                      <button
                        onClick={() => toggleSection(section._id)}
                        className="flex items-center justify-between px-5 py-4 w-full text-left bg-richblack-900 hover:bg-richblack-850 transition-all duration-150"
                      >
                        <span className="font-semibold text-sm text-richblack-100 max-w-[85%] truncate">
                          {section.sectionName}
                        </span>
                        <span className="text-richblack-300">
                          {isExpanded ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
                        </span>
                      </button>

                      {/* Section Lectures Accordion Content */}
                      {isExpanded && (
                        <div className="bg-richblack-950 py-1 pl-2 pr-1 divide-y divide-richblack-900">
                          {section.subSection && section.subSection.length > 0 ? (
                            section.subSection.map((subSec) => {
                              const isActive = activeLectureId === subSec._id
                              return (
                                <button
                                  key={subSec._id}
                                  onClick={() => handleLectureSelect(subSec)}
                                  className={`flex items-center gap-x-3 px-4 py-3 w-full text-left rounded-md transition-all duration-150 ${
                                    isActive
                                      ? "bg-yellow-900 bg-opacity-25 text-yellow-50 font-medium border-l-2 border-yellow-50"
                                      : "text-richblack-300 hover:bg-richblack-850 hover:text-richblack-100"
                                  }`}
                                >
                                  <FaPlayCircle
                                    size={16}
                                    className={isActive ? "text-yellow-50 animate-pulse" : "text-richblack-400"}
                                  />
                                  <div className="flex flex-col overflow-hidden">
                                    <span className="text-xs truncate max-w-[280px]">
                                      {subSec.title}
                                    </span>
                                    {subSec.timeDuration && (
                                      <span className="text-[10px] text-richblack-500">
                                        Duration: {Math.round(subSec.timeDuration)}s
                                      </span>
                                    )}
                                  </div>
                                </button>
                              )
                            })
                          ) : (
                            <p className="text-[11px] text-richblack-500 px-5 py-3 italic">
                              No lectures inside this section
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  )
}
