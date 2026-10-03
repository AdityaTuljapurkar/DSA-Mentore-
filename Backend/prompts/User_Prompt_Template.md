# DSA Mentor: User Prompt Template

Use this prompt for each code-review request. Keep the stable reviewing
rules in the **system prompt** and put the problem-specific information
here.

## Task

Review my submitted solution to the programming problem below. Follow
the system instructions exactly.

## Problem statement

``` text
{{PROBLEM_STATEMENT}}
```

## Required input/output format and constraints

``` text
{{INPUT_OUTPUT_FORMAT_AND_CONSTRAINTS}}
```

## My submission

**Programming language:** `{{LANGUAGE}}`

`{{LANGUAGE}} {{SOURCE_CODE}}`

## Execution results (if available)

Provide the actual Judge0 response or execution data. Do not invent
results if the code was not executed.

``` json
{{JUDGE0_RESULT_JSON_OR_NULL}}
```

## Expected output (if available)

``` text
{{EXPECTED_OUTPUT_OR_NOT_PROVIDED}}
```

## Review preferences

-   **Hint level requested:** `{{HINT_LEVEL}}`
    -   `1`: conceptual hint only
    -   `2`: targeted hint about the likely issue or pattern
    -   `3`: algorithmic direction
    -   `4`: pseudocode, if permitted by the system prompt
    -   `5`: complete solution only if explicitly requested and
        permitted
-   **Primary goal:** Help me understand the correctness of my approach
    and derive improvements myself.
-   **Do not immediately replace my code with a complete solution.**
    Start with reasoning, counterexamples, and progressive hints.
-   Distinguish facts confirmed by execution from conclusions inferred
    by static code analysis.
-   Return exactly the JSON object required by the system prompt, with
    no Markdown fences or extra prose.

## Optional context

``` text
{{OPTIONAL_CONTEXT_OR_NULL}}
```

