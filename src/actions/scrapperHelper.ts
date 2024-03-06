import { Page } from 'puppeteer'

export async function scrapePage(page: Page, pageNumber: number) {
    // Navigate to the webpage
    await page.goto(`https://www.blackentrepreneursbc.org/black-pitch-contest-2024-voting-page/page/${pageNumber}`);
    
    // Wait for the div to be available
    await page.waitForSelector('.gallery-wrap.plussix');

    const results = await page.evaluate(() => {
        // Extract the list of elements with class "one-half classic zip pcmobile"
        const divs = document.querySelectorAll('.gallery-wrap.plussix .one-half.classic.zip.pcmobile');
        
        // Map to desired results
        return Array.from(divs).map(div => {
            const nameElement = div.querySelector('.gallery-title-autor')?.firstChild;
            // Extract votes from the child element with class "gallery-votes"
            const votesElement = div.querySelector('.gallery-votes .pc_visible')?.lastChild;
            
            const name = nameElement ? nameElement.textContent ?? '' : '';
            let vt = Number(votesElement ? votesElement.textContent ?? '' : '')
            const votes = isNaN(vt) ? 0 : vt;

            return { name, votes }
        });
    });

    return results
}