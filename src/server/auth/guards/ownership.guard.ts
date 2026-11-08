import { ForbiddenException } from "../../exceptions/authorization.exception";

export class OwnershipGuard {
    static verify(resourceOwnerId: string, currentUserId: string): void {
        if (resourceOwnerId !== currentUserId) {
            throw new ForbiddenException("You are not authorized to access this resource");
        }
    }
}
