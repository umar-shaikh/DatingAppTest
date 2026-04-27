export interface User{
    id: number;
    username: string;
    token:string;
    photoUrl?: string;
    KnownAs?: string;
    gender?: string;
    roles: string[];
}