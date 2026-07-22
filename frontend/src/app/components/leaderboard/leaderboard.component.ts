import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeaderboardService } from '../../services/leaderboard.service';
import { ToastService } from '../../services/toast.service';
import { LeaderboardsData } from '../../models/leaderboard.model';

@Component({
  selector: 'app-leaderboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.scss']
})
export class LeaderboardComponent implements OnInit {
  leaderboardData: LeaderboardsData | null = null;
  loading = true;
  activeTab: 'orange' | 'purple' | 'sixes' = 'orange';

  constructor(
    private leaderboardService: LeaderboardService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.loadLeaderboards();
  }

  loadLeaderboards(): void {
    this.loading = true;
    this.leaderboardService.getLeaderboards().subscribe({
      next: (res) => {
        if (res.success) {
          this.leaderboardData = res.data;
        }
        this.loading = false;
      },
      error: () => {
        this.toast.show('Failed to load leaderboards', 'error');
        this.loading = false;
      }
    });
  }

  setTab(tab: 'orange' | 'purple' | 'sixes'): void {
    this.activeTab = tab;
  }
}
