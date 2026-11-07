import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "Dolce Vita | Asistente Gastronómico Experto",
    description:
        "Conversa con George, tu chef ejecutivo y sumiller experto impulsado por IA para técnicas culinarias, maridaje y recetas de autor.",
    icons: {
        icon: "/icons/favicon.ico",
        shortcut: "/icons/favicon.ico",
        apple: "/images/Logo.png",
    },
};

const themeScript = `
    (function() {
        try {
            var stored = localStorage.getItem('dolce-vita-theme');
            var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            var isDark = stored === 'dark' || (!stored && prefersDark) || (stored === 'system' && prefersDark);
            var root = document.documentElement;
            if (isDark) {
                root.classList.add('dark');
                root.classList.remove('light');
                root.setAttribute('data-theme', 'dark');
                root.style.colorScheme = 'dark';
            } else {
                root.classList.remove('dark');
                root.classList.add('light');
                root.setAttribute('data-theme', 'light');
                root.style.colorScheme = 'light';
            }
        } catch (e) {}
    })();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="es" className="h-full antialiased" suppressHydrationWarning>
            <head>
                <link rel="icon" href="/icons/favicon.ico" sizes="any" />
                <script dangerouslySetInnerHTML={{ __html: themeScript }} />
            </head>
            <body className="bg-background text-text-primary font-body flex min-h-full flex-col antialiased">
                {children}
            </body>
        </html>
    );
}
