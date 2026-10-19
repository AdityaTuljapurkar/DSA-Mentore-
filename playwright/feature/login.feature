@Login 
Feature: User Authentication [login] 

    As a Registerd user check weather i am navigated to the apllication dashboard

    Background: 
        Given user navigated to the login page

    Scenario: login with vaild credentials 
        When user enters username "test_dev"
        When user enters password "123456"
        When user clicks submit button 
        Then user navigates to dashboard 

    Scenario: login with wrong credentials [password]
        When user enters username "test_dev"
        When user enters password "qwerty"
        When user clicks submit button 
        Then user sees an invalid credentials error 
    

    Scenario: login with wrong credentials [username]
        When user enters username "qwerty"
        When user enters password "123456"
        When user clicks submit button 
        Then user sees an invalid credentials error 


