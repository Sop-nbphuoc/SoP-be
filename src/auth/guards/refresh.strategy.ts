import { Strategy, ExtractJwt } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { JwtPayload } from './jwt_payload.interface';
import { cookieExtractorRefresh } from './cookieExtractor';


@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
    constructor() {
        super({
            jwtFromRequest: cookieExtractorRefresh,
            secretOrKey: process.env.JWT_REFRESH_SECRET,
            passReqToCallback: true
        })
    }

    validate(req: Request, payload: JwtPayload) {
        // const refreshToken = req.get('Authorization').replace('Bearer', '').trim()
        return { ...payload, refreshToken: req.cookies['refreshToken'] }
    }
}