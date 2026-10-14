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
    console.log("stored the AI REVIEW in session storage");
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
      console.log(response.data);

      setAiData(AI_review_JSOn);
      setReviewResult(response.data);
      console.log(`Backend Responed : ${response.data}`);
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
      console.log(payload);
      return payload;
    }
    if (typeof payload === "string") {
      try {
        const data = JSON.parse(payload);
        console.log(data);
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
      <div className="flex items-center justify-center min-h-screen bg-cosmic-bg text-cosmic-cyan text-base font-medium">
        <div className="text-center">
          <div className="text-3xl mb-2 animate-spin inline-block">⟳</div>
          <p>Loading problem...</p>
        </div>
      </div>
    );

  /* ─── Error State ────────────────────────────────────── */
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-cosmic-bg text-cosmic-error gap-4">
        <div className="text-5xl">⚠</div>
        <p className="text-base max-w-md text-center">{error}</p>
        <button
          onClick={() => navigate("/dashboard")}
          className="border border-cosmic-error text-cosmic-error bg-transparent px-4 py-2 rounded-xl text-sm font-medium hover:bg-cosmic-error/10 transition-colors cursor-pointer"
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

  /* ─── Main Render ────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-cosmic-bg text-cosmic-text font-sans">

      {/* ═══ HEADER ═══ */}
      <header className="flex items-center justify-between px-6 py-3 bg-cosmic-glass backdrop-blur-xl border-b border-cosmic-border sticky top-0 z-50">
        <button
          onClick={() => navigate("/dashboard")}
          className="bg-transparent border border-cosmic-border text-cosmic-cyan px-4 py-2 rounded-xl text-sm font-medium hover:bg-cosmic-cyan/[0.08] transition-colors cursor-pointer"
        >
          ← Dashboard
        </button>
        <div className="flex gap-4 text-sm text-cosmic-muted">
          <span className="bg-cosmic-cyan/[0.08] text-cosmic-cyan px-3 py-1 rounded-lg text-xs font-semibold">
            {questionData?.topic || "General"}
          </span>
          <span className="bg-cosmic-violet/[0.08] text-cosmic-violet px-3 py-1 rounded-lg text-xs font-semibold">
            #{questionData?.ques_no}
          </span>
        </div>
      </header>

      {/* ═══ TWO-COLUMN GRID ═══ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4 lg:p-5 max-w-[1600px] mx-auto">

        {/* ─── LEFT PANEL: Problem Description ─── */}
        <div className="bg-cosmic-glass backdrop-blur-2xl border border-cosmic-border rounded-2xl p-6 max-h-[calc(100vh-80px)] overflow-y-auto">

          {/* Title */}
          <h1 className="text-xl font-bold text-cosmic-text mb-4 leading-tight">
            {questionData?.question}
          </h1>

          {/* Metadata badges */}
          <div className="flex gap-2 mb-5 flex-wrap">
            <span className="text-xs text-cosmic-muted bg-white/[0.04] px-2.5 py-1 rounded-md">
              ⏱ {questionData?.timeLimit || 1.0}s
            </span>
            <span className="text-xs text-cosmic-muted bg-white/[0.04] px-2.5 py-1 rounded-md">
              💾 {questionData?.memoryLimit || 128} MB
            </span>
            {questionData?.subtopic && (
              <span className="text-xs text-cosmic-violet bg-cosmic-violet/[0.08] px-2.5 py-1 rounded-md">
                {questionData.subtopic}
              </span>
            )}
          </div>

          {/* HTML Content from CKEditor */}
          <div
            className="pw-html text-sm leading-relaxed"
            dangerouslySetInnerHTML={{ __html: questionData?.question_content || "" }}
          />

          {/* Constraints */}
          {questionData?.constraints && (
            <div className="bg-black/30 border border-cosmic-border rounded-xl p-4 mt-5">
              <div className="text-xs font-semibold text-cosmic-cyan uppercase tracking-wide mb-2">
                Constraints
              </div>
              <pre className="m-0 text-cosmic-muted text-xs font-mono whitespace-pre-wrap">
                {questionData.constraints}
              </pre>
            </div>
          )}

          {/* Hints */}
          <div className="mt-5">
            <div className="text-xs font-semibold text-cosmic-muted uppercase tracking-wide mb-2.5">
              Hints
            </div>

            {questionData?.hint_1 && (
              <div>
                <button
                  onClick={() => setShowHint1(!showHint1)}
                  className="flex items-center justify-between w-full bg-black/20 border border-cosmic-border text-cosmic-text px-4 py-2.5 rounded-lg text-sm font-medium mb-2 hover:border-cosmic-cyan/20 transition-colors cursor-pointer"
                >
                  <span>💡 Hint 1</span>
                  <span className="text-cosmic-muted">{showHint1 ? "▲" : "▼"}</span>
                </button>
                {showHint1 && (
                  <p className="px-4 pb-3 text-cosmic-muted text-sm leading-relaxed">{questionData.hint_1}</p>
                )}
              </div>
            )}

            {questionData?.hint_2 && (
              <div>
                <button
                  onClick={() => setShowHint2(!showHint2)}
                  className="flex items-center justify-between w-full bg-black/20 border border-cosmic-border text-cosmic-text px-4 py-2.5 rounded-lg text-sm font-medium mb-2 hover:border-cosmic-cyan/20 transition-colors cursor-pointer"
                >
                  <span>💡 Hint 2</span>
                  <span className="text-cosmic-muted">{showHint2 ? "▲" : "▼"}</span>
                </button>
                {showHint2 && (
                  <p className="px-4 pb-3 text-cosmic-muted text-sm leading-relaxed">{questionData.hint_2}</p>
                )}
              </div>
            )}

            {questionData?.hint_3 && (
              <div>
                <button
                  onClick={() => setShowHint3(!showHint3)}
                  className="flex items-center justify-between w-full bg-black/20 border border-cosmic-border text-cosmic-text px-4 py-2.5 rounded-lg text-sm font-medium mb-2 hover:border-cosmic-cyan/20 transition-colors cursor-pointer"
                >
                  <span>💡 Hint 3</span>
                  <span className="text-cosmic-muted">{showHint3 ? "▲" : "▼"}</span>
                </button>
                {showHint3 && (
                  <p className="px-4 pb-3 text-cosmic-muted text-sm leading-relaxed">{questionData.hint_3}</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ─── RIGHT PANEL: Editor + AI ─── */}
        <div className="flex flex-col gap-4">

          {/* Editor panel */}
          <div className="bg-cosmic-glass backdrop-blur-2xl border border-cosmic-border rounded-2xl p-6">

            {/* Editor toolbar */}
            <div className="flex items-center justify-between flex-wrap gap-2.5 mb-3">
              <div className="text-sm font-semibold">Code Editor</div>
              <div className="flex items-center gap-2.5 flex-wrap">
                {/* Language select */}
                <select
                  value={language}
                  onChange={handleLanguageChange}
                  className="bg-black/40 border border-cosmic-border text-cosmic-text px-3 py-1.5 rounded-lg text-sm cursor-pointer outline-none"
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
                  className="bg-black/40 border border-cosmic-border text-cosmic-text px-3 py-1.5 rounded-lg text-sm cursor-pointer outline-none"
                >
                  <option value="vs-dark">Dark</option>
                  <option value="light">Light</option>
                </select>

                {/* Reset button */}
                <button
                  onClick={() => setCode(STARTER_TEMPLATES[language])}
                  className="bg-transparent border border-cosmic-border text-cosmic-muted px-3.5 py-1.5 rounded-lg text-sm hover:text-cosmic-text hover:border-white/20 transition-colors cursor-pointer"
                >
                  ↺ Reset
                </button>

                {/* Submit button */}
                <button
                  onClick={handelSubmit}
                  disabled={isSubmitting}
                  className={`px-6 py-2.5 rounded-lg text-sm font-bold tracking-wide transition-all cursor-pointer ${
                    isSubmitting
                      ? "bg-cosmic-cyan/15 text-cosmic-muted cursor-not-allowed"
                      : "bg-gradient-to-br from-cosmic-cyan to-cyan-600 text-cosmic-bg hover:-translate-y-0.5"
                  }`}
                >
                  {isSubmitting ? "⟳ Submitting..." : "▶ Submit Code"}
                </button>
              </div>
            </div>
            {/* Native HTML Collapsible Dropdown */}
            <details className="my-2 bg-black/30 border border-cosmic-border rounded-lg p-2.5 text-xs text-cosmic-muted cursor-pointer">
              <summary className="font-semibold text-cosmic-cyan uppercase tracking-wide select-none">
                ℹ Code Submission Format
              </summary>
              <ul className="list-disc pl-5 mt-2 space-y-1 text-cosmic-muted">
                <li>Write your solution inside the required function.</li>
                <li>Do not use <code className="text-cosmic-cyan">input()</code> unless the problem explicitly requires standard input.</li>
                <li>Call your function with sample arguments to test your solution.</li>
                <li>Print the returned result to verify the output.</li>
                <li>Follow the function name and parameter format specified in the problem.</li>
              </ul>
            </details>
            {/* Monaco Editor */}
            <div className="rounded-xl overflow-hidden border border-cosmic-border mt-1">
              <Editor
                height="450px"
                language={language}
                theme={Theme}
                value={code}
                onChange={(val) => setCode(val)}
                options={{
                  fontSize: 14,
                  minimap: { enabled: false },
                  automaticLayout: true,
                }}
              />
            </div>

            {/* Execution Error */}
            {reviewResult?.error && (
              <div className="bg-cosmic-error/[0.08] border border-cosmic-error/25 rounded-xl p-4 mt-4 text-cosmic-error text-sm font-mono whitespace-pre-wrap">
                <div className="font-semibold mb-1.5">Execution Error</div>
                {reviewResult.error}
              </div>
            )}
          </div>

          {/* ═══ AI MENTOR PANEL ═══ */}
          {aiData && (
            <div className="bg-cosmic-violet/[0.04] border border-cosmic-violet/15 rounded-2xl p-6">

              {/* Title */}
              <div className="text-base font-bold text-cosmic-violet mb-4 flex items-center gap-2">
                <span className="text-lg">🤖</span>
                AI Mentor Review
              </div>

              {/* Review text */}
              {/* {review_text && (
                <div className="bg-black/25 border border-cosmic-violet/[0.12] rounded-xl p-4 mb-3">
                  <div className="text-[11px] font-bold text-cosmic-violet uppercase tracking-widest mb-2">Review</div>
                  <pre className="text-cosmic-text text-sm leading-relaxed whitespace-pre-wrap m-0 font-sans">{review_text}</pre>
                </div>
              )} */}

              {/* Status + Output row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {review_status && (
                  <div className="bg-black/25 border border-cosmic-violet/[0.12] rounded-xl p-4 mb-3">
                    <div className="text-[11px] font-bold text-cosmic-violet uppercase tracking-widest mb-2">Status</div>
                    <p className={`text-sm font-semibold m-0 ${
                      review_status === "pass" || review_status === "correct"
                        ? "text-cosmic-success"
                        : "text-cosmic-error"
                    }`}>
                      {review_status}
                    </p>
                  </div>
                )}
                {output !== undefined && output !== null && (
                  <div className="bg-black/25 border border-cosmic-violet/[0.12] rounded-xl p-4 mb-3">
                    <div className="text-[11px] font-bold text-cosmic-violet uppercase tracking-widest mb-2">Code Output</div>
                    <pre className="text-cosmic-text text-sm leading-relaxed whitespace-pre-wrap m-0 font-mono">
                      {typeof output === "object" ? JSON.stringify(output, null, 2) : String(output)}
                    </pre>
                  </div>
                )}
              </div>

              {/* Summary */}
              {summary && (
                <div className="bg-black/25 border border-cosmic-violet/[0.12] rounded-xl p-4 mb-3">
                  <div className="text-[11px] font-bold text-cosmic-violet uppercase tracking-widest mb-2">Summary</div>
                  <pre className="text-cosmic-text text-sm leading-relaxed whitespace-pre-wrap m-0 font-sans">
                    {typeof summary === "object" ? JSON.stringify(summary, null, 2) : summary}
                  </pre>
                </div>
              )}

              {/* Logic Analysis */}
              {logic_analysis && (
                <div className="bg-black/25 border border-cosmic-violet/[0.12] rounded-xl p-4 mb-3">
                  <div className="text-[11px] font-bold text-cosmic-violet uppercase tracking-widest mb-2">Logic Analysis</div>
                  <pre className="text-cosmic-text text-sm leading-relaxed whitespace-pre-wrap m-0 font-sans">
                    {typeof logic_analysis === "object" ? JSON.stringify(logic_analysis, null, 2) : logic_analysis}
                  </pre>
                </div>
              )}

              {/* Execution Analysis */}
              {execution_analysis && (
                <div className="bg-black/25 border border-cosmic-violet/[0.12] rounded-xl p-4 mb-3">
                  <div className="text-[11px] font-bold text-cosmic-violet uppercase tracking-widest mb-2">Execution Analysis</div>
                  <pre className="text-cosmic-text text-sm leading-relaxed whitespace-pre-wrap m-0 font-sans">
                    {typeof execution_analysis === "object" ? JSON.stringify(execution_analysis, null, 2) : execution_analysis}
                  </pre>
                </div>
              )}

              {/* Issues */}
              {issues.length > 0 && (
                <div className="bg-black/25 border border-cosmic-violet/[0.12] rounded-xl p-4 mb-3">
                  <div className="text-[11px] font-bold text-cosmic-violet uppercase tracking-widest mb-2">Issues</div>
                  {issues.map((issue, index) => (
                    <div key={index} className="border-b border-cosmic-violet/[0.08] pb-2.5 mb-2.5 text-sm text-cosmic-text last:border-0 last:mb-0 last:pb-0">
                      {typeof issue === "object" && issue !== null
                        ? Object.entries(issue).map(([key, value]) => (
                            <p key={key} className="my-0.5 text-sm">
                              <strong className="text-cosmic-violet">{key}:</strong>{" "}
                              {typeof value === "object" && value !== null ? JSON.stringify(value) : String(value)}
                            </p>
                          ))
                        : <p className="m-0">{String(issue)}</p>}
                    </div>
                  ))}
                </div>
              )}

              {/* AI Hints */}
              {aiHints.length > 0 && (
                <div className="bg-black/25 border border-cosmic-violet/[0.12] rounded-xl p-4 mb-3">
                  <div className="text-[11px] font-bold text-cosmic-violet uppercase tracking-widest mb-2">AI Hints</div>
                  {aiHints.map((hint, index) => (
                    <div key={index} className="border-b border-cosmic-violet/[0.08] pb-2.5 mb-2.5 text-sm text-cosmic-text last:border-0 last:mb-0 last:pb-0">
                      {typeof hint === "object" && hint !== null
                        ? Object.entries(hint).map(([key, value]) => (
                            <p key={key} className="my-0.5 text-sm">
                              <strong className="text-cosmic-cyan">{key}:</strong>{" "}
                              {typeof value === "object" && value !== null ? JSON.stringify(value) : String(value)}
                            </p>
                          ))
                        : <p className="m-0">{String(hint)}</p>}
                    </div>
                  ))}
                </div>
              )}

              {/* Next Step */}
              {next_step && (
                <div className="bg-cosmic-violet/[0.06] border border-cosmic-violet/20 rounded-xl p-4 mb-3">
                  <div className="text-[11px] font-bold text-cosmic-violet uppercase tracking-widest mb-2">Next Step</div>
                  <p className="text-cosmic-violet text-sm font-semibold m-0 leading-relaxed whitespace-pre-wrap">
                    {typeof next_step === "object" ? JSON.stringify(next_step) : next_step}
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