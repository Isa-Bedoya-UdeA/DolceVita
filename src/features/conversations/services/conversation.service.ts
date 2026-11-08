import { ConversationItemData } from "../types/conversation.type";

export const conversationApiService = {
    async getAll(): Promise<ConversationItemData[]> {
        const res = await fetch("/api/conversations");
        if (!res.ok) throw new Error("Error fetching conversations");
        const json = await res.json();
        return json.data || [];
    },

    async getById(id: string): Promise<ConversationItemData> {
        const res = await fetch(`/api/conversations/${id}`);
        if (!res.ok) throw new Error("Error fetching conversation");
        const json = await res.json();
        return json.data;
    },

    async create(title?: string): Promise<ConversationItemData> {
        const res = await fetch("/api/conversations", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title: title || "Nueva conversación" }),
        });
        if (!res.ok) throw new Error("Error creating conversation");
        const json = await res.json();
        return json.data;
    },

    async rename(id: string, title: string): Promise<ConversationItemData> {
        const res = await fetch(`/api/conversations/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title }),
        });
        if (!res.ok) throw new Error("Error renaming conversation");
        const json = await res.json();
        return json.data;
    },

    async delete(id: string): Promise<void> {
        const res = await fetch(`/api/conversations/${id}`, {
            method: "DELETE",
        });
        if (!res.ok) throw new Error("Error deleting conversation");
    },
};
