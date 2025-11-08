"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.webAuthnService = exports.WebAuthnService = void 0;
const server_1 = require("@simplewebauthn/server");
class WebAuthnService {
    challenges = new Map();
    authenticators = new Map();
    async generateRegistrationOptions(user) {
        const options = await (0, server_1.generateRegistrationOptions)({
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
        this.challenges.set(user.walletAddress, {
            challenge: options.challenge,
            walletAddress: user.walletAddress,
            expiresAt: new Date(Date.now() + 5 * 60 * 1000),
        });
        return options;
    }
    async verifyRegistration(credential, user) {
        const storedChallenge = this.challenges.get(user.walletAddress);
        if (!storedChallenge) {
            throw new Error('Challenge not found or expired');
        }
        if (new Date() > storedChallenge.expiresAt) {
            this.challenges.delete(user.walletAddress);
            throw new Error('Challenge expired');
        }
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
        this.authenticators.set(user.walletAddress, verification.registrationInfo);
        this.challenges.delete(user.walletAddress);
        return verification;
    }
    async generateAuthenticationOptions(walletAddress) {
        const options = await (0, server_1.generateAuthenticationOptions)({
            rpID: process.env.RP_ID || 'localhost',
            userVerification: 'preferred',
        });
        this.challenges.set(walletAddress, {
            challenge: options.challenge,
            walletAddress,
            expiresAt: new Date(Date.now() + 5 * 60 * 1000),
        });
        return options;
    }
    async verifyAuthentication(credential, walletAddress) {
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
        const verification = {
            verified: true,
            authenticationInfo: {
                credentialID: authenticator.credentialID,
                newCounter: authenticator.counter + 1,
            },
        };
        authenticator.counter++;
        this.challenges.delete(walletAddress);
        return verification;
    }
}
exports.WebAuthnService = WebAuthnService;
exports.webAuthnService = new WebAuthnService();
//# sourceMappingURL=webauthn.service.js.map