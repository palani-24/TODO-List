import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Tournament } from '../models/tournament.model';
import { ApiResponse } from './task.service';
import { environment } from '../../environments/environment';

export interface TournamentDetailResponse {
  success: boolean;
  data: {
    tournament: Tournament;
    matches: any[];
  };
}

@Injectable({
  providedIn: 'root'
})
export class TournamentService {
  private apiUrl = `${environment.apiUrl}/tournaments`;

  constructor(private http: HttpClient) {}

  getTournaments(): Observable<ApiResponse<Tournament[]>> {
    return this.http.get<ApiResponse<Tournament[]>>(this.apiUrl);
  }

  getTournament(id: string): Observable<TournamentDetailResponse> {
    return this.http.get<TournamentDetailResponse>(`${this.apiUrl}/${id}`);
  }

  createTournament(tournament: Partial<Tournament>): Observable<ApiResponse<Tournament>> {
    return this.http.post<ApiResponse<Tournament>>(this.apiUrl, tournament);
  }

  recalculatePoints(id: string): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.apiUrl}/${id}/recalculate-points`, {});
  }
}
