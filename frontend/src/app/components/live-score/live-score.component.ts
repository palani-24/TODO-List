import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatchService } from '../../services/match.service';
import { PlayerService } from '../../services/player.service';
import { ToastService } from '../../services/toast.service';
import { Match, InningsDetail } from '../../models/match.model';
import { Player } from '../../models/player.model';

@Component({
  selector: 'app-live-score',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './live-score.component.html',
  styleUrls: ['./live-score.component.scss']
})
export class LiveScoreComponent implements OnInit {
  match: Match | null = null;
  players: Player[] = [];
  loading = true;

  // Active Players in Current Ball
  striker = '';
  nonStriker = '';
  bowler = '';

  // Ball Input State
  selectedRuns = 0;
  isExtra = false;
  extraType: 'Wide' | 'No Ball' | 'Bye' | 'Leg Bye' | 'None' = 'None';
  isWicket = false;
  wicketType: 'Bowled' | 'Caught' | 'LBW' | 'Run Out' | 'Stumped' | 'Hit Wicket' | 'None' = 'None';
  dismissedPlayer = '';
  fielder = '';

  // Wicket Modal State
  showWicketModal = false;

  // Complete Match Modal State
  showCompleteModal = false;
  manOfTheMatch = '';
  customWinMargin = '';

  // Start Toss Modal State
  showTossModal = false;
  tossWinner = '';
  tossDecision: 'Batting' | 'Bowling' = 'Batting';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private matchService: MatchService,
    private playerService: PlayerService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    const matchId = this.route.snapshot.paramMap.get('id');
    if (matchId) {
      this.loadMatch(matchId);
    }
    this.loadPlayers();
  }

  loadMatch(id: string): void {
    this.loading = true;
    this.matchService.getMatch(id).subscribe({
      next: (res) => {
        if (res.success) {
          this.match = res.data;
          this.initScorerDefaults();
        }
        this.loading = false;
      },
      error: () => {
        this.toast.show('Match not found', 'error');
        this.loading = false;
      }
    });
  }

  loadPlayers(): void {
    this.playerService.getPlayers({ isActive: true }).subscribe({
      next: (res) => {
        if (res.success) this.players = res.data;
      }
    });
  }

  initScorerDefaults(): void {
    if (!this.match) return;

    if (this.match.status === 'Upcoming') {
      this.showTossModal = true;
      this.tossWinner = 'India';
      return;
    }

    const currentInnings = this.getCurrentInnings();
    if (currentInnings && currentInnings.batsmen.length > 0) {
      const activeBatters = currentInnings.batsmen.filter(b => !b.isOut);
      if (activeBatters.length > 0) this.striker = activeBatters[0].name;
      if (activeBatters.length > 1) this.nonStriker = activeBatters[1].name;
    }
    if (currentInnings && currentInnings.bowlers.length > 0) {
      this.bowler = currentInnings.bowlers[currentInnings.bowlers.length - 1].name;
    }
  }

  getCurrentInnings(): InningsDetail | null {
    if (!this.match) return null;
    return this.match.currentInningsNum === 1 ? this.match.innings1! : this.match.innings2!;
  }

  startLiveToss(): void {
    if (!this.match || !this.match._id) return;
    this.matchService.startLiveMatch(this.match._id, {
      tossWinner: this.tossWinner,
      tossDecision: this.tossDecision,
      oversLimit: this.match.oversLimit || 20
    }).subscribe({
      next: (res) => {
        if (res.success) {
          this.match = res.data;
          this.showTossModal = false;
          this.toast.show('Match started live! Start scoring.', 'success');
        }
      }
    });
  }

  recordBall(runs: number, extraType: 'Wide' | 'No Ball' | 'Bye' | 'Leg Bye' | 'None' = 'None'): void {
    if (!this.striker || !this.bowler) {
      this.toast.show('Please select Striker and Bowler first', 'warning');
      return;
    }

    this.selectedRuns = runs;
    this.extraType = extraType;
    this.isExtra = extraType !== 'None';
    this.isWicket = false;

    this.commitBallSubmission();
  }

  openWicketModal(): void {
    if (!this.striker || !this.bowler) {
      this.toast.show('Please select Striker and Bowler first', 'warning');
      return;
    }
    this.isWicket = true;
    this.wicketType = 'Caught';
    this.dismissedPlayer = this.striker;
    this.showWicketModal = true;
  }

  confirmWicketSubmission(): void {
    this.showWicketModal = false;
    this.commitBallSubmission();
  }

  commitBallSubmission(): void {
    if (!this.match || !this.match._id) return;

    const payload = {
      runs: this.selectedRuns,
      isExtra: this.isExtra,
      extraType: this.extraType,
      isWicket: this.isWicket,
      wicketType: this.wicketType,
      dismissedPlayer: this.dismissedPlayer || this.striker,
      fielder: this.fielder,
      striker: this.striker,
      nonStriker: this.nonStriker,
      bowler: this.bowler
    };

    this.matchService.submitBall(this.match._id, payload).subscribe({
      next: (res) => {
        if (res.success) {
          this.match = res.data;
          this.toast.show(`Recorded ball!`, 'info');
          // Rotate strike on odd runs (if not extra penalty)
          if ((this.selectedRuns === 1 || this.selectedRuns === 3) && !this.isWicket) {
            this.swapStrike();
          }
          if (this.isWicket) {
            this.striker = ''; // Prompt for new batsman
          }
        }
      },
      error: (err) => {
        this.toast.show(err.error?.message || 'Failed to submit ball', 'error');
      }
    });
  }

  swapStrike(): void {
    const temp = this.striker;
    this.striker = this.nonStriker;
    this.nonStriker = temp;
  }

  endFirstInnings(): void {
    if (!this.match || !this.match._id) return;
    this.matchService.endFirstInnings(this.match._id).subscribe({
      next: (res) => {
        if (res.success) {
          this.match = res.data;
          this.striker = '';
          this.nonStriker = '';
          this.bowler = '';
          this.toast.show(`Innings 1 complete! Target set: ${this.match.target}`, 'success');
        }
      }
    });
  }

  openCompleteMatchModal(): void {
    this.showCompleteModal = true;
  }

  completeMatch(): void {
    if (!this.match || !this.match._id) return;
    this.matchService.completeLiveMatch(this.match._id, {
      result: 'Won',
      winMargin: this.customWinMargin || this.match.winMargin || 'India won the match',
      manOfTheMatch: this.manOfTheMatch
    }).subscribe({
      next: (res) => {
        if (res.success) {
          this.match = res.data;
          this.showCompleteModal = false;
          this.toast.show('Match concluded and player career stats updated!', 'success');
          this.router.navigate(['/matches']);
        }
      }
    });
  }

  get currentRunRate(): string {
    const inn = this.getCurrentInnings();
    if (!inn) return '0.00';
    const totalOvers = inn.overs + inn.balls / 6;
    if (totalOvers === 0) return '0.00';
    return (inn.runs / totalOvers).toFixed(2);
  }

  get requiredRunRate(): string {
    if (!this.match || this.match.currentInningsNum !== 2 || !this.match.target) return '0.00';
    const inn = this.match.innings2;
    if (!inn) return '0.00';
    const oversLeft = (this.match.oversLimit || 20) - (inn.overs + inn.balls / 6);
    const runsNeeded = this.match.target - inn.runs;
    if (oversLeft <= 0) return '0.00';
    return (runsNeeded / oversLeft).toFixed(2);
  }
}
