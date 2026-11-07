interface ChatDetailPageProps {
    params: Promise<{ id: string }>;
}

export default async function ChatDetailPage({ params }: ChatDetailPageProps) {
    const { id } = await params;

    return (
        <main className="p-6">
            <h1 className="text-2xl font-bold">Conversación #{id}</h1>
        </main>
    );
}
