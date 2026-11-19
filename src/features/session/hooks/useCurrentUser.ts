"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api/api-client";
import { endpoints } from "@/lib/api/endpoints";
import { ROLES } from "@/lib/constants/roles.constants";
import { CurrentUser } from "../types/session.type";

export function useCurrentUser() {
    const [user, setUser] = useState<CurrentUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let active = true;
        apiRequest<CurrentUser>(endpoints.currentUser)
            .then((data) => active && setUser(data))
            .catch(() => active && setUser(null))
            .finally(() => active && setIsLoading(false));
        return () => {
            active = false;
        };
    }, []);

    return { user, isLoading, isAdmin: user?.role === ROLES.ADMIN };
}
