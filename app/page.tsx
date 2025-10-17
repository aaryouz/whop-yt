import ExtractForm from "./experiences/[experienceId]/extract-form";

export default function Page() {
	return (
		<div className="min-h-screen bg-[var(--bg-primary)] py-8">
			<div className="max-w-6xl mx-auto px-6 mb-8">
				<div className="bg-[var(--bg-elevated)] border border-[var(--brand-primary)]/30 rounded-lg p-4 mb-6">
					<p className="text-[var(--text-secondary)] text-sm">
						<strong className="text-[var(--brand-light)]">💡 Standalone Mode:</strong> You're accessing this app directly.
						For the full Whop experience with user authentication and access control, install this app from the{" "}
						<a
							href={process.env.NEXT_PUBLIC_WHOP_APP_ID ? `https://whop.com/apps/${process.env.NEXT_PUBLIC_WHOP_APP_ID}/install` : "https://whop.com"}
							target="_blank"
							rel="noopener noreferrer"
							className="text-[var(--brand-primary)] hover:text-[var(--brand-light)] underline"
						>
							Whop Marketplace
						</a>.
					</p>
				</div>
			</div>
			<ExtractForm />
		</div>
	);
}
