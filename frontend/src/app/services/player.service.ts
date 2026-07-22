import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Player, PlayerStats } from '../models/player.model';
import { ApiResponse } from './task.service';
import { environment } from '../../environments/environment';

export interface PlayerFilters {
  search?: string;
  role?: string;
  isActive?: boolean | string;
}

@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  private apiUrl = `${environment.apiUrl}/players`;

  constructor(private http: HttpClient) {}

  getPlayers(filters: PlayerFilters = {}): Observable<ApiResponse<Player[]>> {
    let params = new HttpParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        params = params.set(key, String(value));
      }
    });
    return this.http.get<ApiResponse<Player[]>>(this.apiUrl, { params });
  }

  getPlayer(id: string): Observable<ApiResponse<Player>> {
    return this.http.get<ApiResponse<Player>>(`${this.apiUrl}/${id}`);
  }

  createPlayer(player: Partial<Player>): Observable<ApiResponse<Player>> {
    return this.http.post<ApiResponse<Player>>(this.apiUrl, player);
  }

  updatePlayer(id: string, player: Partial<Player>): Observable<ApiResponse<Player>> {
    return this.http.put<ApiResponse<Player>>(`${this.apiUrl}/${id}`, player);
  }

  deletePlayer(id: string): Observable<ApiResponse<Player>> {
    return this.http.delete<ApiResponse<Player>>(`${this.apiUrl}/${id}`);
  }

  getPlayerStats(): Observable<ApiResponse<PlayerStats>> {
    return this.http.get<ApiResponse<PlayerStats>>(`${this.apiUrl}/stats/summary`);
  }
}
