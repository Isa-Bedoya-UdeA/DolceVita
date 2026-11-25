import bcrypt from "bcryptjs";

/** Cost factor required by SECURITY.md (bcryptjs, minimum 10 salt rounds). */
export const PASSWORD_SALT_ROUNDS = 10;

/**
 * Pre-computed hash of a random string. Used to run a bcrypt comparison even when the
 * email does not exist, so response time does not reveal which accounts are registered.
 */
const DUMMY_HASH = "$2b$10$jkpKLNDRii6I0.caySj5L.4SZCeKVuoQbjXwXnEU0sSNN9OtKUKs.";

export class PasswordService {
    static hash(plain: string): Promise<string> {
        return bcrypt.hash(plain, PASSWORD_SALT_ROUNDS);
    }

    /** Constant-time comparison. A missing hash is still compared against a dummy value. */
    static async verify(plain: string, hash: string | null | undefined): Promise<boolean> {
        if (!hash) {
            await bcrypt.compare(plain, DUMMY_HASH);
            return false;
        }
        return bcrypt.compare(plain, hash);
    }
}
