import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TournamentService } from '../../services/tournament.service';
import { ToastService } from '../../services/toast.service';
import { Tournament } from '../../models/tournament.model';

@Component({
  selector: 'app-tournaments',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tournaments.component.html',
  styleUrls: ['./tournaments.component.scss']
})
export class TournamentsComponent implements OnInit {
  tournaments: Tournament[] = [];
  selectedTournament: Tournament | null = null;
  loading = true;

  // Create Modal state
  showCreateModal = false;
  tournamentForm = {
    name: '',
    format: 'T20' as const,
    venue: 'Main Stadium',
    season: '2026',
    teamsInput: 'India, Australia, England, South Africa'
  };

  constructor(
    private tournamentService: TournamentService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.loadTournaments();
  }

  loadTournaments(): void {
    this.loading = true;
    this.tournamentService.getTournaments().subscribe({
      next: (res) => {
        if (res.success) {
          this.tournaments = res.data;
          if (this.tournaments.length > 0) {
            this.selectedTournament = this.tournaments[0];
          }
        }
        this.loading = false;
      },
      error: () => {
        this.toast.show('Failed to load tournaments', 'error');
        this.loading = false;
      }
    });
  }

  selectTournament(t: Tournament): void {
    this.selectedTournament = t;
  }

  openCreateModal(): void {
    this.tournamentForm = {
      name: '',
      format: 'T20',
      venue: 'Main Stadium',
      season: '2026',
      teamsInput: 'India, Australia, England, South Africa'
    };
    this.showCreateModal = true;
  }

  saveTournament(): void {
    if (!this.tournamentForm.name) {
      this.toast.show('Tournament name is required', 'warning');
      return;
    }

    const teamList = this.tournamentForm.teamsInput
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    const payload = {
      name: this.tournamentForm.name,
      format: this.tournamentForm.format,
      venue: this.tournamentForm.venue,
      season: this.tournamentForm.season,
      teams: teamList
    };

    this.tournamentService.createTournament(payload).subscribe({
      next: (res) => {
        if (res.success) {
          this.toast.show(`Tournament ${res.data.name} created!`, 'success');
          this.showCreateModal = false;
          this.loadTournaments();
        }
      },
      error: (err) => {
        this.toast.show(err.error?.message || 'Failed to create tournament', 'error');
      }
    });
  }

  recalculateTable(): void {
    if (!this.selectedTournament || !this.selectedTournament._id) return;
    this.tournamentService.recalculatePoints(this.selectedTournament._id).subscribe({
      next: (res) => {
        if (res.success) {
          this.selectedTournament!.pointsTable = res.data;
          this.toast.show('Points table updated from match results!', 'success');
        }
      }
    });
  }
}
