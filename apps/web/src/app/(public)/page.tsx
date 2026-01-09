import { Button } from '@/components/ui/button'; // Assuming shadcn button exists or will exist. 
// Wait, I haven't added button component yet. I ran shadcn init but didn't add button. 
// I should add button component via shadcn CLI or just use standard HTML for now to avoid errors if button missing.
// Actually, I can use a standard button for the placeholder.

export default function LandingPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-8 gap-8">
            <header className="text-center space-y-4">
                <h1 className="text-4xl font-bold tracking-tight">Nexus AI</h1>
                <p className="text-muted-foreground text-lg max-w-lg">
                    Smart Content Summarizer & Task Extractor. Paste your transcript below.
                </p>
            </header>

            <main className="w-full max-w-2xl space-y-4">
                <textarea
                    className="w-full h-48 p-4 rounded-lg border bg-background resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Paste meeting transcript or text here..."
                />
                <div className="flex justify-end">
                    <button className="bg-primary text-primary-foreground px-6 py-2 rounded-md font-medium hover:opacity-90 transition-opacity">
                        Generate Summary
                    </button>
                </div>
            </main>

            <footer className="text-sm text-muted-foreground mt-12">
                <p>Guest Access: 1 Free Run</p>
            </footer>
        </div>
    );
}
