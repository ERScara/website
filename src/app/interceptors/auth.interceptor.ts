import { HttpInterceptorFn } from '@angular/common/http'

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const token = localStorage.getItem('token');
    if (token) {
        const cloned = req.clone({
            setHeaders: {
                Authorization: `Token ${token}`
            }
        });
        return next(cloned);
    }
    return next(req);
};