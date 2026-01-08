import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { pipe, map, catchError, of } from 'rxjs';

export interface ResModel<T> {
  isSuccess: boolean,
  data: T
}

export const resParsePipe = () => {
  return pipe(
    map((data: any) => ({ isSuccess: true, data } as ResModel<any>)),
    catchError((error: HttpErrorResponse) => of({ isSuccess: false, data: error } as ResModel<any>)),
  );
}

export const accessToken = () => {
  const access_token = localStorage.getItem('access_token');
  return new HttpHeaders().set('Authorization', `Bearer ${access_token}`);
}
