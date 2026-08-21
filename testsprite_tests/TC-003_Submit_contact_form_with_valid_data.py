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
        
        # -> Click the 'Contacto' link in the navbar to open the contact page.
        # Contacto link
        elem = page.get_by_text('Navegación', exact=True).locator("xpath=ancestor-or-self::*[.//a][1]").get_by_role('link', name='Contacto', exact=True)
        await elem.click(timeout=10000)
        
        # -> Fill the 'Nombre completo', 'Correo electrónico', and 'Tu mensaje' fields and click the 'Enviar consulta' button.
        # Ej: Juan Pérez text field
        elem = page.locator('[id="name"]')
        await elem.wait_for(state="visible", timeout=10000)
        await elem.fill("Juan P\u00e9rez")
        
        # -> Fill the 'Nombre completo', 'Correo electrónico', and 'Tu mensaje' fields and click the 'Enviar consulta' button.
        # juan@ejemplo.com email field
        elem = page.locator('[id="email"]')
        await elem.wait_for(state="visible", timeout=10000)
        await elem.fill("juan@example.com")
        
        # -> Fill the 'Nombre completo', 'Correo electrónico', and 'Tu mensaje' fields and click the 'Enviar consulta' button.
        # ¿En qué podemos ayudarte? text area
        elem = page.locator('[id="message"]')
        await elem.wait_for(state="visible", timeout=10000)
        await elem.fill("Hola, me gustar\u00eda saber m\u00e1s sobre sus auriculares.")
        
        # -> Fill the 'Nombre completo', 'Correo electrónico', and 'Tu mensaje' fields and click the 'Enviar consulta' button.
        # Enviar consulta button
        elem = page.get_by_role('button', name='Enviar consulta', exact=True)
        await elem.click(timeout=10000)
        
        # -> Wait for a success confirmation message (visible text like 'Gracias' or 'Mensaje enviado') to appear, then click the 'Contactar por WhatsApp' button to verify it opens.
        # ¿En qué podemos ayudarte? link
        elem = page.get_by_role('link', name='Contactar por WhatsApp', exact=True)
        await elem.click(timeout=10000)
        
        # -> Switch to the 'Contacto' tab and look for a visible success message such as 'Gracias' or 'Mensaje enviado' on the page.
        # Switch to tab 7E6F
        page = context.pages[-1]  # switch to most recently active tab
        
        # --> Assertions to verify final state
        # Find the contact page among open tabs that contains the success text
        contact_page = None
        for p in context.pages:
            try:
                if await p.locator("text=Mensaje enviado").count() > 0:
                    contact_page = p
                    break
            except Exception:
                pass
        # Assert: Contact page with the success message is present in the open pages
        assert contact_page is not None, "Contact page with success message was not found among open tabs"
        
        elem = contact_page.locator("text=Mensaje enviado").nth(0)
        await elem.scroll_into_view_if_needed()
        # Assert: Success banner shows the text "Mensaje enviado"
        assert await elem.is_visible(), "Expected element to be visible after scrolling into view"
        
        text = await contact_page.locator("text=Gracias por contactarnos. Te responderemos a la brevedad.").nth(0).text_content()
        # Assert: Success message contains "Gracias por contactarnos. Te responderemos a la brevedad."
        assert "Gracias por contactarnos. Te responderemos a la brevedad." in text, "Expected detailed success message to be present"
        
        elem = contact_page.locator('xpath=/html/body/div/main/div/div[2]/div/div/button').nth(0)
        await elem.scroll_into_view_if_needed()
        # Assert: "Enviar otro mensaje" button is visible on the contact page
        assert await elem.is_visible(), "Expected element to be visible after scrolling into view"
        
        current_url = await page.evaluate("() => window.location.href")
        # Assert: WhatsApp opened in a new tab (URL contains api.whatsapp.com or wa.me)
        assert ("api.whatsapp.com" in current_url) or ("wa.me" in current_url), "The page should be a WhatsApp URL (api.whatsapp.com or wa.me)"
        await asyncio.sleep(5)

    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()

asyncio.run(run_test())
    