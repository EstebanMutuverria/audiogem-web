import asyncio
import re
from playwright import async_api
from playwright.async_api import expect

async def run_test():
    pw = None
    browser = None
    context = None

    try:
        # Start a Playwright session in asynchronous mode
        pw = await async_api.async_playwright().start()

        # Launch a Chromium browser in headless mode with custom arguments
        browser = await pw.chromium.launch(
            headless=True,
            args=[
                "--window-size=1280,720",
                "--disable-dev-shm-usage",
                "--ipc=host",
                "--single-process"
            ],
        )

        # Create a new browser context (like an incognito window)
        context = await browser.new_context()
        # Wider default timeout to match the agent's DOM-stability budget;
        # auto-waiting Playwright APIs (expect, locator.wait_for) inherit this.
        context.set_default_timeout(15000)

        # Open a new page in the browser context
        page = await context.new_page()

        # Interact with the page elements to simulate user flow
        # -> navigate
        await page.goto("http://localhost:5173")
        try:
            await page.wait_for_load_state("domcontentloaded", timeout=5000)
        except Exception:
            pass
        
        # -> Click the 'Contacto' link in the navigation to open the contact page.
        # Contacto link
        elem = page.get_by_text('Navegación', exact=True).locator("xpath=ancestor-or-self::*[.//a][1]").get_by_role('link', name='Contacto', exact=True)
        await elem.click(timeout=10000)
        
        # -> Click the visible 'WhatsApp' button (the green floating WhatsApp icon) to open a WhatsApp chat.
        # WhatsApp link
        elem = page.get_by_role('link', name='WhatsApp', exact=True)
        await elem.click(timeout=10000)
        
        # --> Assertions to verify final state
        current_url = await page.evaluate("() => window.location.href")
        # Assert: WhatsApp send URL opened with phone +54 9 11 6008-1534
        assert "/send/?phone=5491160081534" in current_url, "The page should be at /send/?phone=5491160081534"
        text = await page.locator("text=Chat on WhatsApp with +54 9 11 6008-1534").nth(0).text_content()
        # Assert: Page shows heading 'Chat on WhatsApp with +54 9 11 6008-1534'
        assert "Chat on WhatsApp with +54 9 11 6008-1534" in text, "The WhatsApp chat heading should mention the expected phone number"
        elem = page.locator('xpath=/html/body/div[1]/div[1]/div/div/section/div/div/div/div[2]/div[4]/a[1]').nth(0)
        await elem.scroll_into_view_if_needed()
        # Assert: 'Open app' link/button is visible after scrolling into view
        assert await elem.is_visible(), "Expected element to be visible after scrolling into view"
        elem = page.locator('xpath=/html/body/div[1]/div[1]/div/div/section/div/div/div/div[2]/div[4]/a[2]').nth(0)
        await elem.scroll_into_view_if_needed()
        # Assert: 'Continue to WhatsApp Web' link/button is visible after scrolling into view
        assert await elem.is_visible(), "Expected element to be visible after scrolling into view"
        await asyncio.sleep(5)

    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()

asyncio.run(run_test())
    