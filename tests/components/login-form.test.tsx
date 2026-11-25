import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LoginForm } from "@/features/auth/components/LoginForm";
import { sanitizeCallbackUrl } from "@/features/auth/hooks/useAuth";

const replace = vi.fn();
const refresh = vi.fn();
let search = new URLSearchParams();

vi.mock("next/navigation", () => ({
    useRouter: () => ({ replace, refresh, push: vi.fn() }),
    useSearchParams: () => search,
}));

const signIn = vi.fn();
vi.mock("@/lib/auth/auth-client", () => ({
    signIn: (...args: unknown[]) => signIn(...args),
    signOut: vi.fn(),
}));

describe("LoginForm Component (UI)", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        search = new URLSearchParams();
    });

    it("should render email and password input fields (feature/auth-and-security)", () => {
        render(<LoginForm />);

        expect(screen.getByLabelText("Correo electrónico")).toHaveAttribute("type", "email");
        expect(screen.getByLabelText("Contraseña")).toHaveAttribute("type", "password");
        expect(screen.getByRole("button", { name: "Iniciar sesión" })).toBeInTheDocument();
    });

    it("should validate credentials on submit (feature/auth-and-security)", async () => {
        render(<LoginForm />);

        await userEvent.click(screen.getByRole("button", { name: "Iniciar sesión" }));

        expect(await screen.findByText("Ingresa tu correo electrónico")).toBeInTheDocument();
        expect(screen.getByText("Ingresa tu contraseña")).toBeInTheDocument();
        expect(signIn).not.toHaveBeenCalled();
    });

    it("signs in and redirects to the callbackUrl", async () => {
        search = new URLSearchParams("callbackUrl=/conversations");
        signIn.mockResolvedValue({ ok: true, error: undefined });
        render(<LoginForm />);

        await userEvent.type(screen.getByLabelText("Correo electrónico"), "user@dolcevita.com");
        await userEvent.type(screen.getByLabelText("Contraseña"), "User1234!");
        await userEvent.click(screen.getByRole("button", { name: "Iniciar sesión" }));

        await waitFor(() => expect(replace).toHaveBeenCalledWith("/conversations"));
        expect(signIn).toHaveBeenCalledWith("credentials", {
            email: "user@dolcevita.com",
            password: "User1234!",
            redirect: false,
        });
    });

    it("shows a generic error for invalid credentials", async () => {
        signIn.mockResolvedValue({ ok: false, error: "CredentialsSignin" });
        render(<LoginForm />);

        await userEvent.type(screen.getByLabelText("Correo electrónico"), "user@dolcevita.com");
        await userEvent.type(screen.getByLabelText("Contraseña"), "mala");
        await userEvent.click(screen.getByRole("button", { name: "Iniciar sesión" }));

        expect(await screen.findByRole("alert")).toHaveTextContent(
            "Correo o contraseña incorrectos",
        );
        expect(replace).not.toHaveBeenCalled();
    });

    it("toggles password visibility", async () => {
        render(<LoginForm />);
        const input = screen.getByLabelText("Contraseña");

        await userEvent.click(screen.getByRole("button", { name: "Mostrar contraseña" }));
        expect(input).toHaveAttribute("type", "text");
    });
});

describe("sanitizeCallbackUrl", () => {
    it.each([
        [null, "/chat"],
        ["/admin/users", "/admin/users"],
        ["https://evil.com", "/chat"],
        ["//evil.com", "/chat"],
        ["/login", "/chat"],
    ])("%s -> %s", (input, expected) => {
        expect(sanitizeCallbackUrl(input)).toBe(expected);
    });
});
