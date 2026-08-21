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
        
        # -> Click the 'Productos' link in the navbar to navigate to the products page.
        # Productos link
        elem = page.get_by_text('Navegación', exact=True).locator("xpath=ancestor-or-self::*[.//a][1]").get_by_role('link', name='Productos', exact=True)
        await elem.click(timeout=10000)
        
        # -> Click the 'AUDIOGEM' logo in the navbar to navigate to the home page (Inicio).
        # AUDIO GEM link
        elem = page.get_by_role('link', name='AUDIO GEM', exact=True)
        await elem.click(timeout=10000)
        
        # --> Assertions to verify final state
        current_url = await page.evaluate("() => window.location.href")
        # Assert: URL navigates to http://localhost:5173/ after clicking the Home link
        assert "http://localhost:5173/" in current_url, "The page should be at http://localhost:5173/"
        
        elem = page.locator('xpath=/html/body/div[1]/main/section[1]/div[2]/div[1]/div[2]/a[1]').nth(0)
        await elem.scroll_into_view_if_needed()
        # Assert: Home hero shows the CTA link "Ver productos"
        assert await elem.is_visible(), "Expected element to be visible after scrolling into view"
        text = await page.locator('xpath=/html/body/div[1]/main/section[1]/div[2]/div[1]/div[2]/a[1]').nth(0).text_content()
        # Assert: The "Ver productos" link text is exactly "Ver productos"
        assert 'Ver productos' in text, 'Expected "Ver productos" to be present in the link text'
        
        elem = page.locator('xpath=/html/body/div[1]/main/section[1]/div[2]/div[1]/div[2]/a[2]').nth(0)
        await elem.scroll_into_view_if_needed()
        # Assert: Home hero shows the CTA link "Contactanos"
        assert await elem.is_visible(), "Expected element to be visible after scrolling into view"
        
        elem = page.locator('xpath=/html/body/div[1]/main/section[1]/div[2]/div[2]/div/div[3]/div/div[4]/button').nth(0)
        await elem.scroll_into_view_if_needed()
        # Assert: Featured product has an "Agregar al carrito" button visible on the home page
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
    