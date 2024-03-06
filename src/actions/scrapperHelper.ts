import { VotingResultType } from '@/types/VotingResult';
import { Page } from 'puppeteer'
import * as cheerio from 'cheerio';

export async function scrapePage1(page: Page, pageNumber: number) {
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

export async function scrapePage(pageNumber: number) {
    // Fetch HTML content of the webpage
    const response = await fetch(`https://www.blackentrepreneursbc.org/black-pitch-contest-2024-voting-page/page/${pageNumber}`, {
        next: { revalidate: 600 }
    });

    // Parse HTML content using regex or any other method
    const htmlContent = await response.text();

    // Load HTML content into cheerio
    const $ = cheerio.load(htmlContent);

    // Extract voting results
    const results: VotingResultType[] = [];
    $('.gallery-wrap.plussix .one-half.classic.zip.pcmobile').each((index, element) => {
        const name = $(element).find('.gallery-title-autor .author').text().trim();
        const votes = parseInt($(element).find('.gallery-votes .pc_visible').text().trim()) || 0;

        results.push({ name, votes });
    });

    return results;
}