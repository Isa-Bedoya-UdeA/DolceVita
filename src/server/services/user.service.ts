import { IUserRepository } from "../domain/contracts/user-repository.contract";
import { Role } from "../domain/enums/role.enum";
import { AdminUserResponseDto } from "../dto/user/user-response.dto";
import { updateRoleSchema } from "../dto/user/update-role.dto";
import { ConflictException } from "../exceptions/conflict.exception";
import { NotFoundException } from "../exceptions/not-found.exception";
import { UserMapper } from "../mappers/user.mapper";
import { userRepository } from "../repositories/user.repository";

export class UserService {
    constructor(private readonly users: IUserRepository = userRepository) {}

    /** FR-019 / API-012 */
    async listUsers(): Promise<AdminUserResponseDto[]> {
        const records = await this.users.findAllForAdmin();
        return records.map(UserMapper.toAdminResponse);
    }

    async getUser(userId: string): Promise<AdminUserResponseDto> {
        const record = await this.users.findByIdForAdmin(userId);
        if (!record) throw new NotFoundException("El usuario no existe");
        return UserMapper.toAdminResponse(record);
    }

    /**
     * FR-019 / API-013. An administrator cannot change their own role, and the
     * last administrator cannot be demoted, so the panel never ends up without an ADMIN.
     */
    async updateRole(
        actorId: string,
        userId: string,
        input: unknown,
    ): Promise<{ id: string; role: Role }> {
        const { role } = updateRoleSchema.parse(input);
        const target = await this.users.findByIdForAdmin(userId);

        if (!target) throw new NotFoundException("El usuario no existe");
        if (target.role === role) return { id: target.id, role: target.role };

        if (target.id === actorId) {
            throw new ConflictException("No puedes cambiar tu propio rol");
        }

        if (target.role === Role.ADMIN && role === Role.USER) {
            const admins = await this.users.countByRole(Role.ADMIN);
            if (admins <= 1) {
                throw new ConflictException("Debe existir al menos un administrador");
            }
        }

        return this.users.updateRole(userId, role as Role);
    }
}

export const userService = new UserService();
