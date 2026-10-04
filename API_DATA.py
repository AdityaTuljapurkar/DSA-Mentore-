import os
from dotenv import load_dotenv
from google import genai

# Load .env file
load_dotenv()

API_KEY = os.getenv("AI_API_KEY")
client = genai.Client(api_key=API_KEY)

interaction = client.interactions.create(
    model="gemini-3.6-flash",  # Note: Gemini model name is usually gemini-2.5-flash or gemini-1.5-flash
    input="I am testing django secret KEY" 
)
print(interaction)


{
  "message": {
    "code_output": "hello\n",
    "ai_review": {
      "review_status": "INCORRECT",
      "summary": "The submitted code does not solve Two Sum.",
      "logic_analysis": "...",
      "issues": [],
      "edge_cases": [],
      "complexity": {
        "time": null,
        "auxiliary_space": null,
        "explanation": "The algorithm is not implemented."
      },
      "optimization": {
        "needed": false,
        "suggestion": null
      },
      "hints": [
        {"level": 1, "hint": "Understand the target sum."},
        {"level": 2, "hint": "Consider using a hash map."},
        {"level": 3, "hint": "Check for the complement while iterating."}
      ],
      "next_step": "Implement the Two Sum algorithm."
    },
    "execution": {
      "status": "SUCCESS",
      "cpu_time": 0.01,
      "memory": 1024,
      "all_tests_passed": false
    }
  }
}

{"code_output":"hello\n","ai_review":{"message":{"review_status":"INCORRECT","summary":"The submitted code does not implement the Two Sum solution; it only prints a greeting and a random string, ignoring the input entirely.","logic_analysis":"The code consists of a print statement and a variable assignment that have no relationship to the Two Sum problem. It does not read the array or target from stdin, does not compute any indices, and produces output unrelated to the problem requirements. Therefore the algorithm is absent and the implementation cannot be considered correct.","issues":[{"type":"LOGIC_ERROR","severity":"CRITICAL","location":"entire source code","problem":"The program does not implement the Two Sum algorithm; it merely prints \"hello\" and a static string, ignoring the provided input entirely.","explanation":"Because the code never processes the input array or target, it cannot produce the required output (indices of the two numbers that sum to the target). This is a fundamental missing implementation.","example":{"input":"4 2 7 11 15\\n9","observed_output":"hello\\n","expected_output":"[0,1] (or any valid pair of indices whose values sum to 9)"},"suggestion":"Redesign the solution to read the array and target, then use a hash map to find the complement of each element and return the corresponding indices."}],"edge_cases":[],"complexity":{"time":null,"auxiliary_space":null,"explanation":"Complexity analysis is not applicable because the submission does not implement the required algorithm."},"optimization":{"needed":false,"suggestion":null},"hints":[{"level":1,"hint":"Consider reading the input line to obtain the array of numbers and the target value. A common approach for Two Sum is to use a hash map that stores each number's index and checks whether the complement (target - current number) has been seen before."}],"execution_analysis":{"execution_data_available":true,"reported_status":null,"observed_output":"hello","expected_output":null,"interpretation":"The executed code printed \"hello\" and a static string, completely bypassing the Two Sum logic. The execution therefore does not demonstrate correctness for the problem."},"next_step":"Implement a correct Two Sum solution that reads the array and target from stdin, then returns the indices of the two numbers whose sum equals the target (e.g., using a hash map for O(n) time)."}}}