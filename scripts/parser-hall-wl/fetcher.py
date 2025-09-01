import logging
from typing import List, Literal
from urllib.parse import urljoin
from playwright.async_api import Page
from playwright.async_api import async_playwright

log = logging.getLogger("fetcher")

async def login(page: Page, username: str, password: str):
    """Detect common Microsoft login pages and try to perform sign-in.

    This is best-effort: different tenants and flows show different selectors.
    We handle the common elements used by Azure AD pages (#i0116 for username,
    #i0118 for password, and #idSIButton9 as the primary continue button).
    """
    from playwright.async_api import TimeoutError as PWTimeout

    for _ in range(20):
        url = page.url
        if "login.microsoftonline.com" not in url and "microsoftonline" not in url and "login.windows" not in url:
            return

        log.info("Detected Microsoft login page: %s", url)

        try:
            # email / username
            if await page.query_selector('#i0116'):
                log.info("Filling username")
                await page.fill('#i0116', username)
                # click next
                if await page.query_selector('#idSIButton9'):
                    await page.click('#idSIButton9')
                    await page.wait_for_load_state('networkidle', timeout=15000)

            # password
            if await page.query_selector('#i0118'):
                log.info("Filling password")
                await page.fill('#i0118', password)
                if await page.query_selector('#idSIButton9'):
                    await page.click('#idSIButton9')
                    await page.wait_for_load_state('networkidle', timeout=15000)

            # Handle optional "Stay signed in?" dialog: No button has id 'idBtn_Back'
            if await page.query_selector('#idBtn_Back'):
                await page.click('#idBtn_Back')
                await page.wait_for_load_state('networkidle', timeout=10000)

            # If Duo or other 2FA is present, usually it runs JS in an iframe.
            # We allow some time for it to auto-complete.
            await page.wait_for_timeout(10000)

        except PWTimeout:
            log.debug("Timeout while handling MS login - will retry/wait")

        # Small pause to allow redirects to complete
        await page.wait_for_load_state('networkidle', timeout=30000)


async def fetch_pdf(page: Page, url: str) -> bytes:
    log.info("Fetching PDF: %s", url)

    context = page.context
    new_page = await context.new_page()
    try:
        resp = await new_page.request.get(url)
        
        if not resp.ok:
            log.error("Failed to fetch PDF: %s. Reason: %s, %s", url, resp.status, await resp.text())
            return bytes()

        pdf = await resp.body()
    finally:
        await new_page.close()
    
    return pdf


async def fetch(username: str, password: str) -> dict[Literal["L", "NL"], bytes]:
    """
    Main runner: finds PDF links on the public page, downloads each via a browser
    session so Duo JS runs and authentication completes.
    """
    
    url = 'https://shrl.hkust.edu.hk/admission-policy/ug/waitlist'

    async with async_playwright() as pw:
        browser = await pw.chromium.launch(headless=False)  # Duo 2FA
        context = await browser.new_context()
        page = await context.new_page()

        log.info("Loading public page to discover PDF links: %s", url)
        await page.goto(url, wait_until='networkidle')

        # collect anchors with pdfs in href
        anchors = await page.query_selector_all('a')
        links: List[str] = []
        for a in anchors:
            href = await a.get_attribute('href')
            if not href:
                continue
            # resolve relative URLs
            full = urljoin(url, href)
            if full.lower().endswith('.pdf'):
                links.append(full)

        links = sorted(set(links))
        log.info("Found %d PDF links", len(links))
        
        pdfs = {}

        # Iterate links and download. Authentication may be triggered by navigation.
        for link in links:
            try:
                await page.goto(link, wait_until='networkidle', timeout=30000)

                # If we landed on Microsoft login page, attempt to sign in
                if 'login.microsoftonline.com' in page.url or 'microsoftonline' in page.url or 'login.windows' in page.url:
                    if not username or not password:
                        raise RuntimeError('Authentication required but username/password not provided')
                    await login(page, username, password)
                    # After login attempt, navigate back to the PDF
                    await page.goto(link, wait_until='networkidle', timeout=120000)

                # sometimes the PDF returns as the main response, sometimes via a redirect.
                pdf = await fetch_pdf(page, link)
                
                match None:
                    case _ if "Local" in link:
                        if "Local" in pdfs:
                            log.warning("Multiple 'Local' PDFs found, overwriting previous")
                        pdfs["L"] = pdf
                    case _ if "NL" in link or "NHB" in link:
                        if "NL" in pdfs:
                            log.warning("Multiple 'Non-Local' PDFs found, overwriting previous")
                        pdfs["NL"] = pdf
                    case _:
                        log.warning("Unrecognized PDF: %s", link)

                log.info('Downloaded: %s', link)
            except Exception as e:
                log.error('Failed to download %s: %s', link, e)

        await browser.close()
        return pdfs
