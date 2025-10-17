import { WhopApp } from "@whop/react/components";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
	subsets: ["latin"],
	variable: "--font-inter",
	weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
	title: "YouTube Shorts Transcript Extractor",
	description: "Extract transcripts from YouTube Shorts",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	// Check if we have the required env vars (for build time safety)
	const hasWhopConfig = process.env.NEXT_PUBLIC_WHOP_APP_ID;

	return (
		<html lang="en" suppressHydrationWarning>
			<body className={`${inter.variable} antialiased`}>
				{hasWhopConfig ? (
					<WhopApp>{children}</WhopApp>
				) : (
					// Fallback during build or if env vars are missing
					children
				)}
			</body>
		</html>
	);
}
