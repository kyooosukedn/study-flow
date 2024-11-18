import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { Subject, interval } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { StudySession } from '../../../core/study-state.service';
import { TimerService } from './study-timer.service';
import { NotificationService } from '../../../core/notification.service';

@Component({
  selector: 'app-study-timer',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatFormFieldModule,
    FormsModule
  ],
  template: `
    <div class="timer-container">
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
              <mat-select [(ngModel)]="focusDuration" (selectionChange)="onDurationChange()">
                <mat-option [value]="1">1 minutes</mat-option>
                <mat-option [value]="25">25 minutes</mat-option>
                <mat-option [value]="45">45 minutes</mat-option>
                <mat-option [value]="60">60 minutes</mat-option>
              </mat-select>
            </mat-form-field>
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
                <div class="session-title">{{session.type}}</div>
                <div class="session-timestamp">
                  {{session.startTime | date:'shortTime'}}
                </div>
              </div>
              <mat-icon [class.completed]="session.completed">
                check_circle
              </mat-icon>
            </div>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .timer-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 24px;
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 24px;
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
    }

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

    .timer-controls {
      display: flex;
      gap: 16px;
      margin: 24px 0;
    }

    .sessions-card {
      .session-item {
        display: flex;
        align-items: center;
        padding: 12px;
        border-bottom: 1px solid #eee;

        .session-time {
          font-weight: 500;
          min-width: 80px;
        }

        .session-info {
          flex: 1;
          margin: 0 12px;

          .session-title {
            font-weight: 500;
          }

          .session-timestamp {
            font-size: 12px;
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
    }

    @media (max-width: 768px) {
      .timer-container {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class StudyTimerComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  focusDuration = 25;
  breakDuration = 5;
  currentTime = this.focusDuration * 60;
  isRunning = false;
  currentPhase = 'Focus Time';
  progressValue = 100;
  canReset = false;

  todaySessions: StudySession[] = [];

  constructor(
    private timerService: TimerService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    // Subscribe to timer updates
    this.timerService.timeRemaining$.subscribe(time => {
      this.currentTime = time;
      this.updateProgress();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

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
      const duration = this.currentPhase === 'Focus Time' 
        ? this.focusDuration 
        : this.breakDuration;
      
      this.timerService.startTimer(
        duration * 60,
        this.currentPhase === 'Focus Time' ? 'focus' : 'break'
      );
    } else {
      this.timerService.stopTimer();
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
    this.saveSession();

    if (this.currentPhase === 'Focus Time') {
      this.currentPhase = 'Break Time';
      this.currentTime = this.breakDuration * 60;
    } else {
      this.resetTimer();
    }
  }

  resetTimer(): void {
    this.timerService.stopTimer();
    this.isRunning = false;
    this.currentTime = this.focusDuration * 60;
    this.currentPhase = 'Focus Time';
    this.progressValue = 100;
    this.canReset = false;
  }

  onDurationChange(): void {
    if (!this.isRunning) {
      this.resetTimer();
    }
  }

  private saveSession(): void {
    const session: StudySession = {
      id: Date.now().toString(),
      startTime: new Date(Date.now() - this.focusDuration * 60000),
      endTime: new Date(),
      duration: this.focusDuration,
      type: this.currentPhase === 'Focus Time' ? 'focus' : 'break',
      completed: true
    };

    this.todaySessions = [session, ...this.todaySessions];
    // Save to localStorage for persistence
    localStorage.setItem('todaySessions', JSON.stringify(this.todaySessions));
  }

  private loadTodaySessions(): void {
    const savedSessions = localStorage.getItem('todaySessions');
    if (savedSessions) {
      this.todaySessions = JSON.parse(savedSessions);
    }
  }
}