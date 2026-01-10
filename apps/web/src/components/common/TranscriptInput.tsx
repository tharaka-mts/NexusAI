import { Button } from '@/components/ui/Button';
import { ArrowRight } from 'lucide-react';

interface TranscriptInputProps {
    className?: string;
}

const TranscriptInput = ({ className }: TranscriptInputProps) => {
    return (
        <div className={`space-y-4 ${className || ''}`}>
            <div className="glass-card rounded-xl p-1 shadow-lg ring-1 ring-border/50">
                <div className="relative">
                    <textarea
                        className="w-full min-h-[180px] p-6 rounded-lg bg-transparent text-lg resize-none focus:outline-none placeholder:text-muted-foreground/50"
                        placeholder="Paste your meeting transcript, notes, or article text here..."
                    />
                    <div className="absolute bottom-4 right-4">
                        <Button
                            size="lg"
                            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-md transition-all hover:scale-105"
                        >
                            Generate Summary <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>
            <p className="text-sm text-center text-muted-foreground">
                Guest Access: <span className="text-foreground font-medium">1 Free Run</span> • No credit card required
            </p>
        </div>
    );
};

export default TranscriptInput;
