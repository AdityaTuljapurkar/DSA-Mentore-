import { useState } from "react";
import Editor from "@monaco-editor/react";

// Default starter templates for each language
const STARTER_TEMPLATES = {
  python: `# Two Sum\n# Write your solution below\n\ndef twoSum(nums: list[int], target: int) -> list[int]:\n    # Your code here\n    pass\n`,
  cpp: `// Two Sum\n#include <vector>\n#include <unordered_map>\n\nclass Solution {\npublic:\n    std::vector<int> twoSum(std::vector<int>& nums, int target) {\n        // Your code here\n    }\n};\n`,
  java: `// Two Sum\nimport java.util.*;\n\nclass Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Your code here\n        return new int[]{};\n    }\n}\n`,
  javascript: `// Two Sum\n/**\n * @param {number[]} nums\n * @param {number} target\n * @return {number[]}\n */\nfunction twoSum(nums, target) {\n    // Your code here\n};\n`
};

export default function ProblemWorkspace() {
  const [language, setLanguage] = useState("python");
  const [code, setCode] = useState(STARTER_TEMPLATES.python);
  const [theme, setTheme] = useState("vs-dark");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle language change and update starter code template
  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setLanguage(newLang);
    setCode(STARTER_TEMPLATES[newLang] || "");
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    console.log("Submitting code for AI review:", { language, code });
    // TODO: Send to Django backend endpoint (e.g., /api/review)
    setTimeout(() => {
      setIsSubmitting(false);
      alert("Code submitted for AI review!");
    }, 1000);
  };

  return (
    <div style={{ display: "flex", height: "100vh", flexDirection: "column", background: "#1e1e1e", color: "#fff" }}>
      {/* Top Navbar */}
      <header style={{ padding: "10px 20px", background: "#2d2d2d", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ margin: 0, fontSize: "1.2rem" }}>DSA AI Mentor Workspace</h2>
        <div style={{ display: "flex", gap: "10px" }}>
          <button 
            onClick={handleSubmit} 
            disabled={isSubmitting}
            style={{
              padding: "8px 16px",
              background: isSubmitting ? "#555" : "#007acc",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: isSubmitting ? "not-allowed" : "pointer"
            }}
          >
            {isSubmitting ? "Analyzing with AI..." : "Submit for Review"}
          </button>
        </div>
      </header>

      {/* Main Split Body */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* Left Side: Problem Statement */}
        <div style={{ flex: 1, padding: "20px", overflowY: "auto", borderRight: "1px solid #444", background: "#252526" }}>
          <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "12px" }}>
            <span style={{ background: "#2e7d32", padding: "2px 8px", borderRadius: "4px", fontSize: "0.85rem" }}>Easy</span>
            <span style={{ background: "#444", padding: "2px 8px", borderRadius: "4px", fontSize: "0.85rem" }}>Arrays & Hashing</span>
          </div>

          <h1 style={{ marginTop: 0 }}>1. Two Sum</h1>
          <p>
            Given an array of integers <code>nums</code> and an integer <code>target</code>, return <em>indices of the two numbers such that they add up to <code>target</code></em>.
          </p>
          <p>You may assume that each input would have <strong>exactly one solution</strong>, and you may not use the same element twice.</p>

          <h3>Example 1:</h3>
          <pre style={{ background: "#1e1e1e", padding: "12px", borderRadius: "6px" }}>
Input: nums = [2,7,11,15], target = 9
Output: [0,1]
Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].
          </pre>

          <h3>Constraints:</h3>
          <ul>
            <li><code>2 &le; nums.length &le; 10<sup>4</sup></code></li>
            <li><code>-10<sup>9</sup> &le; nums[i] &le; 10<sup>9</sup></code></li>
            <li><code>-10<sup>9</sup> &le; target &le; 10<sup>9</sup></code></li>
          </ul>
        </div>

        {/* Right Side: Monaco Code Editor */}
        <div style={{ flex: 1.2, display: "flex", flexDirection: "column" }}>
          {/* Editor Controls Bar */}
          <div style={{ padding: "8px 15px", background: "#1f1f1f", display: "flex", justifyContent: "space-between", borderBottom: "1px solid #333" }}>
            <label style={{ fontSize: "0.9rem" }}>
              Language:{" "}
              <select 
                value={language} 
                onChange={handleLanguageChange}
                style={{ background: "#333", color: "#fff", border: "1px solid #555", borderRadius: "4px", padding: "4px 8px" }}
              >
                <option value="python">Python</option>
                <option value="cpp">C++</option>
                <option value="java">Java</option>
                <option value="javascript">JavaScript</option>
              </select>
            </label>

            <label style={{ fontSize: "0.9rem" }}>
              Theme:{" "}
              <select 
                value={theme} 
                onChange={(e) => setTheme(e.target.value)}
                style={{ background: "#333", color: "#fff", border: "1px solid #555", borderRadius: "4px", padding: "4px 8px" }}
              >
                <option value="vs-dark">Dark (VS Code)</option>
                <option value="light">Light</option>
                <option value="high contrast">High contrast</option>
              </select>
            </label>
          </div>

          {/* Monaco Editor Canvas */}
          <div style={{ flex: 1 }}>
            <Editor
              height="100%"
              language={language}
              theme={theme}
              value={code}
              onChange={(newVal) => setCode(newVal || "")}
              options={{
                fontSize: 14,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 4,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}    