import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { Task } from './task';
import { HttpClient, HttpErrorResponse, provideHttpClient, withFetch } from '@angular/common/http';
import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root'})
export class TaskService{
    private apiServerUrl: string = environment.API_BASE_URL;
    
    constructor(private http: HttpClient) {}
    
    
    public getTasks(): Observable<Task[]> {
        return this.http.get<Task[]>(`${this.apiServerUrl}/task/all`)
        .pipe(
            // timeout(1000),
            catchError(this.handleError)
            
        );
    }

    private handleError(error: HttpErrorResponse) {
        console.error('An error occurred:', error);
        return throwError(() => new Error('Error fetching tasks from server.'));
      }

    }