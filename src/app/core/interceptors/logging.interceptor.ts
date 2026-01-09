import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
const isDev = !environment.production;

export const loggingInterceptor: HttpInterceptorFn = (req, next) => {
    if (!isDev) return next(req);

    console.log('%c[API Request]', 'color: #4CAF50; font-weight: bold;', {
        url: req.url,
        method: req.method,
        body: req.body,
        headers: req.headers
    });

    const started = Date.now();

    return next(req).pipe(
        tap({
            next: (event) => {
                // 方法 1：用 instanceof 判斷
                if (event instanceof HttpResponse) {
                    const time = Date.now() - started;
                    console.log('%c[API Response]', 'color: #2196F3; font-weight: bold;', {
                        url: req.url,
                        duration: `${time} ms`,
                        status: event.status,
                        body: event.body
                    });
                }
            },
            error: (error) => {
                const time = Date.now() - started;
                console.error('%c[API Error]', 'color: red; font-weight: bold;', {
                    url: req.url,
                    duration: `${time} ms`,
                    error
                });
            }
        })
    );
};
