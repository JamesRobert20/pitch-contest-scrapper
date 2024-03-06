import styles from './page.module.scss'

import { getVotingResults } from "@/actions/scrapper"

export const revalidate = 600

type TableCellProps = { shouldHaveBottomBorder: boolean } & ({
    isHeader: true
} | {
    isHeader: false,
    name: string,
    votes: number,
    position: number
}) 
const TableCell = (props: TableCellProps) => {
    const { isHeader, shouldHaveBottomBorder } = props
    return (
        <div className={`${styles.tableCell} ${shouldHaveBottomBorder ? styles.bottomBorder : ''}`}>
            <div className={`${styles.numberSection} ${isHeader ? styles.boldFont: ''}`}>
                {isHeader ? 'No.' : props.position}
            </div>
            <div className={`${styles.nameSection} ${isHeader ? styles.boldFont: ''}`}>
                <span>{isHeader ? 'Name' : props.name}</span>
            </div>
            <div className={`${styles.votesSection} ${isHeader ? styles.boldFont: ''}`}>
                {isHeader ? 'Votes' : props.votes}
            </div>
        </div>
    )
}

export default async function Home() {
    const results = await getVotingResults()

    return (
        <>
            <h1>Top 30 Results</h1>
            <div className={styles.container}>
                <TableCell isHeader={true} shouldHaveBottomBorder={true} />
                {results.map((result, index) => 
                    <TableCell 
                        key={result.name}
                        isHeader={false} 
                        name={result.name} 
                        votes={result.votes} 
                        position={index + 1}
                        shouldHaveBottomBorder={index < results.length - 1}
                    />
                )}
            </div>
        </>
    )
}