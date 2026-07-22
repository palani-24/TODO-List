import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Match, BallDetail } from '../models/match.model';
import { ApiResponse } from './task.service';
import { environment } from '../../environments/environment';

export interface MatchFilters {
  matchType?: string;
  result?: string;
  month?: number;
  year?: number;
}

@Injectable({
  providedIn: 'root'
})
export class MatchService {
  private apiUrl = `${environment.apiUrl}/matches`;

  constructor(private http: HttpClient) {}

  getMatches(filters: MatchFilters = {}): Observable<ApiResponse<Match[]>> {
    let params = new HttpParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        params = params.set(key, String(value));
      }
    });
    return this.http.get<ApiResponse<Match[]>>(this.apiUrl, { params });
  }

  getUpcomingMatches(): Observable<ApiResponse<Match[]>> {
    return this.http.get<ApiResponse<Match[]>>(`${this.apiUrl}/upcoming`);
  }

  getMatch(id: string): Observable<ApiResponse<Match>> {
    return this.http.get<ApiResponse<Match>>(`${this.apiUrl}/${id}`);
  }

  createMatch(match: Partial<Match>): Observable<ApiResponse<Match>> {
    return this.http.post<ApiResponse<Match>>(this.apiUrl, match);
  }

  updateMatch(id: string, match: Partial<Match>): Observable<ApiResponse<Match>> {
    return this.http.put<ApiResponse<Match>>(`${this.apiUrl}/${id}`, match);
  }

  deleteMatch(id: string): Observable<ApiResponse<Match>> {
    return this.http.delete<ApiResponse<Match>>(`${this.apiUrl}/${id}`);
  }

  // Live Scorer endpoints
  startLiveMatch(id: string, payload: any): Observable<ApiResponse<Match>> {
    return this.http.post<ApiResponse<Match>>(`${this.apiUrl}/${id}/start-live`, payload);
  }

  submitBall(id: string, ball: Partial<BallDetail>): Observable<ApiResponse<Match>> {
    return this.http.post<ApiResponse<Match>>(`${this.apiUrl}/${id}/ball`, ball);
  }

  endFirstInnings(id: string): Observable<ApiResponse<Match>> {
    return this.http.post<ApiResponse<Match>>(`${this.apiUrl}/${id}/end-first-innings`, {});
  }

  completeLiveMatch(id: string, payload: any): Observable<ApiResponse<Match>> {
    return this.http.post<ApiResponse<Match>>(`${this.apiUrl}/${id}/complete-live`, payload);
  }
}
