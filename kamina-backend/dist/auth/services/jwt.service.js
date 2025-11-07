"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtService = exports.JWTService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class JWTService {
    secret;
    constructor() {
        this.secret = process.env.JWT_SECRET || 'kamina-super-secret-key-change-in-production';
    }
    generateAccessToken(user) {
        return jsonwebtoken_1.default.sign({
            sub: user.id,
            walletAddress: user.walletAddress,
            type: 'access',
        }, this.secret, {
            expiresIn: '15m',
            issuer: 'kamina-os',
        });
    }
    generateRefreshToken(user) {
        return jsonwebtoken_1.default.sign({
            sub: user.id,
            walletAddress: user.walletAddress,
            type: 'refresh',
        }, this.secret, {
            expiresIn: '7d',
            issuer: 'kamina-os',
        });
    }
    verifyToken(token) {
        try {
            return jsonwebtoken_1.default.verify(token, this.secret);
        }
        catch (error) {
            throw new Error('Invalid or expired token');
        }
    }
    decodeToken(token) {
        return jsonwebtoken_1.default.decode(token);
    }
    refreshAccessToken(refreshToken) {
        const payload = this.verifyToken(refreshToken);
        if (payload.type !== 'refresh') {
            throw new Error('Invalid token type');
        }
        const user = {
            id: payload.sub,
            walletAddress: payload.walletAddress,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        return this.generateAccessToken(user);
    }
}
exports.JWTService = JWTService;
exports.jwtService = new JWTService();
//# sourceMappingURL=jwt.service.js.map