import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Volcano } from '../models/volcano.model';

@Injectable({
    providedIn: 'root',
})
export class VolcanoService {
    private readonly http = inject(HttpClient);
    private readonly apiUrl = 'http://127.0.0.1:8000/api/volcanes/';

    getVolcanes(): Observable<Volcano[]> {
        return this.http.get<Volcano[]>(this.apiUrl);
    }
}
