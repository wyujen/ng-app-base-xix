import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class JwtService {
    decode(token: string | null): any | null {
        if (!token) return null;
        try {
            const payload = token.split('.')[1];
            const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
            const json = decodeURIComponent(
                atob(base64)
                    .split('')
                    .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                    .join('')
            );
            return JSON.parse(json);
        } catch {
            return null;
        }
    }

    isExpired(token: string | null): boolean {
        const payload = this.decode(token);
        if (!payload?.exp) return true;
        const now = Math.floor(Date.now() / 1000);
        return payload.exp < now;
    }
}
