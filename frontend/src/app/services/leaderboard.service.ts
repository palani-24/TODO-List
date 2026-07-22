import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LeaderboardsData } from '../models/leaderboard.model';
import { ApiResponse } from './task.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LeaderboardService {
  private apiUrl = `${environment.apiUrl}/leaderboard`;

  constructor(private http: HttpClient) {}

  getLeaderboards(): Observable<ApiResponse<LeaderboardsData>> {
    return this.http.get<ApiResponse<LeaderboardsData>>(this.apiUrl);
  }
}
