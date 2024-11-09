import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatProgressBarModule,
    MatDividerModule
  ],
  template: `
    <div class="overview-container">
      <h1 class="welcome-text">Welcome back, Sarah!</h1>
      
      <!-- Quick Stats -->
      <div class="stats-grid">
        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-header">
              <mat-icon color="primary">timer</mat-icon>
              <span>Today's Study Time</span>
            </div>
            <div class="stat-value">2h 30m</div>
            <mat-progress-bar mode="determinate" value="75"></mat-progress-bar>
            <div class="stat-footer">
              <span class="positive">↑ 15%</span> from yesterday
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-header">
              <mat-icon color="accent">psychology</mat-icon>
              <span>Focus Score</span>
            </div>
            <div class="stat-value">85%</div>
            <mat-progress-bar mode="determinate" value="85" color="accent"></mat-progress-bar>
            <div class="stat-footer">
              <span class="positive">↑ 5%</span> this week
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-header">
              <mat-icon color="warn">task_alt</mat-icon>
              <span>Tasks Completed</span>
            </div>
            <div class="stat-value">12/15</div>
            <mat-progress-bar mode="determinate" value="80" color="warn"></mat-progress-bar>
            <div class="stat-footer">80% completion rate</div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-header">
              <mat-icon style="color: #ff9800">local_fire_department</mat-icon>
              <span>Study Streak</span>
            </div>
            <div class="stat-value">5 days</div>
            <mat-progress-bar mode="determinate" value="100" color="accent"></mat-progress-bar>
            <div class="stat-footer positive">Personal best!</div>
          </mat-card-content>
        </mat-card>
      </div>

      <!-- Recent Activity and Schedule -->
      <div class="content-grid">
        <mat-card class="activity-card">
          <mat-card-header>
            <mat-card-title>Recent Activity</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="activity-list">
              <div class="activity-item">
                <div class="activity-icon">
                  <mat-icon color="primary">timer</mat-icon>
                </div>
                <div class="activity-content">
                  <h4>Completed Math Study Session</h4>
                  <p>2 hours ago • 45 minutes</p>
                </div>
              </div>
              <mat-divider></mat-divider>
              <div class="activity-item">
                <div class="activity-icon">
                  <mat-icon color="accent">book</mat-icon>
                </div>
                <div class="activity-content">
                  <h4>Added new study resources</h4>
                  <p>4 hours ago • Physics Notes</p>
                </div>
              </div>
              <mat-divider></mat-divider>
              <div class="activity-item">
                <div class="activity-icon">
                  <mat-icon color="warn">stars</mat-icon>
                </div>
                <div class="activity-content">
                  <h4>Achieved daily goal</h4>
                  <p>Yesterday • 4 hours studied</p>
                </div>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="schedule-card">
          <mat-card-header>
            <mat-card-title>Today's Schedule</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="schedule-list">
              <div class="schedule-item">
                <div class="time">09:00 AM</div>
                <div class="schedule-content">
                  <h4>Mathematics</h4>
                  <p>Calculus Chapter 5</p>
                </div>
                <button mat-icon-button color="primary">
                  <mat-icon>play_circle</mat-icon>
                </button>
              </div>
              <mat-divider></mat-divider>
              <div class="schedule-item">
                <div class="time">11:30 AM</div>
                <div class="schedule-content">
                  <h4>Physics</h4>
                  <p>Quantum Mechanics</p>
                </div>
                <button mat-icon-button color="primary">
                  <mat-icon>play_circle</mat-icon>
                </button>
              </div>
              <mat-divider></mat-divider>
              <div class="schedule-item">
                <div class="time">02:00 PM</div>
                <div class="schedule-content">
                  <h4>Chemistry</h4>
                  <p>Organic Reactions</p>
                </div>
                <button mat-icon-button color="primary">
                  <mat-icon>play_circle</mat-icon>
                </button>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .overview-container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 24px;
    }

    .welcome-text {
      font-size: 24px;
      font-weight: 500;
      color: #333;
      margin-bottom: 24px;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 24px;
      margin-bottom: 24px;
    }

    .stat-card {
      .stat-header {
        display: flex;
        align-items: center;
        gap: 8px;
        color: #666;
        margin-bottom: 12px;

        mat-icon {
          width: 20px;
          height: 20px;
          font-size: 20px;
        }
      }

      .stat-value {
        font-size: 28px;
        font-weight: 500;
        margin: 8px 0;
      }

      .stat-footer {
        margin-top: 12px;
        font-size: 14px;
        color: #666;

        .positive {
          color: #4caf50;
        }
      }
    }

    .content-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
      margin-top: 24px;

      @media (max-width: 1024px) {
        grid-template-columns: 1fr;
      }
    }

    .activity-card, .schedule-card {
      height: 100%;
      
      mat-card-header {
        margin-bottom: 16px;
      }
    }

    .activity-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .activity-item {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 8px 0;

      .activity-icon {
        background: rgba(0, 0, 0, 0.04);
        border-radius: 50%;
        padding: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .activity-content {
        flex: 1;

        h4 {
          margin: 0;
          font-size: 16px;
          font-weight: 500;
          color: #333;
        }

        p {
          margin: 4px 0 0;
          font-size: 14px;
          color: #666;
        }
      }
    }

    .schedule-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .schedule-item {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 8px 0;

      .time {
        min-width: 80px;
        font-weight: 500;
        color: #666;
      }

      .schedule-content {
        flex: 1;

        h4 {
          margin: 0;
          font-size: 16px;
          font-weight: 500;
          color: #333;
        }

        p {
          margin: 4px 0 0;
          font-size: 14px;
          color: #666;
        }
      }
    }

    mat-divider {
      margin: 8px 0;
    }

    .positive {
      color: #4caf50;
    }

    .negative {
      color: #f44336;
    }
  `]
})
export class OverviewComponent {}