import pytest
from playwright.sync_api import sync_playwright
import os 



@pytest.fixture
def page():
    """Initializes Playwright browser and page, yielding the page instance."""
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False)
        context = browser.new_context()
        page = context.new_page()
        yield page
        context.close()
        browser.close()

def pytest_addoption(parser: pytest.Parser):
    parser.addoption(
        "--single_login",
        action = "store" ,
    default = False , 
    help = "Reuse saved login state: true or false",
    )