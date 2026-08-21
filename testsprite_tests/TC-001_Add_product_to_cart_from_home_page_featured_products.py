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
        
        # -> Scroll down to reveal the featured products section so the 'Agregar al carrito' button on the first product card becomes visible.
        await page.mouse.wheel(0, 300)
        
        # -> Click the 'Agregar 🛒' button on the first product card (B52 RM-2025BT 4x25 watts) to add it to the cart.
        # Agregar 🛒 button
        elem = page.get_by_role('button', name='Agregar B52 RM-2025BT 4x25 watts al carrito', exact=True)
        await elem.click(timeout=10000)
        
        # --> Assertions to verify final state
        elem = page.locator('xpath=/html/body/div/aside/div[1]/div/span').nth(0)
        await elem.scroll_into_view_if_needed()
        # Assert: Cart drawer is open and shows the item count "1"
        assert await elem.is_visible(), "Expected element to be visible after scrolling into view"
        
        elem = page.locator("text=B52 RM-2025BT 4x25 watts").nth(0)
        await elem.scroll_into_view_if_needed()
        # Assert: Cart shows product name "B52 RM-2025BT 4x25 watts"
        assert await elem.is_visible(), "Expected element to be visible after scrolling into view"
        
        elem = page.locator("text=Subtotal: $70.000").nth(0)
        await elem.scroll_into_view_if_needed()
        # Assert: Cart subtotal displays "Subtotal: $70.000"
        assert await elem.is_visible(), "Expected element to be visible after scrolling into view"
        
        qty = await page.locator('xpath=/html/body/div/aside/div[2]/div/div/div/2/div/div/span').nth(0).text_content()
        # Assert: Cart item quantity is "1"
        assert '1' in (qty or ''), "Expected cart item quantity to be 1"
        await asyncio.sleep(5)

    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()

asyncio.run(run_test())
    