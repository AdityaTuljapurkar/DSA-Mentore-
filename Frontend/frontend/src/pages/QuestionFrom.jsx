import { useState } from "react";
import axios from "axios";

export default function QuestionForm() {
  const [topic, setTopic] = useState("");
  const [subtopic, setSubtopic] = useState("");
  const [level, setLevel] = useState("learner");
  const [known_topics, setKnown_topics] = useState("");
  const [goal, setGoal] = useState("learn_basics");
  const [additional_info, setAdditional_info] = useState("");
  const [submitQuestion, setSubmitQuestion] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const handle_submit = async (e) => {
    e.preventDefault();
    setFeedback(null);

    try {
      setSubmitQuestion(true);
      const accesstkn = localStorage.getItem("accessToken");
      const payload = {
        topic,
        subtopic,
        level,
        known_topics,
        goal,
        additional_info,
      };

      const url = "http://127.0.0.1:8000/api/submit_question_form";
      const header = accesstkn ? { Authorization: `Bearer ${accesstkn}` } : {};

      const response = await axios.post(url, payload, { headers: header });
      console.log("question created successfully : ", response.data);
      setFeedback({ type: "success", message: "Question generated! Refreshing..." });

      setTimeout(() => {
        window.location.reload();
      }, 1200);
    } catch (error) {
      console.log("error while submitting the answer : ", error);
      setFeedback({
        type: "error",
        message: error.response?.data?.error || "Failed to generate question.",
      });
    } finally {
      setSubmitQuestion(false);
    }
  };

  return (
    <section className="bg-white/[0.06] border border-white/[0.12] rounded-[20px] backdrop-blur-xl backdrop-saturate-150 shadow-[0_10px_40px_rgba(0,0,0,0.35)] p-[22px] mb-6">
      {/* Top row */}
      <div className="flex justify-between items-center mb-[18px]">
        <div>
          <h2 className="text-[15px] font-semibold text-[#eef0f6]">
            Create AI Question
          </h2>
          <p className="text-[12.5px] text-[#8a90a6] mt-1">
            Configure parameters to generate a new problem
          </p>
        </div>
        <span className="text-[10.5px] tracking-[0.08em] px-2.5 py-1 rounded-full border border-white/[0.12] text-[#8a90a6] uppercase font-medium">
          AI POWERED
        </span>
      </div>

      {/* Feedback Alert */}
      {feedback && (
        <div
          className={`mb-3.5 px-3.5 py-2 rounded-xl text-xs flex items-center gap-2 ${
            feedback.type === "success"
              ? "bg-[#3ddc97]/10 border border-[#3ddc97]/30 text-[#3ddc97]"
              : "bg-[#ff6b81]/10 border border-[#ff6b81]/30 text-[#ff6b81]"
          }`}
        >
          <span>{feedback.type === "success" ? "✓" : "⚠"}</span>
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Form Grid */}
      <form onSubmit={handle_submit}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* 1. Topic */}
          <div>
            <label
              htmlFor="topic"
              className="block text-[11px] uppercase tracking-[0.06em] text-[#8a90a6] mb-1.5"
            >
              Topic <span className="text-[#8b7bff]">*</span>
            </label>
            <input
              type="text"
              id="topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              required
              placeholder="e.g. Array, Binary Search, DP"
              className="w-full px-[13px] py-[11px] rounded-xl border border-white/[0.12] bg-white/5 text-[#eef0f6] text-sm outline-none placeholder:text-[#5f657a] focus:border-[#8b7bff] focus:ring-[3px] focus:ring-[#8b7bff]/[0.22] transition-all"
            />
          </div>

          {/* 2. Subtopic */}
          <div>
            <label
              htmlFor="subtopic"
              className="block text-[11px] uppercase tracking-[0.06em] text-[#8a90a6] mb-1.5"
            >
              Subtopic
            </label>
            <input
              type="text"
              id="subtopic"
              value={subtopic}
              onChange={(e) => setSubtopic(e.target.value)}
              placeholder="e.g. Sliding Window, Two Pointers"
              className="w-full px-[13px] py-[11px] rounded-xl border border-white/[0.12] bg-white/5 text-[#eef0f6] text-sm outline-none placeholder:text-[#5f657a] focus:border-[#8b7bff] focus:ring-[3px] focus:ring-[#8b7bff]/[0.22] transition-all"
            />
          </div>

          {/* 3. Difficulty */}
          <div>
            <label
              htmlFor="level"
              className="block text-[11px] uppercase tracking-[0.06em] text-[#8a90a6] mb-1.5"
            >
              Difficulty <span className="text-[#8b7bff]">*</span>
            </label>
            <select
              id="level"
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              required
              className="w-full px-[13px] py-[11px] rounded-xl border border-white/[0.12] bg-white/5 text-[#eef0f6] text-sm outline-none focus:border-[#8b7bff] focus:ring-[3px] focus:ring-[#8b7bff]/[0.22] cursor-pointer transition-all [&>option]:bg-[#14172a]"
            >
              <option value="learner">Learner (Beginner)</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          {/* 4. Goal */}
          <div>
            <label
              htmlFor="goal"
              className="block text-[11px] uppercase tracking-[0.06em] text-[#8a90a6] mb-1.5"
            >
              Goal
            </label>
            <select
              id="goal"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              className="w-full px-[13px] py-[11px] rounded-xl border border-white/[0.12] bg-white/5 text-[#eef0f6] text-sm outline-none focus:border-[#8b7bff] focus:ring-[3px] focus:ring-[#8b7bff]/[0.22] cursor-pointer transition-all [&>option]:bg-[#14172a]"
            >
              <option value="learn_basics">Learn Basics</option>
              <option value="interview_prep">Interview Prep</option>
              <option value="college_exam">College Exam</option>
              <option value="revision">Revision</option>
            </select>
          </div>

          {/* 5. Known Concepts */}
          <div>
            <label
              htmlFor="known_topics"
              className="block text-[11px] uppercase tracking-[0.06em] text-[#8a90a6] mb-1.5"
            >
              Known Concepts
            </label>
            <input
              type="text"
              id="known_topics"
              value={known_topics}
              onChange={(e) => setKnown_topics(e.target.value)}
              placeholder="e.g. Arrays, Hash Tables"
              className="w-full px-[13px] py-[11px] rounded-xl border border-white/[0.12] bg-white/5 text-[#eef0f6] text-sm outline-none placeholder:text-[#5f657a] focus:border-[#8b7bff] focus:ring-[3px] focus:ring-[#8b7bff]/[0.22] transition-all"
            />
          </div>

          {/* 6. Preferences */}
          <div>
            <label
              htmlFor="additional_info"
              className="block text-[11px] uppercase tracking-[0.06em] text-[#8a90a6] mb-1.5"
            >
              Preferences
            </label>
            <input
              type="text"
              id="additional_info"
              value={additional_info}
              onChange={(e) => setAdditional_info(e.target.value)}
              placeholder="e.g. Space complexity focus"
              className="w-full px-[13px] py-[11px] rounded-xl border border-white/[0.12] bg-white/5 text-[#eef0f6] text-sm outline-none placeholder:text-[#5f657a] focus:border-[#8b7bff] focus:ring-[3px] focus:ring-[#8b7bff]/[0.22] transition-all"
            />
          </div>
        </div>

        {/* Button Row */}
        <div className="flex justify-end mt-[18px]">
          <button
            type="submit"
            disabled={submitQuestion}
            className="px-[22px] py-[11px] rounded-xl font-semibold text-white bg-gradient-to-br from-[#8b7bff] to-[#6a5cff] shadow-[0_6px_20px_rgba(106,92,255,0.4)] hover:brightness-110 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {submitQuestion ? "Generating..." : "Generate Question"}
          </button>
        </div>
      </form>
    </section>
  );
}