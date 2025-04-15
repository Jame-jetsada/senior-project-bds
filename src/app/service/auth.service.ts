import axios from 'axios';

interface AuthResponse {
    [x: string]: any;
    Token: string;
    user: {
        id: string;
        username: string;
        name: string;
    };
}

class AuthService {
    private apiUrl = process.env.NEXT_PUBLIC_API_URL;

    async login(username: string, password: string): Promise<AuthResponse> {
        const response = await axios.post<AuthResponse>(`${this.apiUrl}/project-v0/auth/login-mobile`, { username, password });
        const Token = response.data.datas.Token;
        this.setToken(Token);
        return this.getProfileByToken(Token);
    }

    logout(): void {
        this.removeToken();
    }

    async getProfileByToken(Token: string): Promise<AuthResponse> {
        try {
            const { data } = await axios.get<AuthResponse>(`${this.apiUrl}/project-v0/profile/getProfileByToken`, {
                headers: { 'X-Authorization': Token }
            });
    
            if (data?.datas) {
                const { site_id, emp_position, emp_id, firstname, lastname, site_name, phone_number } = data.datas;
                localStorage.setItem('site_id', site_id);
                localStorage.setItem('emp_position', emp_position);
                localStorage.setItem('emp_id', emp_id);
                localStorage.setItem('firstname', firstname);
                localStorage.setItem('lastname', lastname);
                localStorage.setItem('site_name', site_name);
                localStorage.setItem('phone_number', phone_number);
            }
    
            return data;
        } catch (error) {
            console.error("Error fetching profile by token", error);
            throw error;
        }
    }

    private setToken(Token: string): void {
        localStorage.setItem('authToken', Token);
    }

    private removeToken(): void {
        localStorage.removeItem('authToken');
    }

    getToken(): string | null {
        return localStorage.getItem('authToken');
    }

    isAuthenticated(): boolean {
        return !!this.getToken();
    }
}

export default new AuthService();