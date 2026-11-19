import { RoleValue } from "@/lib/constants/roles.constants";

export interface AdminUser {
    id: string;
    name: string | null;
    email: string;
    role: RoleValue;
    createdAt: string;
    conversationCount: number;
}

export interface AIProviderInfo {
    name: string;
    model: string;
    configured: boolean;
}

export interface AssistantConfig {
    id: string | null;
    name: string;
    description: string;
    systemPrompt: string;
    temperature: number;
    maxTokens: number;
    guardrails: string;
    updatedAt: string | null;
    providers: {
        primary: AIProviderInfo;
        fallback: AIProviderInfo;
    };
}

export interface DailyActivity {
    date: string;
    messages: number;
}

export interface AdminStatistics {
    generatedAt: string;
    users: { total: number; admins: number; users: number; newLast7Days: number };
    conversations: { total: number; activeLast7Days: number; averageMessages: number };
    messages: {
        total: number;
        fromUsers: number;
        fromAssistant: number;
        failed: number;
        last7Days: number;
        byProvider: { OPENROUTER: number; GROQ: number };
    };
    feedback: { positive: number; negative: number; satisfactionRate: number | null };
    activity: DailyActivity[];
}
