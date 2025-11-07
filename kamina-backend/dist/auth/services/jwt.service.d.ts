import { User } from '../../types';
export declare class JWTService {
    private secret;
    constructor();
    generateAccessToken(user: User): string;
    generateRefreshToken(user: User): string;
    verifyToken(token: string): any;
    decodeToken(token: string): any;
    refreshAccessToken(refreshToken: string): string;
}
export declare const jwtService: JWTService;
//# sourceMappingURL=jwt.service.d.ts.map