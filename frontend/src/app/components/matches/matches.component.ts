import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatchService } from '../../services/match.service';
import { ToastService } from '../../services/toast.service';
import { Match, MATCH_TYPES, MATCH_RESULTS } from '../../models/match.model';

@Component({
  selector: 'app-matches',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './matches.component.html',
  styleUrls: ['./matches.component.scss']
})
export class MatchesComponent implements OnInit {
  matches: Match[] = [];
  upcomingMatches: Match[] = [];
  loading = true;

  // Filters
  activeTab: 'all' | 'upcoming' | 'past' = 'all';
  selectedFormat = '';

  // Options
  formatOptions = MATCH_TYPES;
  resultOptions = MATCH_RESULTS;

  // Next upcoming hero match
  nextMatch: Match | null = null;

  // Modals state
  showMatchModal = false;
  isEditMode = false;
  selectedMatchId: string | null = null;

  // Form Model
  matchForm: Partial<Match> = {
    opponent: '',
    matchDate: new Date().toISOString().split('T')[0],
    venue: '',
    matchType: 'T20',
    result: 'Upcoming',
    ourScore: '',
    theirScore: '',
    notes: ''
  };

  // Delete Modal
  showDeleteModal = false;
  matchToDelete: Match | null = null;

  // Stats
  totalMatches = 0;
  winsCount = 0;
  lossesCount = 0;
  upcomingCount = 0;

  constructor(
    private matchService: MatchService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadMatches();
  }

  loadMatches(): void {
    this.loading = true;
    this.matchService.getMatches({
      matchType: this.selectedFormat
    }).subscribe({
      next: (res) => {
        if (res.success) {
          this.matches = res.data;
          this.calculateStats();
          this.findNextMatch();
        }
        this.loading = false;
      },
      error: () => {
        this.toastService.show('Failed to load match schedule', 'danger');
        this.loading = false;
      }
    });
  }

  calculateStats(): void {
    this.totalMatches = this.matches.length;
    this.winsCount = this.matches.filter(m => m.result === 'Won').length;
    this.lossesCount = this.matches.filter(m => m.result === 'Lost').length;
    this.upcomingCount = this.matches.filter(m => m.result === 'Upcoming').length;
  }

  findNextMatch(): void {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const upcoming = this.matches
      .filter(m => m.result === 'Upcoming' && new Date(m.matchDate) >= today)
      .sort((a, b) => new Date(a.matchDate).getTime() - new Date(b.matchDate).getTime());

    this.upcomingMatches = upcoming;
    this.nextMatch = upcoming.length > 0 ? upcoming[0] : null;
  }

  get filteredMatches(): Match[] {
    let result = [...this.matches];
    if (this.activeTab === 'upcoming') {
      result = result.filter(m => m.result === 'Upcoming');
    } else if (this.activeTab === 'past') {
      result = result.filter(m => m.result !== 'Upcoming');
    }
    return result;
  }

  setTab(tab: 'all' | 'upcoming' | 'past'): void {
    this.activeTab = tab;
  }

  onFormatChange(): void {
    this.loadMatches();
  }

  openAddModal(): void {
    this.isEditMode = false;
    this.selectedMatchId = null;
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    this.matchForm = {
      opponent: '',
      matchDate: tomorrow.toISOString().split('T')[0],
      venue: '',
      matchType: 'T20',
      result: 'Upcoming',
      ourScore: '',
      theirScore: '',
      notes: ''
    };
    this.showMatchModal = true;
  }

  openEditModal(match: Match): void {
    this.isEditMode = true;
    this.selectedMatchId = match._id || null;
    const dateFormatted = match.matchDate ? new Date(match.matchDate).toISOString().split('T')[0] : '';
    this.matchForm = {
      ...match,
      matchDate: dateFormatted
    };
    this.showMatchModal = true;
  }

  closeMatchModal(): void {
    this.showMatchModal = false;
  }

  saveMatch(): void {
    if (!this.matchForm.opponent || !this.matchForm.venue || !this.matchForm.matchDate) {
      this.toastService.show('Opponent, Venue, and Date are required', 'warning');
      return;
    }

    if (this.isEditMode && this.selectedMatchId) {
      this.matchService.updateMatch(this.selectedMatchId, this.matchForm).subscribe({
        next: (res) => {
          if (res.success) {
            this.toastService.show(`Match vs ${res.data.opponent} updated!`, 'success');
            this.closeMatchModal();
            this.loadMatches();
          }
        },
        error: (err) => {
          this.toastService.show(err.error?.message || 'Failed to update match', 'danger');
        }
      });
    } else {
      this.matchService.createMatch(this.matchForm).subscribe({
        next: (res) => {
          if (res.success) {
            this.toastService.show(`Match scheduled vs ${res.data.opponent}!`, 'success');
            this.closeMatchModal();
            this.loadMatches();
          }
        },
        error: (err) => {
          this.toastService.show(err.error?.message || 'Failed to schedule match', 'danger');
        }
      });
    }
  }

  confirmDelete(match: Match, event: Event): void {
    event.stopPropagation();
    this.matchToDelete = match;
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.matchToDelete = null;
  }

  deleteMatch(): void {
    if (!this.matchToDelete || !this.matchToDelete._id) return;
    const opponent = this.matchToDelete.opponent;
    this.matchService.deleteMatch(this.matchToDelete._id).subscribe({
      next: (res) => {
        if (res.success) {
          this.toastService.show(`Match vs ${opponent} deleted`, 'success');
          this.closeDeleteModal();
          this.loadMatches();
        }
      },
      error: () => {
        this.toastService.show('Failed to delete match', 'danger');
      }
    });
  }

  getDaysRemaining(matchDateStr: string): number {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const mDate = new Date(matchDateStr);
    mDate.setHours(0, 0, 0, 0);
    const diffTime = mDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
}
