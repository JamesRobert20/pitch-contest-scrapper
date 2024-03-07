import { VotingResultType } from "@/types/VotingResult";
import puppeteer, { Page } from 'puppeteer'
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
    return fetch(`https://www.blackentrepreneursbc.org/black-pitch-contest-2024-voting-page/page/${pageNumber}`, {
        cache: 'no-store'
    })
    .then(res => res.text())
    .then(htmlContent => {
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
    })
    /* .catch(error => {
        console.error(`Error occured on page ${pageNumber}:\n`, error)
        return []
    }) */
}

export async function getVotingResults(): Promise<VotingResultType[]> {
    let results: VotingResultType[] = []
    try {
        let timeoutPromise: Promise<VotingResultType[][]> = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Request from external website timed out')), 8800);
        });

        let resultsPromises = [];
        for(let i = 1; i < 9; i++) {
            resultsPromises.push(scrapePage(i));
        }
        let fetchPromise = Promise.all(resultsPromises)

        let response = await Promise.race([fetchPromise, timeoutPromise]);

        let allItems = response.reduce((acc, response) => acc.concat(response), []);

        results = allItems.sort((a, b) => b.votes - a.votes).slice(0, 30)
    } catch (error: any) {
        console.error('An error occured:\n', error)
    } finally {
        return results
    }
}