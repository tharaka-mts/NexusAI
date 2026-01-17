import Link from 'next/link';
import { safeFormatDate } from '@/lib/date';
import type { DocumentListItem } from '../types/documents.types';

interface DocumentCardProps {
    doc: DocumentListItem;
}

export const DocumentCard = ({ doc }: DocumentCardProps) => {
    return (
        <Link
            href={`/documents/${doc.id}`}
            className="group relative overflow-hidden rounded-xl border bg-card p-6 shadow-sm transition-all hover:shadow-md hover:border-primary/50"
        >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative space-y-4">
                <div className="space-y-2">
                    <h3 className="font-semibold leading-none tracking-tight group-hover:text-primary transition-colors line-clamp-1">
                        {doc.title || "Untitled Document"}
                    </h3>
                    {/* Summary is not in List Item anymore based on my Zod schema, so I removed it from card in list view for now or I need to check if list API returns it. 
              Repository listByUser only selects id, title, createdAt, updatedAt. So no summary in list. 
          */}
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground pt-4 border-t border-border/50">
                    {/* Status is also not in list API currently. Removing status dot for now to match strict schema. */}
                    <span className="flex items-center gap-1.5">
                        {/* Placeholder for status if we add it back to API later */}
                        Feature: Document
                    </span>
                    <time dateTime={typeof doc.createdAt === 'string' ? doc.createdAt : doc.createdAt.toISOString()}>
                        {safeFormatDate(doc.createdAt)}
                    </time>
                </div>
            </div>
        </Link>
    );
};
