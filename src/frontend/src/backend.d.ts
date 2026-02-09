import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface UserProfile {
    username: string;
    fullName: string;
}
export interface CustomizationSettings {
    theme: string;
    primaryColor: string;
    logoUrl: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    cancelPremium(): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCustomizationSettings(): Promise<CustomizationSettings | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    isCallerPremium(): Promise<boolean>;
    likeTemplatePost(postId: bigint): Promise<void>;
    loginAdmin(passedLogin: string, passedPassword: string): Promise<boolean>;
    logoutAdmin(): Promise<void>;
    repostTemplate(_postId: bigint): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    saveCustomizationSettings(customizationSettings: CustomizationSettings): Promise<void>;
    setUserPremium(user: Principal): Promise<void>;
    upgradeToPremium(): Promise<void>;
}
