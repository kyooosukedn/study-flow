import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { Subject, interval } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-study-timer',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSlideToggleModule,
    MatSelectModule,
    MatFormFieldModule,
    FormsModule
  ],
  template: `
    <div class="timer-container">
      <div class="timer-grid">
        <!-- Main Timer -->
        <mat-card class="timer-card">
          <mat-card-content>
            <div class="timer-display">
              <mat-progress-spinner
                [value]="progressValue"
                [mode]="isRunning ? 'determinate' : 'determinate'"
                [diameter]="300"
                [strokeWidth]="20"
                color="primary">
              </mat-progress-spinner>
              <div class="timer-value">
                <div class="time">{{minutes}}:{{seconds | number:'2.0-0'}}</div>
                <div class="phase">{{currentPhase}}</div>
              </div>
            </div>
            
            <div class="timer-controls">
              <button mat-fab color="primary" (click)="toggleTimer()">
                <mat-icon>{{isRunning ? 'pause' : 'play_arrow'}}</mat-icon>
              </button>
              <button mat-fab color="warn" (click)="resetTimer()" [disabled]="!canReset">
                <mat-icon>stop</mat-icon>
              </button>
            </div>

            <div class="timer-settings">
              <mat-form-field appearance="fill">
                <mat-label>Focus Duration</mat-label>
                <mat-select [(value)]="focusDuration" (selectionChange)="onDurationChange()">
                  <mat-option [value]="25">25 minutes</mat-option>
                  <mat-option [value]="45">45 minutes</mat-option>
                  <mat-option [value]="60">60 minutes</mat-option>
                </mat-select>
              </mat-form-field>

              <mat-slide-toggle
                color="primary"
                [(ngModel)]="autoStartBreak">
                Auto-start breaks
              </mat-slide-toggle>
            </div>
          </mat-card-content>
        </mat-card>

        <!-- Sessions Overview -->
        <mat-card class="sessions-card">
          <mat-card-header>
            <mat-card-title>Today's Sessions</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="sessions-list">
              <div class="session-item" *ngFor="let session of todaySessions">
                <div class="session-time">{{session.duration}} mins</div>
                <div class="session-info">
                  <div class="session-title">{{session.title}}</div>
                  <div class="session-timestamp">{{session.timestamp}}</div>
                </div>
                <mat-icon [class.completed]="session.completed">check_circle</mat-icon>
              </div>
            </div>
          </mat-card-content>
          <mat-card-actions>
            <button mat-button color="primary">View All Sessions</button>
          </mat-card-actions>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .timer-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 24px;
    }

    .timer-grid {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 24px;

      @media (max-width: 1024px) {
        grid-template-columns: 1fr;
      }
    }

    .timer-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 24px;
    }

    .timer-display {
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 24px 0;

      .timer-value {
        position: absolute;
        display: flex;
        flex-direction: column;
        align-items: center;
        
        .time {
          font-size: 48px;
          font-weight: 500;
        }

        .phase {
          font-size: 18px;
          color: #666;
        }
      }
    }

    .timer-controls {
      display: flex;
      gap: 16px;
      margin: 24px 0;

      button {
        transform: scale(1.2);
      }
    }

    .timer-settings {
      display: flex;
      align-items: center;
      gap: 24px;
      margin-top: 24px;
    }

    .sessions-card {
      mat-card-content {
        padding-top: 16px;
      }
    }

    .sessions-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .session-item {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 8px 0;

      .session-time {
        min-width: 70px;
        font-weight: 500;
      }

      .session-info {
        flex: 1;

        .session-title {
          font-weight: 500;
        }

        .session-timestamp {
          font-size: 14px;
          color: #666;
        }
      }

      mat-icon {
        color: #ccc;

        &.completed {
          color: #4caf50;
        }
      }
    }
  `]
})
export class StudyTimerComponent implements OnDestroy {
  private destroy$ = new Subject<void>();
  
  focusDuration = 25;
  breakDuration = 5;
  currentTime = this.focusDuration * 60;
  isRunning = false;
  currentPhase = 'Focus Time';
  autoStartBreak = true;
  progressValue = 100;
  canReset = false;

  // Mock data for sessions
  todaySessions = [
    { duration: 25, title: 'Mathematics', timestamp: '10:30 AM', completed: true },
    { duration: 45, title: 'Physics', timestamp: '12:15 PM', completed: true },
    { duration: 25, title: 'Chemistry', timestamp: '2:00 PM', completed: false }
  ];

  get minutes(): number {
    return Math.floor(this.currentTime / 60);
  }

  get seconds(): number {
    return this.currentTime % 60;
  }

  toggleTimer(): void {
    this.isRunning = !this.isRunning;
    this.canReset = true;

    if (this.isRunning) {
      this.startTimer();
    }
  }

  private startTimer(): void {
    interval(1000)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        if (this.isRunning) {
          this.currentTime--;
          this.updateProgress();

          if (this.currentTime <= 0) {
            this.handleTimerComplete();
          }
        }
      });
  }

  private updateProgress(): void {
    const totalTime = this.currentPhase === 'Focus Time' 
      ? this.focusDuration * 60 
      : this.breakDuration * 60;
    this.progressValue = (this.currentTime / totalTime) * 100;
  }

  private handleTimerComplete(): void {
    this.isRunning = false;
    if (this.currentPhase === 'Focus Time') {
      this.currentPhase = 'Break Time';
      this.currentTime = this.breakDuration * 60;
      if (this.autoStartBreak) {
        this.toggleTimer();
      }
    } else {
      this.resetTimer();
    }
  }

  resetTimer(): void {
    this.isRunning = false;
    this.currentTime = this.focusDuration * 60;
    this.currentPhase = 'Focus Time';
    this.progressValue = 100;
    this.canReset = false;
    this.destroy$.next();
  }

  onDurationChange(): void {
    if (!this.isRunning) {
      this.resetTimer();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}