import { User } from "../../user/entities/user.entity"


export interface TokenPayload {
    refreshToken: string
    accessToken: string
}
export interface JwtPayload {
    refreshToken: string
    id: string
    name: string
    email: string
    avatar: string
}

export interface RequestWithUser extends Request {
    user: JwtPayload
}

