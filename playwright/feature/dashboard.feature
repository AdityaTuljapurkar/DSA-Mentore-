@Dashboard
Feature: Dashboard 

Background:
    Given user navigated to the login page
    When user enters username "test_dev"
    When user enters password "123456"
    When user clicks submit button 
    Then user navigates to dashboard

Scenario: user navigates to question 
    When user clicks a question "Reverse Using Stack" in dashboard
    
    