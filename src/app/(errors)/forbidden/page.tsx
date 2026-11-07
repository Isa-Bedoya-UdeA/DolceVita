export default function ForbiddenPage() {
    return (
        <main className="flex min-h-screen items-center justify-center p-4">
            <div className="text-center">
                <h1 className="text-3xl font-bold">403 - Acceso Denegado</h1>
                <p className="text-text-muted mt-2">
                    No tienes permisos para acceder a este recurso.
                </p>
            </div>
        </main>
    );
}
