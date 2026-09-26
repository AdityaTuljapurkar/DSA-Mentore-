import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Editor from "@monaco-editor/react";
import { json } from "monaco-editor";

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

  //Editor States 
  const [language, setLanguage] = useState("python");
  const [Theme, setTheme] = useState("vs-dark");
  const [code, setCode] = useState(STARTER_TEMPLATES.python);
  // AI Submission states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reviewResult, setReviewResult] = useState(null);

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
        if (err.response) {
          setError(`Question ID: ${questionID} not found!`);
        } else {
          setError(`Failed to connect (error code: ${err.response|| "network error"})`);
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


// source code template via language 
  const handleLanguageChange = async (e) => {
    const newLang = e.target.value;
    setLanguage(newLang)
    try {
      const accessTkn = localStorage.getItem('accessToken')
      const header = accessTkn ? {Authorization : `Bearer ${accessTkn}`} : {} ;
      const response  = await axios.get(`http://127.0.0.1:8000/api/cache_source_code/${questionID}`,{headers:header})
      if (response?.data.source_code != null){
        setCode(response.data.source_code);
      }
      else {
        setCode(STARTER_TEMPLATES[newLang] || "");
      }
      
    }
    catch(error) { 
        console.log(`found error while submitting the code due to ${error}`)
      }
    
    }
  //code submit 
  const handelSubmit = async () => {
    setIsSubmitting(true)
    setReviewResult(null)

    try {
      const accessTkn = localStorage.getItem("accessToken")
      const header = accessTkn ? { Authorization: `Bearer ${accessTkn}` } : {}

      const response = await axios.post(
        `http://127.0.0.1:8000/api/submissions/${questionID}`,
        { 
          question: questionData,
          language: language,
          source_code: code,
          language_id : lANGUAGE_IDs[language]
        },
        {headers: header }
      )
      setReviewResult(response.data) 
      console.log(`Backend Responed : ${response.data}`);
      
    }
    catch (err) {
      setError(` somthing went wrong error code : ${err.data}`)
      console.log(err);
      setReviewResult(null)
    }
    finally {
      setIsSubmitting(false);
    }
  }

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
      <header>
        <button onClick={() => navigate("/dashboard")}>← Back to Dashboard</button>
      </header>

      <main>
        {/* Topic and Number */}
        <div>
          <span>Topic: {questionData?.topic}</span> | <span>Question #{questionData?.ques_no}</span>
        </div>

        {/* Title */}
        <h1>{questionData?.question}</h1>

        {/* CKEditor HTML Content */}
        <div dangerouslySetInnerHTML={{ __html: questionData?.question_containt || "" }} />

        {/* Constraints */}
        {questionData?.constraints && (
          <div>
            <h3>Constraints:</h3>
            <pre>{questionData.constraints}</pre>
          </div>
        )}

        {/* Hints */}
        <div>
          <h3>Hints:</h3>
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
        {/* code editor section  */}
        <section>
          <h2>code editor
          </h2>
          {/* language dropdown  */}
          <label>
            Language : {""}
            <select value={language} onChange={handleLanguageChange}  >
              <option value={"python"} >python</option>
              <option value={"cpp"}>c++</option>
              <option value={"java"}>Java</option>
              <option value={"javascript"}>Javascript</option>
            </select>
          </label>
          <label>
            Theme : {""}
            <select value={Theme} onChange={(e) => setTheme(e.target.value)}>
              <option value={'vs-dark'}>Dark</option>
              <option value={'light'}>Light</option>
            </select>
            {/*Reset Button */}
            <button onClick={(e) => setCode(STARTER_TEMPLATES[language])}>Reset code </button>
          </label>
          {/* submit button */}

          <button onClick={handelSubmit} disabled={isSubmitting}>{isSubmitting ? "submitting.." : "submit code"}</button>

          {/* monaco editor component */}
          <Editor
            height={'450px'}
            language={language}
            theme={Theme}
            value={code}

            onChange={(val) => setCode(val)}
            options={{
              fontSize: 14,
              minimap: { enabled: false },
              automaticLayout: true,
            }} />
            {reviewResult &&(
  reviewResult.error ? (
                <div>
                  <h3>Review & Execution Result:</h3>
                  <pre>{JSON.stringify(reviewResult.error, null, 2)}</pre>
                </div>
              ) : (
                <div>
                  <h3>Review & Execution Result:</h3>
                  <pre>{JSON.stringify(reviewResult.message, null, 2)}</pre>
                </div>
              )
)} 
        </section>
      </main>
    </div>
  );
}