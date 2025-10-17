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
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={`${inter.variable} antialiased`}>
				<WhopApp>{children}</WhopApp>
			</body>
		</html>
	);
}
