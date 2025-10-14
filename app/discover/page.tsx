export default function DiscoverPage() {
	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
			<div className="max-w-4xl mx-auto px-4 py-16">
				{/* Title */}
				<h1 className="text-5xl font-bold text-gray-900 mb-6 text-center">
					YouTube Shorts Transcript Extractor
				</h1>
				{/* Main Description Card */}
				<div className="bg-white rounded-xl p-8 shadow-md text-center mb-16">
					<p className="text-xl text-gray-600 max-w-2xl mx-auto mb-4">
						Extract transcripts from the top 25 most viral YouTube Shorts from any channel—instantly.
					</p>
					<p className="text-base text-gray-500 max-w-2xl mx-auto mb-2">
						Perfect for content creators, marketers, and researchers who want to analyze
						viral content strategies. Get full transcripts, view counts, and rankings
						for any YouTube channel's most successful Shorts.
					</p>
					<p className="text-sm text-gray-400 max-w-2xl mx-auto">
						💡 <strong>Powered by:</strong> YouTube Data API v3 & TranscriptAPI.com
						for professional-grade transcript extraction
					</p>
				</div>

				{/* Features Section */}
				<div className="grid md:grid-cols-2 gap-6 mb-10">
					<div className="bg-white rounded-xl p-6 shadow-md flex flex-col gap-2">
						<h3 className="font-semibold text-gray-900">
							⚡ Instant Analysis
						</h3>
						<p className="text-sm text-gray-600">
							Scans up to 500 videos per channel to find the top 25 most viral
							Shorts by view count. Results in under 15 seconds.
						</p>
					</div>
					<div className="bg-white rounded-xl p-6 shadow-md flex flex-col gap-2">
						<h3 className="font-semibold text-gray-900">
							📝 Full Transcripts
						</h3>
						<p className="text-sm text-gray-600">
							Professional transcript extraction with 80-100% success rate,
							depending on creator settings. Download all as JSON.
						</p>
					</div>
					<div className="bg-white rounded-xl p-6 shadow-md flex flex-col gap-2">
						<h3 className="font-semibold text-gray-900">
							📊 Complete Data
						</h3>
						<p className="text-sm text-gray-600">
							Get view counts, publish dates, thumbnails, direct links, and
							complete rankings for every Short.
						</p>
					</div>
					<div className="bg-white rounded-xl p-6 shadow-md flex flex-col gap-2">
						<h3 className="font-semibold text-gray-900">
							🎯 Any Channel
						</h3>
						<p className="text-sm text-gray-600">
							Works with any YouTube channel URL format: @handles, /channel/,
							/c/, or /user/ links.
						</p>
					</div>
				</div>

				<h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
					Perfect For
				</h2>

				{/* Use Cases */}
				<div className="grid md:grid-cols-2 gap-6">
					{/* Use Case 1 */}
					<div className="bg-white rounded-xl p-6 shadow-md flex flex-col">
						<div>
							<h3 className="text-lg font-bold text-gray-900 mb-1">
								Content Creators
							</h3>
							<p className="text-xs text-gray-500 mb-2">Competitive Research</p>
							<p className="text-gray-700 mb-4 text-sm">
								Analyze what makes your competitors' Shorts go viral. Study
								their scripts, hooks, and messaging patterns to improve your own
								content strategy.
							</p>
						</div>
					</div>

					{/* Use Case 2 */}
					<div className="bg-white rounded-xl p-6 shadow-md flex flex-col">
						<div>
							<h3 className="text-lg font-bold text-gray-900 mb-1">
								Marketing Teams
							</h3>
							<p className="text-xs text-gray-500 mb-2">Trend Analysis</p>
							<p className="text-gray-700 mb-4 text-sm">
								Research viral content in your niche. Extract transcripts from
								top performers to identify messaging trends, keywords, and
								engagement patterns.
							</p>
						</div>
					</div>

					{/* Use Case 3 */}
					<div className="bg-white rounded-xl p-6 shadow-md flex flex-col">
						<div>
							<h3 className="text-lg font-bold text-gray-900 mb-1">
								Course Creators
							</h3>
							<p className="text-xs text-gray-500 mb-2">Content Repurposing</p>
							<p className="text-gray-700 mb-4 text-sm">
								Extract transcripts from educational Shorts to repurpose into
								course materials, blog posts, or social media content.
							</p>
						</div>
					</div>

					{/* Use Case 4 */}
					<div className="bg-white rounded-xl p-6 shadow-md flex flex-col">
						<div>
							<h3 className="text-lg font-bold text-gray-900 mb-1">
								Agencies
							</h3>
							<p className="text-xs text-gray-500 mb-2">Client Reports</p>
							<p className="text-gray-700 mb-4 text-sm">
								Generate comprehensive competitor analysis reports for clients.
								Export all data as JSON for integration into your workflows.
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
