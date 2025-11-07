// src/auth/services/jwt.service.ts
import jwt from 'jsonwebtoken';
import { User } from '../../types';

export class JWTService {
  private secret: string;

  constructor() {
    this.secret = process.env.JWT_SECRET || 'kamina-super-secret-key-change-in-production';
  }

  generateAccessToken(user: User): string {
    return jwt.sign(
      {
        sub: user.id,
        walletAddress: user.walletAddress,
        type: 'access',
      },
      this.secret,
      {
        expiresIn: '15m',
        issuer: 'kamina-os',
      }
    );
  }

  generateRefreshToken(user: User): string {
    return jwt.sign(
      {
        sub: user.id,
        walletAddress: user.walletAddress,
        type: 'refresh',
      },
      this.secret,
      {
        expiresIn: '7d',
        issuer: 'kamina-os',
      }
    );
  }

  verifyToken(token: string): any {
    try {
      return jwt.verify(token, this.secret);
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }

  decodeToken(token: string): any {
    return jwt.decode(token);
  }

  refreshAccessToken(refreshToken: string): string {
    const payload = this.verifyToken(refreshToken);
    
    if (payload.type !== 'refresh') {
      throw new Error('Invalid token type');
    }

    const user: User = {
      id: payload.sub,
      walletAddress: payload.walletAddress,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return this.generateAccessToken(user);
  }
}

export const jwtService = new JWTService();
