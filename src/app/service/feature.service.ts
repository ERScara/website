import { Feature } from 'C:/Users/esteb/Python/SOA_Projects/website/src/app/models/feature.model'
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable, inject } from '@angular/core';

@Injectable()
export class FeatureService {
    apiURL = 'http://localhost:4200/';
    
    private readonly http = inject(HttpClient);

    getFeatures(): Observable<Feature[]> {
        return this.http.get<Feature[]>(this.apiURL);
    }

    getFeature(id: number): Observable<Feature> {
        return this.http.get<Feature>(this.apiURL + '/' + id);
    }

    sendEmail(email: string): Observable<{message: string}> {
        return this.http.post<{message: string}>(`${this.apiURL}/email`, email);
    }

    postFeature(newFeature: Feature): Observable<{message: string}> {
        return this.http.post<{message: string}>(this.apiURL, newFeature);
    }

    putFeature(updatedFeature: Feature): Observable<{message: string}> {
        return this.http.put<{message: string}>(`${this.apiURL}/${updatedFeature}`, updatedFeature);
    }

    deleteFeature(FeatureId: number): Observable<{message: string}> {
       return this.http.delete<{message: string}>(`${this.apiURL}/${FeatureId}`);
    }

}