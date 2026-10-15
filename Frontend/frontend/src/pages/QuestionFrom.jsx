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
    /* 50% width on medium/large screens */
    <section className="w-full lg:w-1/2 bg-cosmic-glass backdrop-blur-xl border border-cosmic-border rounded-2xl p-5 mb-6 text-cosmic-text shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-cosmic-border">
        <div className="flex items-center gap-2">
          <span className="flex items-center justify-center w-6 h-6 rounded-md bg-cosmic-cyan/[0.08] text-cosmic-cyan border border-cosmic-cyan/20 text-xs">
            ⚡
          </span>
          <div>
            <h2 className="text-xs font-bold text-cosmic-text uppercase tracking-wider">
              Create AI Question
            </h2>
            <p className="text-[10px] text-cosmic-muted">
              Configure parameters to generate a new problem
            </p>
          </div>
        </div>
        <span className="text-[10px] uppercase font-semibold text-white bg-cosmic-violet/[0.08] px-2 py-0.5 rounded-md border border-cosmic-violet/20">
          AI Powered
        </span>
      </div>

      {/* Feedback Alert */}
      {feedback && (
        <div
          className={`mb-3.5 px-3 py-1.5 rounded-xl text-xs flex items-center gap-2 ${
            feedback.type === "success"
              ? "bg-cosmic-success/10 border border-cosmic-success/25 text-cosmic-success"
              : "bg-cosmic-error/10 border border-cosmic-error/25 text-cosmic-error"
          }`}
        >
          <span>{feedback.type === "success" ? "✓" : "⚠"}</span>
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handle_submit} className="space-y-3.5 text-xs">
        {/* Row 1: Topic & Subtopic */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label htmlFor="topic" className="block text-[11px] font-semibold text-cosmic-muted uppercase tracking-wider mb-1">
              Topic <span className="text-cosmic-cyan">*</span>
            </label>
            <input
              type="text"
              id="topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              required
              placeholder="e.g. Array, Binary Search, DP"
              className="w-full bg-black/40 border border-cosmic-border text-cosmic-text px-3 py-1.5 rounded-lg text-xs outline-none focus:border-cosmic-cyan focus:ring-1 focus:ring-cosmic-cyan transition-all placeholder:text-cosmic-muted/40"
            />
          </div>

          <div>
            <label htmlFor="subtopic" className="block text-[11px] font-semibold text-cosmic-muted uppercase tracking-wider mb-1">
              Subtopic
            </label>
            <input
              type="text"
              id="subtopic"
              value={subtopic}
              onChange={(e) => setSubtopic(e.target.value)}
              placeholder="e.g. Sliding Window, Two Pointers"
              className="w-full bg-black/40 border border-cosmic-border text-cosmic-text px-3 py-1.5 rounded-lg text-xs outline-none focus:border-cosmic-cyan focus:ring-1 focus:ring-cosmic-cyan transition-all placeholder:text-cosmic-muted/40"
            />
          </div>
        </div>

        {/* Row 2: Level & Goal */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label htmlFor="level" className="block text-[11px] font-semibold text-cosmic-muted uppercase tracking-wider mb-1">
              Difficulty <span className="text-cosmic-cyan">*</span>
            </label>
            <select
              id="level"
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              required
              className="w-full bg-black/40 border border-cosmic-border text-cosmic-text px-3 py-1.5 rounded-lg text-xs outline-none focus:border-cosmic-cyan focus:ring-1 focus:ring-cosmic-cyan transition-all cursor-pointer"
            >
              <option value="learner" className="bg-cosmic-surface">Learner (Beginner)</option>
              <option value="easy" className="bg-cosmic-surface">Easy</option>
              <option value="medium" className="bg-cosmic-surface">Medium</option>
              <option value="hard" className="bg-cosmic-surface">Hard</option>
            </select>
          </div>

          <div>
            <label htmlFor="goal" className="block text-[11px] font-semibold text-cosmic-muted uppercase tracking-wider mb-1">
              Goal
            </label>
            <select
              id="goal"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              className="w-full bg-black/40 border border-cosmic-border text-cosmic-text px-3 py-1.5 rounded-lg text-xs outline-none focus:border-cosmic-cyan focus:ring-1 focus:ring-cosmic-cyan transition-all cursor-pointer"
            >
              <option value="learn_basics" className="bg-cosmic-surface">Learn Basics</option>
              <option value="interview_prep" className="bg-cosmic-surface">Interview Prep</option>
              <option value="college_exam" className="bg-cosmic-surface">College Exam</option>
              <option value="revision" className="bg-cosmic-surface">Revision</option>
            </select>
          </div>
        </div>

        {/* Row 3: Known Concepts & Preferences */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label htmlFor="known_topics" className="block text-[11px] font-semibold text-cosmic-muted uppercase tracking-wider mb-1">
              Known Concepts
            </label>
            <input
              type="text"
              id="known_topics"
              value={known_topics}
              onChange={(e) => setKnown_topics(e.target.value)}
              placeholder="e.g. Arrays, Hash Tables"
              className="w-full bg-black/40 border border-cosmic-border text-cosmic-text px-3 py-1.5 rounded-lg text-xs outline-none focus:border-cosmic-cyan focus:ring-1 focus:ring-cosmic-cyan transition-all placeholder:text-cosmic-muted/40"
            />
          </div>

          <div>
            <label htmlFor="additional_info" className="block text-[11px] font-semibold text-cosmic-muted uppercase tracking-wider mb-1">
              Preferences
            </label>
            <input
              type="text"
              id="additional_info"
              value={additional_info}
              onChange={(e) => setAdditional_info(e.target.value)}
              placeholder="e.g. Space complexity focus"
              className="w-full bg-black/40 border border-cosmic-border text-cosmic-text px-3 py-1.5 rounded-lg text-xs outline-none focus:border-cosmic-cyan focus:ring-1 focus:ring-cosmic-cyan transition-all placeholder:text-cosmic-muted/40"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-1">
          <button
            type="submit"
            disabled={submitQuestion}
            className={`py-1.5 px-4 rounded-lg text-xs font-bold tracking-wide transition-all cursor-pointer flex items-center gap-1.5 ${
              submitQuestion
                ? "bg-cosmic-cyan/20 text-cosmic-muted cursor-not-allowed"
                : "bg-gradient-to-r from-cosmic-cyan to-cyan-500 text-cosmic-bg hover:-translate-y-0.5 hover:shadow-[0_0_15px_rgba(0,229,255,0.25)] active:translate-y-0"
            }`}
          >
            {submitQuestion ? (
              <>
                <span className="animate-spin text-xs">⟳</span> Generating...
              </>
            ) : (
              <>⚡ Generate Question</>
            )}
          </button>
        </div>
      </form>
    </section>
  );
}