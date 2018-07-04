export interface IJiraAuthService {
    authenticate(jiraUrl: string, username: string, password: string): Promise<string>;
}