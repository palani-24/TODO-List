import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PlayerService } from '../../services/player.service';
import { ToastService } from '../../services/toast.service';
import { Player, PLAYER_ROLES, BATTING_STYLES, BOWLING_STYLES } from '../../models/player.model';

@Component({
  selector: 'app-squad',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './squad.component.html',
  styleUrls: ['./squad.component.scss']
})
export class SquadComponent implements OnInit {
  players: Player[] = [];
  loading = true;

  // Filters
  searchTerm = '';
  selectedRole = '';
  selectedStatus = '';

  // Options
  roleOptions = PLAYER_ROLES;
  battingStyleOptions = BATTING_STYLES;
  bowlingStyleOptions = BOWLING_STYLES;

  // Modals state
  showPlayerModal = false;
  isEditMode = false;
  selectedPlayerId: string | null = null;

  // Form Model
  playerForm: Partial<Player> = {
    name: '',
    role: 'Batsman',
    jerseyNumber: 1,
    battingStyle: 'Right-Handed',
    bowlingStyle: 'N/A',
    phone: '',
    isActive: true
  };

  // Delete Modal state
  showDeleteModal = false;
  playerToDelete: Player | null = null;

  // Summary counts
  totalCount = 0;
  activeCount = 0;
  batsmenCount = 0;
  bowlersCount = 0;

  constructor(
    private playerService: PlayerService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadPlayers();
  }

  loadPlayers(): void {
    this.loading = true;
    this.playerService.getPlayers({
      search: this.searchTerm,
      role: this.selectedRole,
      isActive: this.selectedStatus
    }).subscribe({
      next: (res) => {
        if (res.success) {
          this.players = res.data;
          this.calculateStats();
        }
        this.loading = false;
      },
      error: () => {
        this.toastService.show('Failed to load squad', 'danger');
        this.loading = false;
      }
    });
  }

  calculateStats(): void {
    this.totalCount = this.players.length;
    this.activeCount = this.players.filter(p => p.isActive).length;
    this.batsmenCount = this.players.filter(p => p.role === 'Batsman' || p.role === 'Captain').length;
    this.bowlersCount = this.players.filter(p => p.role === 'Bowler').length;
  }

  onFilterChange(): void {
    this.loadPlayers();
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.selectedRole = '';
    this.selectedStatus = '';
    this.loadPlayers();
  }

  openAddModal(): void {
    this.isEditMode = false;
    this.selectedPlayerId = null;
    this.playerForm = {
      name: '',
      role: 'Batsman',
      jerseyNumber: this.getNextJerseyNumber(),
      battingStyle: 'Right-Handed',
      bowlingStyle: 'N/A',
      phone: '',
      isActive: true
    };
    this.showPlayerModal = true;
  }

  openEditModal(player: Player): void {
    this.isEditMode = true;
    this.selectedPlayerId = player._id || null;
    this.playerForm = { ...player };
    this.showPlayerModal = true;
  }

  closePlayerModal(): void {
    this.showPlayerModal = false;
  }

  savePlayer(): void {
    if (!this.playerForm.name || !this.playerForm.jerseyNumber) {
      this.toastService.show('Please provide a name and jersey number', 'warning');
      return;
    }

    if (this.isEditMode && this.selectedPlayerId) {
      this.playerService.updatePlayer(this.selectedPlayerId, this.playerForm).subscribe({
        next: (res) => {
          if (res.success) {
            this.toastService.show(`Player ${res.data.name} updated!`, 'success');
            this.closePlayerModal();
            this.loadPlayers();
          }
        },
        error: (err) => {
          this.toastService.show(err.error?.message || 'Failed to update player', 'danger');
        }
      });
    } else {
      this.playerService.createPlayer(this.playerForm).subscribe({
        next: (res) => {
          if (res.success) {
            this.toastService.show(`Player ${res.data.name} added to squad!`, 'success');
            this.closePlayerModal();
            this.loadPlayers();
          }
        },
        error: (err) => {
          this.toastService.show(err.error?.message || 'Failed to add player', 'danger');
        }
      });
    }
  }

  togglePlayerActive(player: Player, event: Event): void {
    event.stopPropagation();
    if (!player._id) return;
    const updatedStatus = !player.isActive;
    this.playerService.updatePlayer(player._id, { isActive: updatedStatus }).subscribe({
      next: (res) => {
        if (res.success) {
          player.isActive = updatedStatus;
          this.calculateStats();
          this.toastService.show(`${player.name} marked as ${updatedStatus ? 'Active' : 'Inactive'}`, 'info');
        }
      }
    });
  }

  confirmDelete(player: Player, event: Event): void {
    event.stopPropagation();
    this.playerToDelete = player;
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.playerToDelete = null;
  }

  deletePlayer(): void {
    if (!this.playerToDelete || !this.playerToDelete._id) return;
    const name = this.playerToDelete.name;
    this.playerService.deletePlayer(this.playerToDelete._id).subscribe({
      next: (res) => {
        if (res.success) {
          this.toastService.show(`Player ${name} removed from squad`, 'success');
          this.closeDeleteModal();
          this.loadPlayers();
        }
      },
      error: () => {
        this.toastService.show('Failed to remove player', 'danger');
      }
    });
  }

  private getNextJerseyNumber(): number {
    if (this.players.length === 0) return 1;
    const jerseys = this.players.map(p => p.jerseyNumber);
    const max = Math.max(...jerseys);
    return max < 99 ? max + 1 : 1;
  }
}
