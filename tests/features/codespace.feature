
@Codespace 
Feature: codespace 

Background:
    Given user navigated to the login page
    When user enters username "test_dev"
    When user enters password "123456"
    When user clicks submit button 
    Then user navigates to dashboard
    When user clicks a question "Reverse Using Stack" in dashboard  

Scenario: user changes the code language c++ 
    When user clicks on language "cpp" dropdown 
    When user resets the code space
    Then Cpp code Template is loaded 

Scenario: user changes the code language java
    When user clicks on language "java" dropdown 
    When user resets the code space
    Then Java code Template is loaded 
    
Scenario: user changes the code language javascript
    When user clicks on language "javascript" dropdown 
    When user resets the code space
    Then Javascript code Template is loaded 

Scenario: user changes the code language python
    When user clicks on language "python" dropdown 
    When user resets the code space
    Then Python code Template is loaded 
    
Scenario: user checks redis cache reload 
    When user removes the older code
    When user enter custom data "lets_check_the_redis"
    When user reloads the page 
    Then user finds custom data "lets_check_the_redis"

Scenario: user changes the color theme to light 
    When user selects the light theme 
    Then light theme applied to the code editor

Scenario: user changes the color theme to dark 
    When user selects the dark theme 
    Then dark theme applied to the code editor

Scenario: user submits code and receives AI review
    Given user enables successful AI review mock
    When user removes the older code
    When user enter custom data "this is the code test"
    When user clicks submit code button 
    Then review status displays "partially_correct"

Scenario: user submits code and receives timeout
    Given user enables timeout AI review mock
    When user removes the older code
    When user enter custom data "this is the code test"
    When user clicks submit code button 
    Then review status error displays "Execution Engine timeout while waiting for response"

Scenario: user submits code and receives unauthorized 
    Given user enables unauthorized AI review mock
    When user removes the older code
    When user enter custom data "this is the code test"
    # When user clicks submit code button 
    Then user redirects to login 
    




    


