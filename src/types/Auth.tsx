export interface Authstate {
  isAuthenticated: boolean;
  accessToken: string | null;
  account: string;
}
