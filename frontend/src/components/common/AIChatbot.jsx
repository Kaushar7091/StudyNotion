import React, { useState } from "react";
import { AiOutlineMessage, AiOutlineClose, AiOutlineSend, AiOutlineFullscreen, AiOutlineFullscreenExit } from "react-icons/ai";
import { useSelector } from "react-redux";
import { apiConnector } from "../../services/apiconnector";
import { courseEndpoints } from "../../services/apis";

export default function AIChatbot() {
  const { token } = useSelector((state) => state.auth);
  const [isOpen, setIsOpen] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: "Hi there! I am your StudyNotion AI Tutor. How can I help you with your learning today?",
    },
  ]);



  // Handle sending a message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput("");
    
    // Add user message to local state
    setMessages((prev) => [...prev, { sender: "user", text: userMessage }]);
    setLoading(true);

    try {
      // API call using the central apiConnector and endpoints
      const response = await apiConnector(
        "POST",
        courseEndpoints.ASK_TUTOR_API,
        { question: userMessage },
        {
          Authorization: `Bearer ${token}`,
        }
      );

      if (response.data?.success) {
        setMessages((prev) => [
          ...prev,
          { sender: "ai", text: response.data.data },
        ]);
      } else {
        throw new Error(response.data?.message || "Failed response");
      }
    } catch (error) {
      console.error("AI Error:", error);
      const errorMessage = error.response?.data?.message || error.message || "Unknown error";
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: `Sorry, I encountered an error: ${errorMessage}. Please try again.`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Only show the chatbot to logged-in students
  if (!token) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[1000]">
      {/* 1. Floating Action Button (Bubble Icon) */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-yellow-50 text-richblack-900 shadow-2xl hover:scale-105 transition-all duration-200"
        >
          <AiOutlineMessage fontSize={28} />
        </button>
      )}

      {/* 2. Chatbot Window */}
      {isOpen && (
        <div className={`flex flex-col rounded-2xl border border-richblack-700 bg-richblack-800 shadow-2xl transition-all duration-300 ${
          isMaximized 
            ? "h-[80vh] w-[90vw] md:w-[650px] md:h-[600px]" 
            : "h-[450px] w-[320px] md:w-[360px]"
        }`}>
          {/* Header */}
          <div className="flex items-center justify-between border-b border-richblack-700 bg-richblack-900 p-4 rounded-t-2xl">
            <div className="flex items-center gap-x-2">
              <div className="h-3 w-3 rounded-full bg-caribbeangreen-200 animate-pulse"></div>
              <p className="font-semibold text-richblack-5">AI Study Assistant</p>
            </div>
            <div className="flex items-center gap-x-3">
              <button
                onClick={() => setIsMaximized(!isMaximized)}
                className="text-richblack-100 hover:text-white transition-all duration-200"
                title={isMaximized ? "Minimize" : "Maximize"}
              >
                {isMaximized ? (
                  <AiOutlineFullscreenExit fontSize={20} />
                ) : (
                  <AiOutlineFullscreen fontSize={20} />
                )}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="text-richblack-100 hover:text-white transition-all duration-200"
              >
                <AiOutlineClose fontSize={20} />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                    msg.sender === "user"
                      ? "bg-yellow-50 text-richblack-900 rounded-br-none"
                      : "bg-richblack-900 text-richblack-5 rounded-bl-none border border-richblack-800"
                  }`}
                >
                  {/* Standard text support */}
                  <p className="whitespace-pre-line">{msg.text}</p>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="rounded-2xl rounded-bl-none border border-richblack-800 bg-richblack-900 px-4 py-2 text-sm text-richblack-300">
                  Thinking...
                </div>
              </div>
            )}
          </div>

          {/* Input Footer */}
          <form onSubmit={handleSendMessage} className="border-t border-richblack-700 p-3 flex gap-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question..."
              className="flex-1 rounded-lg bg-richblack-900 px-3 py-2 text-sm text-richblack-5 border border-richblack-700 focus:outline-none focus:border-yellow-50"
            />
            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center rounded-lg bg-yellow-50 p-2 text-richblack-900 hover:bg-yellow-100"
            >
              <AiOutlineSend fontSize={18} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
