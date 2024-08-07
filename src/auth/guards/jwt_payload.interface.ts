import { User } from "../entities/user.entity"

export interface JwtPayload {
    sub: User
    refreshToken: string
}