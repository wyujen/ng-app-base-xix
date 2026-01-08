// src/app/core/http/base-http.service.ts
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

export abstract class BaseHttpService {
    protected http = inject(HttpClient);

    protected baseUrl = environment.apiUrl;

    protected get<T>(url: string, params?: Record<string, any>): Observable<T> {
        return this.http.get<T>(this.baseUrl + url, {
            params: this.buildParams(params),
        });
    }

    protected post<T>(url: string, body?: unknown): Observable<T> {
        return this.http.post<T>(this.baseUrl + url, body);
    }

    protected put<T>(url: string, body?: unknown): Observable<T> {
        return this.http.put<T>(this.baseUrl + url, body);
    }

    protected del<T>(url: string): Observable<T> {
        return this.http.delete<T>(this.baseUrl + url);
    }

    private buildParams(params?: Record<string, any>): HttpParams | undefined {
        if (!params) return undefined;

        let httpParams = new HttpParams();
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                httpParams = httpParams.set(key, String(value));
            }
        });
        return httpParams;
    }

    protected handleError(error: HttpErrorResponse) {
        // 保持純粹，只轉換錯誤，不處理 UI
        return throwError(() => error);
    }
}
