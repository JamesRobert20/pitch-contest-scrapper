'use server'

import { VotingResultType } from "@/types/VotingResult";

export async function getVotingResults(): Promise<VotingResultType[]> {
    try {
        let results: VotingResultType[] = [
            {
                name: 'Blah Blah',
                votes: 23
            },
            {
                name: 'BLah Blah',
                votes: 23
            },
            {
                name: 'BLah Blah',
                votes: 23
            },
            {
                name: 'BLah Blah',
                votes: 23
            },
            {
                name: 'BLah Blah',
                votes: 23
            },
            {
                name: 'BLah Blah',
                votes: 23
            },
            {
                name: 'BLah Blah',
                votes: 23
            },
        ]
        let pagesResults = []
        let res = await fetch('https://www.blackentrepreneursbc.org/black-pitch-contest-2024-voting-page/page/1')
        return results
    } catch (error: any) {
        console.error('An error occured:\n', error)
        return []
    }
}