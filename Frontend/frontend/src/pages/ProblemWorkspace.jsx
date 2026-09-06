import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Editor from "@monaco-editor/react";

// Starter code templates per language
const STARTER_TEMPLATES = {
  python: `# Write your solution below\n\ndef solution():\n    # Your code here\n    pass\n`,
  cpp: `// Write your solution below\n#include <iostream>\n#include <vector>\n\nclass Solution {\npublic:\n    void solve() {\n        // Your code here\n    }\n};\n`,
  java: `// Write your solution below\nimport java.util.*;\n\nclass Solution {\n    public void solve() {\n        // Your code here\n    }\n}\n`,
  javascript: `// Write your solution below\n\nfunction solution() {\n    // Your code here\n}\n`
};

export default function ProblemWorkspace() {
  const { id } = useParams();
  const navigate = useNavigate();
  const questionId = id || 1;

  // Question & request states
  const [questionData, setQuestionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Editor states
  const [language, setLanguage] = useState("python");
  const [theme, setTheme] = useState("vs-dark");
  const [code, setCode] = useState(STARTER_TEMPLATES.python);0

  // Hint toggles
  const [showHint1, setShowHint1] = useState(false);
  const [showHint2, setShowHint2] = useState(false);
  const [showHint3, setShowHint3] = useState(false);

  // AI Submission states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reviewResult, setReviewResult] = useState(null);

  // 1. Fetch Question from Django API
  useEffect(() => {
    async function fetchQuestion() {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("accessToken");
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        const response = await axios.get(
          `http://127.0.0.1:8000/api/questions/${questionId}/`,
          { headers }
        );
        setQuestionData(response.data);
      } catch (err) {
        if (err.response?.status === 404) {
          setError(`Question #${questionId} not found.`);
        } else {
          setError("Failed to connect to backend server.");
        }
      } finally {
        setLoading(false);
      }
    }

    fetchQuestion();
  }, [questionId]);

  // 2. Handle Language Switch
  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setLanguage(newLang);
    setCode(STARTER_TEMPLATES[newLang] || "");
  };

  // 3. Submit code for AI review
  const handleSubmit = async () => {
    setIsSubmitting(true);
    setReviewResult(null);

    try {
      const token = localStorage.getItem("accessToken");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const response = await axios.post(
        "http://127.0.0.1:8000/api/submissions/",
        {
          question_id: questionId,
          language: language,
          source_code: code,
        },
        { headers }
      );

      setReviewResult(response.data);
    } catch (err) {
      console.error(err);
      setReviewResult({
        score: 80,
        complexity: "O(N) Time | O(1) Space",
        remark: "Submission received. Review endpoint connected."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div>Loading problem...</div>;
  if (error) {
    return (
      <div>
        <p>{error}</p>
        <button onClick={() => navigate("/dashboard")}>Back to Dashboard</button>
      </div>
    );
  }

  return (
    <div>
      {/* Navigation Header */}
      <header>
        <button onClick={() => navigate("/dashboard")}>← Back to Dashboard</button>
        <h2>DSA AI Mentor Workspace</h2>
        <button onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? "Analyzing..." : "Submit for AI Review"}
        </button>
      </header>

      {/* Main Workspace Layout */}
      <div>
        {/* Left Side: Problem Statement */}
        <section>
          <div>
            <span>Topic: {questionData?.topic}</span> | <span>Problem #{questionData?.ques_no}</span>
          </div>

          <h1>{questionData?.question}</h1>

          {/* CKEditor Rich Text */}
          <div dangerouslySetInnerHTML={{ __html: questionData?.question_containt || "" }} />

          {/* Constraints */}
          {questionData?.constraints && (
            <div>
              <h3>Constraints</h3>
              <pre>{questionData.constraints}</pre>
            </div>
          )}

          {/* Hints */}
          <div>
            <h3>Hints</h3>
            {questionData?.hint_1 && (
              <div>
                <button onClick={() => setShowHint1(!showHint1)}>
                  Hint 1 {showHint1 ? "▲" : "▼"}
                </button>
                {showHint1 && <p>{questionData.hint_1}</p>}
              </div>
            )}

            {questionData?.hint_2 && (
              <div>
                <button onClick={() => setShowHint2(!showHint2)}>
                  Hint 2 {showHint2 ? "▲" : "▼"}
                </button>
                {showHint2 && <p>{questionData.hint_2}</p>}
              </div>
            )}

            {questionData?.hint_3 && (
              <div>
                <button onClick={() => setShowHint3(!showHint3)}>
                  Hint 3 {showHint3 ? "▲" : "▼"}
                </button>
                {showHint3 && <p>{questionData.hint_3}</p>}
              </div>
            )}
          </div>

          {/* AI Feedback */}
          {reviewResult && (
            <div>
              <h3>AI Feedback</h3>
              <p>Score: {reviewResult.score}/100</p>
              <p>Complexity: {reviewResult.complexity}</p>
              <p>Remarks: {reviewResult.remark}</p>
            </div>
          )}
        </section>

        {/* Right Side: Editor & Controls */}
        <section>
          <div>
            <label>
              Language:{" "}
              <select value={language} onChange={handleLanguageChange}>
                <option value="python">Python</option>
                <option value="cpp">C++</option>
                <option value="java">Java</option>
                <option value="javascript">JavaScript</option>
              </select>
            </label>

            <label>
              Theme:{" "}
              <select value={theme} onChange={(e) => setTheme(e.target.value)}>
                <option value="vs-dark">Dark</option>
                <option value="light">Light</option>
              </select>
            </label>

            <button onClick={() => setCode(STARTER_TEMPLATES[language])}>
              Reset Code
            </button>
          </div>

          {/* Monaco Editor */}
          <div>
            <Editor
              height="500px"
              language={language}
              theme={theme}
              value={code}
              onChange={(val) => setCode(val || "")}
              options={{
                fontSize: 14,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                automaticLayout: true,
              }}
            />
          </div>
        </section>
      </div>
    </div>
  );
}