import { AdminUserRecord } from "../domain/contracts/user-repository.contract";
import { AdminUserResponseDto } from "../dto/user/user-response.dto";

export class UserMapper {
    static toAdminResponse(record: AdminUserRecord): AdminUserResponseDto {
        return {
            id: record.id,
            name: record.name,
            email: record.email,
            role: record.role,
            createdAt: record.createdAt.toISOString(),
            conversationCount: record.conversationCount,
        };
    }
}
