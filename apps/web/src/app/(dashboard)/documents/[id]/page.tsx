"use client";

import { use, Suspense } from 'react';
import { Loader2 } from "lucide-react";
import { DocumentDetail } from "@/features/documents/components/DocumentDetail";

export default function DocumentDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);

    return (
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        }>
            <DocumentDetail id={resolvedParams.id} />
        </Suspense>
    );
}
