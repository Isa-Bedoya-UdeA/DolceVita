import { IUserRepository } from "../domain/contracts/user-repository.contract";
import { Role } from "../domain/enums/role.enum";
import { PasswordService } from "../auth/password.service";
import { RegisteredUserResponseDto, registerSchema } from "../dto/auth/register.dto";
import { loginSchema } from "../dto/auth/login.dto";
import { ConflictException } from "../exceptions/conflict.exception";
import { userRepository } from "../repositories/user.repository";

export interface SessionUser {
    id: string;
    name: string;
    email: string;
    role: Role;
    image: string | null;
}

export class AuthService {
    constructor(private readonly users: IUserRepository = userRepository) {}

    /** FR-001 — Creates a USER account with a bcrypt hash; never stores the plaintext password. */
    async register(input: unknown): Promise<RegisteredUserResponseDto> {
        const { name, email, password } = registerSchema.parse(input);

        const existing = await this.users.findByEmail(email);
        if (existing) {
            throw new ConflictException("Ya existe una cuenta registrada con este correo");
        }

        const passwordHash = await PasswordService.hash(password);
        const created = await this.users.createWithPassword({ name, email, passwordHash });

        return { id: created.id, name: created.name, email: created.email, role: created.role };
    }

    /**
     * FR-002 — Used by the Auth.js credentials provider. Returns null for any invalid
     * input or credential so the UI can only show a generic "credenciales inválidas".
     */
    async verifyCredentials(input: unknown): Promise<SessionUser | null> {
        const parsed = loginSchema.safeParse(input);
        if (!parsed.success) return null;

        const user = await this.users.findByEmail(parsed.data.email);
        const valid = await PasswordService.verify(parsed.data.password, user?.passwordHash);
        if (!user || !valid) return null;

        return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            image: user.image,
        };
    }
}

export const authService = new AuthService();
