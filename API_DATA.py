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

[AI_question_review : ]  
{'review_status': 'INCORRECT', 
 'summary': "The submitted code does not implement the Two Sum solution. It merely prints 'hello' and assigns a string to a variable, ignoring the problem requirements entirely.", 'logic_analysis': "The problem '1. Two Sum' requires finding two indices in an integer array such that their values add up to a given target. The submitted code contains no logic to read input, process an array, or compute two-sum indices. It simply prints a greeting and assigns a descriptive string to a variable.", 'issues': [{'type': 'LOGIC_ERROR', 'severity': 'CRITICAL', 'location': 'Entire submission', 'problem': 'The code does not address the Two Sum problem. It reads no input array, computes no complements, and returns no indices.', 'explanation': "Two Sum requires iterating through the array, calculating complements (target - current value), and checking if complements have been seen. The submitted code has none of this; it unconditionally prints 'hello' and exits.", 'example': {'input': 'array: [4, 2, 7, 11, 15], target: 9', 'expected_output': '[1, 2] (because 2 + 7 = 9)', 'actual_behavior': "Prints 'hello' and returns no Two Sum result."}, 'suggestion': "Reconsider the algorithm: store each number's complement in a hash map as you iterate, checking if the current number is already a complement from a previous iteration."}], 'edge_cases': [], 'complexity': {'time': 'null', 'auxiliary_space': 'null', 'explanation': 'Complexity cannot be meaningfully assessed because the submission does not implement the Two Sum algorithm.'}, 'optimization': {'needed': False, 'suggestion': None}, 'hints': [{'level': 1, 'hint': 'Two Sum requires finding two numbers in an array that add to a target. Consider how you might check, for each element, whether its complement (target - element) has already been encountered.'}, {'level': 2, 'hint': "A hash map (dictionary) mapping seen values to their indices enables O(1) lookup for complements. As you iterate, check if the current number's complement exists in the map."}, {'level': 3, 'hint': 'Algorithm outline: iterate with index i and value num. If target - num is already in the dictionary, return [map[target - num], i]. Otherwise, store map[num] = i. This handles the problem in a single pass.'}], 'execution_analysis': {'execution_data_available': True, 'reported_status': 'Success', 'observed_output': 'hello', 'expected_output': 'Two Sum result (e.g., [1, 2] for the provided stdin)', 'interpretation': "The execution produced 'hello' as expected given the submitted code, but this output is irrelevant to the Two Sum problem requirements."}, 'next_step': 'Rewrite the solution to implement the Two Sum algorithm using a hash map for O(n) time complexity. Begin by reading the array and target from stdin, then apply the complement-checking pattern.'}