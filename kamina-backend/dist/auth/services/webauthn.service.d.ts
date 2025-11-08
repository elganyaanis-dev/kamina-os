import { User } from '../../types';
export declare class WebAuthnService {
    private challenges;
    private authenticators;
    generateRegistrationOptions(user: User): Promise<import("@simplewebauthn/typescript-types").PublicKeyCredentialCreationOptionsJSON>;
    verifyRegistration(credential: any, user: User): Promise<{
        verified: boolean;
        registrationInfo: {
            credentialID: Buffer<ArrayBuffer>;
            credentialPublicKey: Buffer<ArrayBuffer>;
            counter: number;
            credentialDeviceType: string;
            credentialBackedUp: boolean;
            transports: string[];
        };
    }>;
    generateAuthenticationOptions(walletAddress: string): Promise<import("@simplewebauthn/typescript-types").PublicKeyCredentialRequestOptionsJSON>;
    verifyAuthentication(credential: any, walletAddress: string): Promise<{
        verified: boolean;
        authenticationInfo: {
            credentialID: any;
            newCounter: any;
        };
    }>;
}
export declare const webAuthnService: WebAuthnService;
//# sourceMappingURL=webauthn.service.d.ts.map