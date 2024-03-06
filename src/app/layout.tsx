import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    metadataBase: new URL('https://www.blackpitchcontestresults.vercel.app'),
    title: `Black Pitch Contest 2024 - Voting Results`,
    description: 'Top 30 Candidates',
    robots: "noindex, nofollow",
    openGraph: {
        title: "Black Pitch Contest 2024 - Voting Results",
        description: 'Top 30 Candidates',
        type: "website"
    }
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <center>{children}</center>
            </body>
        </html>
    );
}