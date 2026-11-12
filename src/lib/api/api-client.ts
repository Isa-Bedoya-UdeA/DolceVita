/** Minimal JSON client for the app's own API routes. Throws with the server's message. */
export async function apiRequest<T>(url: string, init: RequestInit = {}): Promise<T> {
    const res = await fetch(url, {
        ...init,
        headers: { "Content-Type": "application/json", ...init.headers },
    });

    const json = await res.json().catch(() => ({}));

    if (!res.ok) {
        throw new Error(json?.error?.message || "No se pudo completar la solicitud");
    }

    return json.data as T;
}
