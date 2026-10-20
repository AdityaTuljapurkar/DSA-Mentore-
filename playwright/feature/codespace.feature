
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
    Then Cpp code Template is loaded 

Scenario: user changes the code language java
    When user clicks on language "java" dropdown 
    Then Java code Template is loaded 
    
Scenario: user changes the code language javascript
    When user clicks on language "javascript" dropdown 
    Then Javascript code Template is loaded 

Scenario: user changes the code language python
    When user clicks on language "python" dropdown 
    Then Python code Template is loaded 
    
Scenario: user checks redis cache reload 
    When user removes the older code
    When user enter custom data "lets check the redis"
    When user reloads the page 
    Then user finds custom data "lets check the redis"

Scenario: user changes the color theme to light 
    When user selects the light theme 
    Then light theme applied to the code editor

Scenario: user changes the color theme to dark 
    When user selects the dark theme 
    Then dark theme applied to the code editor
    

    


