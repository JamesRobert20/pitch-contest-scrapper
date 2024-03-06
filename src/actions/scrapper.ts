'use server'

import { VotingResultType } from "@/types/VotingResult";
import puppeteer from 'puppeteer'
import { scrapePage } from "./scrapperHelper";

export async function getVotingResults(): Promise<VotingResultType[]> {
    try {
        let results: VotingResultType[] = []

        // Launch headless browser
        //const browser = await puppeteer.launch();

        // Create a new page
        //const page = await browser.newPage();

        for(let i = 1; i < 9; i++) {
            results.push(...(await scrapePage(i)));
        }
        
        return results.sort((a, b) => b.votes - a.votes).slice(0, 30)
    } catch (error: any) {
        console.error('An error occured:\n', error)
        return []
    }
}