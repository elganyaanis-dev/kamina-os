// src/auth/services/webauthn.service.ts
import { generateAuthenticationOptions, generateRegistrationOptions } from '@simplewebauthn/server';
import { AuthChallenge, User } from '../../types';

export class WebAuthnService {
  private challenges: Map<string, AuthChallenge> = new Map();
  private authenticators: Map<string, any> = new Map();

  async generateRegistrationOptions(user: User) {
    const options = await generateRegistrationOptions({
      rpName: 'Kamina OS',
      rpID: process.env.RP_ID || 'localhost',
      userID: user.id,
      userName: user.walletAddress,
      userDisplayName: user.username || user.walletAddress,
      attestationType: 'none',
      authenticatorSelection: {
        residentKey: 'required',
        userVerification: 'preferred',
      },
    });

    // Stocker le challenge
    this.challenges.set(user.walletAddress, {
      challenge: options.challenge,
      walletAddress: user.walletAddress,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
    });

    return options;
  }

  async verifyRegistration(credential: any, user: User) {
    const storedChallenge = this.challenges.get(user.walletAddress);
    if (!storedChallenge) {
      throw new Error('Challenge not found or expired');
    }

    if (new Date() > storedChallenge.expiresAt) {
      this.challenges.delete(user.walletAddress);
      throw new Error('Challenge expired');
    }

    // Pour l'instant, on simule la vérification
    // En production, il faudra utiliser verifyRegistrationResponse
    const verification = {
      verified: true,
      registrationInfo: {
        credentialID: Buffer.from(credential.id, 'base64'),
        credentialPublicKey: Buffer.from('mock-public-key'),
        counter: 0,
        credentialDeviceType: 'singleDevice',
        credentialBackedUp: false,
        transports: ['internal'],
      },
    };

    // Stocker l'authentificateur pour plus tard
    this.authenticators.set(user.walletAddress, verification.registrationInfo);

    this.challenges.delete(user.walletAddress);
    return verification;
  }

  async generateAuthenticationOptions(walletAddress: string) {
    const options = await generateAuthenticationOptions({
      rpID: process.env.RP_ID || 'localhost',
      userVerification: 'preferred',
    });

    this.challenges.set(walletAddress, {
      challenge: options.challenge,
      walletAddress,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
    });

    return options;
  }

  async verifyAuthentication(credential: any, walletAddress: string) {
    const storedChallenge = this.challenges.get(walletAddress);
    if (!storedChallenge) {
      throw new Error('Challenge not found or expired');
    }

    if (new Date() > storedChallenge.expiresAt) {
      this.challenges.delete(walletAddress);
      throw new Error('Challenge expired');
    }

    const authenticator = this.authenticators.get(walletAddress);
    if (!authenticator) {
      throw new Error('No authenticator found for user');
    }

    // Pour l'instant, on simule la vérification
    // En production, il faudra utiliser verifyAuthenticationResponse
    const verification = {
      verified: true,
      authenticationInfo: {
        credentialID: authenticator.credentialID,
        newCounter: authenticator.counter + 1,
      },
    };

    // Mettre à jour le compteur
    authenticator.counter++;

    this.challenges.delete(walletAddress);
    return verification;
  }
}

export const webAuthnService = new WebAuthnService();
