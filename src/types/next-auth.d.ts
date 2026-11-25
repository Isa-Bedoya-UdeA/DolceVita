import type { DefaultSession } from "next-auth";

type AppRole = "ADMIN" | "USER";

declare module "next-auth" {
    interface User {
        role: AppRole;
    }

    interface Session {
        user: {
            id: string;
            role: AppRole;
        } & DefaultSession["user"];
    }
}

// The JWT token carries `id` and `role` (set in the `jwt` callback of server/auth/config.ts).
