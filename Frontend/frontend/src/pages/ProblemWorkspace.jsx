import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Editor from "@monaco-editor/react";

// Starter boilerplate code for each language
const STARTER_TEMPLATES = {
  python: `# Write your Python solution below\n\ndef solution():\n    pass\n`,
  cpp: `// Write your C++ solution below\n#include <iostream>\n\nclass Solution {\npublic:\n    void solve() {\n        \n    }\n};\n`,
  java: `// Write your Java solution below\nimport java.util.*;\n\nclass Solution {\n    public void solve() {\n        \n    }\n}\n`,
  javascript: `// Write your JavaScript solution below\n\nfunction solution() {\n    \n}\n`
};

const lANGUAGE_IDs = {
  cpp: 54,
  python: 71,
  java: 62,
  javascript: 63,
  c: 50,
};

export default function ProblemWorkspace() {
  const { id } = useParams();
  const navigate = useNavigate();
  const questionID = id || 1;

  // Question panel state
  const [questionData, setQuestionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Hint toggles
  const [showHint1, setShowHint1] = useState(false);
  const [showHint2, setShowHint2] = useState(false);
  const [showHint3, setShowHint3] = useState(false);

  // Editor States
  const [language, setLanguage] = useState("python");
  const [Theme, setTheme] = useState("vs-dark");
  const [code, setCode] = useState(STARTER_TEMPLATES.python);
  const [dashboardPayload, setDashboardPayload] = useState({});

  // AI Submission states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reviewResult, setReviewResult] = useState(null);
  const [aiData, setAiData] = useState(() => {
    const saved = sessionStorage.getItem(`ai_review_${questionID}`);
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    async function fetchQuestion() {
      try {
        setLoading(true);
        setError(null);
        const accessTkn = localStorage.getItem("accessToken");
        const headers = accessTkn ? { Authorization: `Bearer ${accessTkn}` } : {};

        const response = await axios.get(
          `http://127.0.0.1:8000/api/questions/${questionID}/`,
          { headers }
        );
        setQuestionData(response.data);
      } catch (err) {
        if (err.response && err.response.status === 401) {
          localStorage.removeItem("accessToken");
          navigate("/login");
          return;
        }
        if (err.response) {
          setError(`Question ID: ${questionID} not found!`);
        } else {
          setError(`Failed to connect (error code: ${err.response || "network error"})`);
        }
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchQuestion();

    // Fetch user's previously saved code from Redis/DB
    async function fetchSavedCode() {
      try {
        const accessTkn = localStorage.getItem("accessToken");
        const headers = accessTkn ? { Authorization: `Bearer ${accessTkn}` } : {};
        const response = await axios.get(
          `http://127.0.0.1:8000/api/cache_source_code/${questionID}`,
          { headers }
        );
        if (response?.data?.source_code != null) {
          setCode(response.data.source_code);
        }
      } catch (err) {
        console.log("No saved code found, using starter template");
      }
    }
    fetchSavedCode();
  }, [questionID]);

  // Source code template via language
  const handleLanguageChange = async (e) => {
    const newLang = e.target.value;
    setLanguage(newLang);
    try {
      const accessTkn = localStorage.getItem("accessToken");
      const header = accessTkn ? { Authorization: `Bearer ${accessTkn}` } : {};
      const response = await axios.get(
        `http://127.0.0.1:8000/api/cache_source_code/${questionID}`,
        { headers: header }
      );
      if (response?.data.source_code != null) {
        setCode(response.data.source_code);
      } else {
        setCode(STARTER_TEMPLATES[newLang] || "");
      }
    } catch (error) {
      console.log(`found error while submitting the code due to ${error}`);
    }
  };

  // Code submit
  const handelSubmit = async () => {
    setIsSubmitting(true);
    setReviewResult(null);

    try {
      const accessTkn = localStorage.getItem("accessToken");
      const header = accessTkn ? { Authorization: `Bearer ${accessTkn}` } : {};

      const response = await axios.post(
        `http://127.0.0.1:8000/api/submissions/${questionID}`,
        {
          question: questionData,
          language: language,
          source_code: code,
          language_id: lANGUAGE_IDs[language],
        },
        { headers: header }
      );
      const AI_review_JSOn = extractReview(response.data);

      setAiData(AI_review_JSOn);
      setReviewResult(response.data);
      sessionStorage.setItem(`ai_review_${questionID}`, JSON.stringify(AI_review_JSOn));
    } catch (err) {
      setError(` somthing went wrong error code : ${err.data}`);
      console.log(err);
      setReviewResult(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  function extractReview(reviewResult) {
    const payload = reviewResult?.message;
    if (!payload) return null;
    if (typeof payload === "object") {
      return payload;
    }
    if (typeof payload === "string") {
      try {
        const data = JSON.parse(payload);
        return data;
      } catch (error) {
        console.log("AI REview ERROR in frontend : ", error);
        return null;
      }
    }
  }

  /* ─── Loading State ──────────────────────────────────── */
  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#060a10] text-[#4fd8ff] font-sans">
        <div className="text-center">
          <div className="text-3xl mb-2 animate-spin inline-block">⟳</div>
          <p className="text-[#8a90a6] text-sm">Loading problem...</p>
        </div>
      </div>
    );

  /* ─── Error State ────────────────────────────────────── */
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#060a10] text-[#ff6b81] font-sans gap-4 px-4">
        <div className="text-5xl">⚠</div>
        <p className="text-base max-w-md text-center text-[#d3d6e2]">{error}</p>
        <button
          onClick={() => navigate("/dashboard")}
          className="border border-[#ff6b81]/40 text-[#ff6b81] bg-white/[0.055] px-4 py-2 rounded-full text-sm font-medium hover:bg-[#ff6b81]/10 transition-colors cursor-pointer"
        >
          ← Back to Dashboard
        </button>
      </div>
    );
  }

  /* ─── Extract AI review fields ───────────────────────── */
  const aiReview = aiData?.ai_review?.message || {};
  const output = aiData?.code_output;
  const review_status = aiReview?.review_status || null;
  const review_text = aiReview?.review || null;
  const summary = aiReview?.summary || null;
  const logic_analysis = aiReview?.logic_analysis || null;
  const execution_analysis = aiReview?.execution_analysis || null;
  const next_step = aiReview?.next_step || null;
  const issues_raw = aiReview?.issues;
  const hints_raw = aiReview?.hints;
  const issues = Array.isArray(issues_raw) ? issues_raw : [];
  const aiHints = Array.isArray(hints_raw) ? hints_raw : [];

  return (
    <div className="bg-[#060a10] text-[#eceef5] min-h-screen font-sans bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px),radial-gradient(700px_520px_at_0%_100%,rgba(20,184,166,0.24),transparent_70%),radial-gradient(700px_520px_at_100%_0%,rgba(59,130,246,0.22),transparent_70%)] bg-[length:44px_44px,44px_44px,auto,auto] bg-fixed">
      {/* ═══ 1. TOP BAR ═══ */}
      <header className="sticky top-0 z-10 flex items-center justify-between px-6 py-3.5 bg-[#060a10]/60 backdrop-blur-[14px] border-b border-white/[0.11]">
        <button
          onClick={() => navigate("/dashboard")}
          className="rounded-full px-4 py-2 text-sm text-[#4fd8ff] bg-white/[0.055] border border-white/[0.11] hover:bg-white/10 transition-colors cursor-pointer"
        >
          ← Dashboard
        </button>
        <div className="flex items-center gap-2">
          <span className="text-xs px-3 py-[5px] rounded-full border text-[#4fd8ff] border-[#4fd8ff]/35 font-medium">
            {questionData?.topic || "General"}
          </span>
          <span className="text-xs px-3 py-[5px] rounded-full border text-[#8b7bff] border-[#8b7bff]/40 font-medium">
            #{questionData?.ques_no}
          </span>
        </div>
      </header>

      {/* ═══ TWO-COLUMN SPLIT CONTAINER ═══ */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.05fr] gap-[18px] px-6 pt-[18px] pb-10 max-w-[1500px] mx-auto items-start">
        {/* ─── 2. LEFT PANEL: Problem Card ─── */}
        <div className="bg-white/[0.055] border border-white/[0.11] rounded-[20px] backdrop-blur-xl backdrop-saturate-150 shadow-[0_10px_40px_rgba(0,0,0,0.35)] p-[26px]">
          {/* Title */}
          <h1 className="text-[25px] font-semibold leading-tight text-[#eceef5]">
            {questionData?.question}
          </h1>

          {/* Time Limit & Memory Chips */}
          <div className="mt-3 mb-1.5 flex gap-2 flex-wrap">
            <span className="text-[12.5px] text-[#8a90a6] px-[11px] py-[5px] rounded-full bg-white/[0.06]">
              ⏱ {questionData?.timeLimit || 1.0}s
            </span>
            <span className="text-[12.5px] text-[#8a90a6] px-[11px] py-[5px] rounded-full bg-white/[0.06]">
              💾 {questionData?.memoryLimit || 128} MB
            </span>
            {questionData?.subtopic && (
              <span className="text-[12.5px] text-[#8a90a6] px-[11px] py-[5px] rounded-full bg-white/[0.06]">
                {questionData.subtopic}
              </span>
            )}
          </div>

          {/* HTML Content from CKEditor */}
          <div
            className="text-[14.5px] leading-[1.7] text-[#d3d6e2] [&>p]:mt-2 [&>h2]:text-xs [&>h2]:uppercase [&>h2]:tracking-[0.09em] [&>h2]:font-semibold [&>h2]:text-[#4fd8ff] [&>h2]:mt-[26px] [&>h2]:mb-[9px] [&>h3]:text-xs [&>h3]:uppercase [&>h3]:tracking-[0.09em] [&>h3]:font-semibold [&>h3]:text-[#4fd8ff] [&>h3]:mt-[26px] [&>h3]:mb-[9px] [&>pre]:font-mono [&>pre]:text-[13px] [&>pre]:leading-[1.7] [&>pre]:bg-black/35 [&>pre]:border [&>pre]:border-white/[0.11] [&>pre]:rounded-[14px] [&>pre]:px-[18px] [&>pre]:py-4 [&>pre]:text-[#dfe2ee] [&>pre]:overflow-x-auto"
            dangerouslySetInnerHTML={{ __html: questionData?.question_content || "" }}
          />

          {/* Constraints Block */}
          {questionData?.constraints && (
            <div className="mt-[26px]">
              <div className="text-xs uppercase tracking-[0.09em] font-semibold text-[#4fd8ff] mb-[9px]">
                Constraints
              </div>
              <pre className="font-mono text-[13px] leading-[1.7] bg-black/35 border border-white/[0.11] rounded-[14px] px-[18px] py-4 text-[#dfe2ee] overflow-x-auto whitespace-pre-wrap m-0">
                {questionData.constraints}
              </pre>
            </div>
          )}

          {/* Hints Section */}
          {(questionData?.hint_1 || questionData?.hint_2 || questionData?.hint_3) && (
            <div className="mt-[26px]">
              <div className="text-xs uppercase tracking-[0.09em] font-semibold text-[#4fd8ff] mb-[9px]">
                Hints
              </div>

              {questionData?.hint_1 && (
                <div className="mb-2">
                  <button
                    onClick={() => setShowHint1(!showHint1)}
                    className="flex items-center justify-between w-full bg-white/[0.04] border border-white/[0.11] text-[#eceef5] px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-white/[0.08] transition-colors cursor-pointer"
                  >
                    <span>💡 Hint 1</span>
                    <span className="text-[#8a90a6] text-xs">{showHint1 ? "▲" : "▼"}</span>
                  </button>
                  {showHint1 && (
                    <p className="px-4 py-3 text-[#8a90a6] text-[13.5px] leading-relaxed bg-white/[0.02] border-x border-b border-white/[0.11] rounded-b-xl -mt-2 mb-2">
                      {questionData.hint_1}
                    </p>
                  )}
                </div>
              )}

              {questionData?.hint_2 && (
                <div className="mb-2">
                  <button
                    onClick={() => setShowHint2(!showHint2)}
                    className="flex items-center justify-between w-full bg-white/[0.04] border border-white/[0.11] text-[#eceef5] px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-white/[0.08] transition-colors cursor-pointer"
                  >
                    <span>💡 Hint 2</span>
                    <span className="text-[#8a90a6] text-xs">{showHint2 ? "▲" : "▼"}</span>
                  </button>
                  {showHint2 && (
                    <p className="px-4 py-3 text-[#8a90a6] text-[13.5px] leading-relaxed bg-white/[0.02] border-x border-b border-white/[0.11] rounded-b-xl -mt-2 mb-2">
                      {questionData.hint_2}
                    </p>
                  )}
                </div>
              )}

              {questionData?.hint_3 && (
                <div className="mb-2">
                  <button
                    onClick={() => setShowHint3(!showHint3)}
                    className="flex items-center justify-between w-full bg-white/[0.04] border border-white/[0.11] text-[#eceef5] px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-white/[0.08] transition-colors cursor-pointer"
                  >
                    <span>💡 Hint 3</span>
                    <span className="text-[#8a90a6] text-xs">{showHint3 ? "▲" : "▼"}</span>
                  </button>
                  {showHint3 && (
                    <p className="px-4 py-3 text-[#8a90a6] text-[13.5px] leading-relaxed bg-white/[0.02] border-x border-b border-white/[0.11] rounded-b-xl -mt-2 mb-2">
                      {questionData.hint_3}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* ─── RIGHT STACK: Editor + AI Mentor Review ─── */}
        <div className="flex flex-col gap-[18px]">
          {/* 3. CODE EDITOR CARD */}
          <div className="bg-white/[0.055] border border-white/[0.11] rounded-[20px] backdrop-blur-xl backdrop-saturate-150 shadow-[0_10px_40px_rgba(0,0,0,0.35)] p-[26px]">
            {/* Header row */}
            <div className="flex items-center gap-2.5 flex-wrap mb-4">
              <span className="text-[15px] font-semibold text-[#eceef5] mr-auto">
                Code Editor
              </span>

              {/* Language select */}
              <select
                value={language}
                onChange={handleLanguageChange}
                className="px-3 py-[9px] rounded-[11px] border border-white/[0.11] bg-white/[0.06] text-[#eceef5] text-[13.5px] outline-none cursor-pointer transition-colors [&>option]:bg-[#14172a]"
              >
                <option value="python">Python</option>
                <option value="cpp">C++</option>
                <option value="java">Java</option>
                <option value="javascript">JavaScript</option>
              </select>

              {/* Theme select */}
              <select
                value={Theme}
                onChange={(e) => setTheme(e.target.value)}
                className="px-3 py-[9px] rounded-[11px] border border-white/[0.11] bg-white/[0.06] text-[#eceef5] text-[13.5px] outline-none cursor-pointer transition-colors [&>option]:bg-[#14172a]"
              >
                <option value="vs-dark">Dark</option>
                <option value="light">Light</option>
              </select>

              {/* Reset button */}
              <button
                onClick={() => setCode(STARTER_TEMPLATES[language])}
                className="border border-white/[0.11] rounded-[11px] px-3.5 py-[9px] text-[13.5px] text-[#8a90a6] hover:text-[#eceef5] hover:bg-white/[0.04] transition-colors cursor-pointer"
              >
                ↺ Reset
              </button>

              {/* Submit Code button */}
              <button
                onClick={handelSubmit}
                disabled={isSubmitting}
                className="px-5 py-2.5 rounded-xl font-semibold text-white bg-gradient-to-br from-[#8b7bff] to-[#6a5cff] shadow-[0_6px_20px_rgba(106,92,255,0.4)] hover:brightness-110 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isSubmitting ? "⟳ Submitting..." : "Submit Code"}
              </button>
            </div>

            {/* Code submission format collapsible */}
            <details className="border border-white/[0.11] rounded-xl px-3.5 py-[11px] mb-3 bg-white/[0.02] cursor-pointer">
              <summary className="text-[11.5px] uppercase tracking-[0.08em] font-semibold text-[#4fd8ff] select-none">
                ℹ Code Submission Format
              </summary>
              <ul className="list-disc pl-5 mt-2 space-y-1 text-[13px] text-[#8a90a6]">
                <li>Write your solution inside the required function.</li>
                <li>
                  Do not use <code className="text-[#4fd8ff]">input()</code> unless the problem explicitly requires standard input.
                </li>
                <li>Call your function with sample arguments to test your solution.</li>
                <li>Print the returned result to verify the output.</li>
                <li>Follow the function name and parameter format specified in the problem.</li>
              </ul>
            </details>

            {/* Editor container */}
            <div className="rounded-[14px] border border-white/[0.11] bg-black/40 overflow-hidden max-h-[430px] font-mono text-[13.5px]">
              <Editor
                height="420px"
                language={language}
                theme={Theme}
                value={code}
                onChange={(val) => setCode(val)}
                options={{
                  fontSize: 13.5,
                  minimap: { enabled: false },
                  automaticLayout: true,
                  lineNumbersMinChars: 3,
                }}
              />
            </div>

            {/* Execution Error */}
            {reviewResult?.error && (
              <div className="bg-[#ff6b81]/[0.08] border border-[#ff6b81]/25 rounded-[14px] p-4 mt-4 text-[#ff6b81] text-sm font-mono whitespace-pre-wrap">
                <div className="font-semibold mb-1.5 uppercase text-xs tracking-wider">
                  Execution Error
                </div>
                {reviewResult.error}
              </div>
            )}
          </div>

          {/* 4. AI MENTOR REVIEW CARD */}
          {aiData && (
            <div className="bg-white/[0.055] border border-white/[0.11] rounded-[20px] backdrop-blur-xl backdrop-saturate-150 shadow-[0_10px_40px_rgba(0,0,0,0.35)] p-[26px]">
              {/* Title */}
              <div className="text-base font-semibold text-[#8b7bff] mb-4">
                AI Mentor Review
              </div>

              {/* Row 1: Status & Code Output */}
              <div className="grid grid-cols-2 gap-3">
                {/* Status Box */}
                <div className="bg-white/[0.04] border border-white/[0.11] rounded-[14px] p-4">
                  <div className="text-[11px] uppercase tracking-[0.09em] font-semibold text-[#8a90a6] mb-2">
                    Status
                  </div>
                  <div>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-[13px] font-semibold border ${
                        review_status === "correct" || review_status === "pass" || review_status === "passed"
                          ? "text-[#3ddc97] bg-[#3ddc97]/[0.12] border-[#3ddc97]/30"
                          : review_status === "partially_correct"
                          ? "text-[#ffb84d] bg-[#ffb84d]/[0.12] border-[#ffb84d]/30"
                          : "text-[#ff6b81] bg-[#ff6b81]/[0.12] border-[#ff6b81]/30"
                      }`}
                    >
                      {review_status || "evaluated"}
                    </span>
                  </div>
                </div>

                {/* Code Output Box */}
                <div className="bg-white/[0.04] border border-white/[0.11] rounded-[14px] p-4">
                  <div className="text-[11px] uppercase tracking-[0.09em] font-semibold text-[#8a90a6] mb-2">
                    Code Output
                  </div>
                  <pre className="font-mono text-[22px] font-semibold text-[#eceef5] m-0 overflow-x-auto whitespace-pre-wrap leading-tight">
                    {output !== undefined && output !== null
                      ? typeof output === "object"
                        ? JSON.stringify(output, null, 2)
                        : String(output)
                      : "—"}
                  </pre>
                </div>
              </div>

              {/* Interpretation Box */}
              {(execution_analysis || summary) && (
                <div className="bg-white/[0.04] border border-white/[0.11] rounded-[14px] p-4 mt-3">
                  <div className="text-[11px] uppercase tracking-[0.09em] font-semibold text-[#8a90a6] mb-2">
                    Interpretation
                  </div>
                  <p className="text-[14.5px] leading-[1.7] text-[#d3d6e2] m-0 whitespace-pre-wrap">
                    {typeof execution_analysis === "object" && execution_analysis?.interpretation
                      ? execution_analysis.interpretation
                      : typeof execution_analysis === "string"
                      ? execution_analysis
                      : typeof summary === "string"
                      ? summary
                      : JSON.stringify(summary)}
                  </p>
                </div>
              )}

              {/* Logic Analysis (if available) */}
              {logic_analysis && (
                <div className="bg-white/[0.04] border border-white/[0.11] rounded-[14px] p-4 mt-3">
                  <div className="text-[11px] uppercase tracking-[0.09em] font-semibold text-[#8a90a6] mb-2">
                    Logic Analysis
                  </div>
                  <p className="text-[14.5px] leading-[1.7] text-[#d3d6e2] m-0 whitespace-pre-wrap">
                    {typeof logic_analysis === "object" ? JSON.stringify(logic_analysis, null, 2) : logic_analysis}
                  </p>
                </div>
              )}

              {/* Issues Box */}
              {issues.length > 0 && (
                <div className="bg-white/[0.04] border border-white/[0.11] rounded-[14px] p-4 mt-3">
                  <div className="text-[11px] uppercase tracking-[0.09em] font-semibold text-[#8a90a6] mb-2">
                    Issues
                  </div>
                  <div>
                    {issues.map((issue, idx) => {
                      const isObj = typeof issue === "object" && issue !== null;
                      const severity = isObj ? (issue.severity || "minor").toLowerCase() : "minor";
                      const line = isObj ? issue.line : null;
                      const title = isObj ? issue.title || issue.name || "" : String(issue);
                      const description = isObj ? issue.description || issue.desc || "" : "";
                      const counterexample = isObj ? issue.counterexample || "" : "";
                      const isCritical = severity === "critical" || severity === "major";
                      const borderColor = isCritical ? "border-[#ff6b81]" : "border-[#ffb84d]";
                      const textColor = isCritical ? "text-[#ff6b81]" : "text-[#ffb84d]";

                      return (
                        <div
                          key={idx}
                          className={`pl-3.5 border-l-[3px] ${borderColor} ${idx > 0 ? "mt-3.5" : ""}`}
                        >
                          <div className="flex items-center gap-2 text-xs text-[#8a90a6] mb-1">
                            <span className={`uppercase font-bold tracking-[0.06em] ${textColor}`}>
                              {severity}
                            </span>
                            <span>•</span>
                            <span>{line !== null && line !== undefined ? `line ${line}` : "general"}</span>
                          </div>
                          {title && (
                            <span className="block text-[14.5px] font-semibold mb-1 text-[#eceef5]">
                              {title}
                            </span>
                          )}
                          {description && (
                            <p className="text-[13.5px] leading-[1.7] text-[#d3d6e2] m-0">
                              {description}
                            </p>
                          )}
                          {counterexample && (
                            <div className="mt-2 font-mono text-[12.5px] leading-[1.6] text-[#c9cde0] bg-black/30 rounded-[10px] px-3 py-[9px] overflow-x-auto">
                              {typeof counterexample === "object"
                                ? JSON.stringify(counterexample, null, 2)
                                : counterexample}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* AI Hints Box */}
              {aiHints.length > 0 && (
                <div className="bg-white/[0.04] border border-white/[0.11] rounded-[14px] p-4 mt-3">
                  <div className="text-[11px] uppercase tracking-[0.09em] font-semibold text-[#8a90a6] mb-2">
                    AI Hints
                  </div>
                  <div>
                    {aiHints.map((hint, idx) => {
                      const isObj = typeof hint === "object" && hint !== null;
                      const level = isObj ? hint.level || idx + 1 : idx + 1;
                      const hintText = isObj ? hint.hint || hint.text || JSON.stringify(hint) : String(hint);

                      return (
                        <div
                          key={idx}
                          className={`flex items-start gap-3 ${idx > 0 ? "mt-3" : ""}`}
                        >
                          <span className="shrink-0 w-[26px] h-[26px] rounded-full grid place-items-center text-xs font-bold text-[#4fd8ff] border border-[#4fd8ff]/40">
                            {level}
                          </span>
                          <p className="text-[13.5px] leading-[1.7] text-[#d3d6e2] m-0 flex-1">
                            {hintText}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Next Step Box */}
              {next_step && (
                <div className="bg-white/[0.04] border border-white/[0.11] rounded-[14px] p-4 mt-3">
                  <div className="text-[11px] uppercase tracking-[0.09em] font-semibold text-[#8a90a6] mb-2">
                    Next Step
                  </div>
                  <p className="text-[14.5px] leading-[1.7] text-[#d3d6e2] m-0 whitespace-pre-wrap">
                    {typeof next_step === "object"
                      ? next_step.step || JSON.stringify(next_step)
                      : next_step}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}