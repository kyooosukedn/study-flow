import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { AuthService } from '../../../../auth/services/auth.service';
import { MatBadgeModule } from '@angular/material/badge';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatMenuModule,
    MatBadgeModule
  ],
  template: `
    <div class="dashboard-container">
      <mat-toolbar color="primary" class="toolbar">
        <button mat-icon-button (click)="drawer.toggle()">
          <mat-icon>menu</mat-icon>
        </button>
        <span>StudyFlow</span>
        <span class="toolbar-spacer"></span>
        <button mat-icon-button [matMenuTriggerFor]="notificationMenu">
          <mat-icon [matBadge]="3" matBadgeColor="accent">notifications</mat-icon>
        </button>
        <button mat-icon-button [matMenuTriggerFor]="profileMenu">
          <mat-icon>account_circle</mat-icon>
        </button>
      </mat-toolbar>

      <!-- Notification Menu -->
      <mat-menu #notificationMenu="matMenu">
        <div class="notification-menu">
          <button mat-menu-item>
            <mat-icon color="accent">timer</mat-icon>
            <span>Study session completed</span>
          </button>
          <button mat-menu-item>
            <mat-icon color="primary">stars</mat-icon>
            <span>New achievement unlocked</span>
          </button>
          <button mat-menu-item>
            <mat-icon color="warn">notification_important</mat-icon>
            <span>Daily goal reminder</span>
          </button>
        </div>
      </mat-menu>

      <!-- Profile Menu -->
      <mat-menu #profileMenu="matMenu">
        <button mat-menu-item>
          <mat-icon>person</mat-icon>
          <span>Profile</span>
        </button>
        <button mat-menu-item>
          <mat-icon>settings</mat-icon>
          <span>Settings</span>
        </button>
        <mat-divider></mat-divider>
        <button mat-menu-item (click)="logout()">
          <mat-icon>exit_to_app</mat-icon>
          <span>Logout</span>
        </button>
      </mat-menu>
      

      <mat-sidenav-container class="sidenav-container">
        <mat-sidenav #drawer mode="side" opened class="sidenav">
          <mat-nav-list>
            <a mat-list-item routerLink="/dashboard" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">
              <mat-icon matListItemIcon>dashboard</mat-icon>
              <span matListItemTitle>Overview</span>
            </a>
            <a mat-list-item routerLink="/dashboard/timer" routerLinkActive="active">
              <mat-icon matListItemIcon>timer</mat-icon>
              <span matListItemTitle>Study Timer</span>
            </a>
            <a mat-list-item routerLink="/dashboard/resources" routerLinkActive="active">
              <mat-icon matListItemIcon>book</mat-icon>
              <span matListItemTitle>Resources</span>
            </a>
            <a mat-list-item routerLink="/dashboard/analytics" routerLinkActive="active">
              <mat-icon matListItemIcon>analytics</mat-icon>
              <span matListItemTitle>Analytics</span>
            </a>
            <mat-divider></mat-divider>
            <a mat-list-item routerLink="/dashboard/goals" routerLinkActive="active">
              <mat-icon matListItemIcon>flag</mat-icon>
              <span matListItemTitle>Goals</span>
            </a>
            <a mat-list-item routerLink="/dashboard/calendar" routerLinkActive="active">
              <mat-icon matListItemIcon>calendar_today</mat-icon>
              <span matListItemTitle>Calendar</span>
            </a>
          </mat-nav-list>
        </mat-sidenav>

        <mat-sidenav-content class="content">
          <router-outlet></router-outlet>
        </mat-sidenav-content>
      </mat-sidenav-container>
    </div>
  `,
  styles: [`
    .dashboard-container {
      height: 100vh;
      display: flex;
      flex-direction: column;
    }

    .toolbar {
      position: relative;
      z-index: 2;
    }

    .toolbar-spacer {
      flex: 1 1 auto;
    }

    .sidenav-container {
      flex: 1;
    }

    .sidenav {
      width: 250px;
      background: #fafafa;
      border-right: 1px solid rgba(0, 0, 0, 0.12);
    }

    .content {
      padding: 24px;
      background: #f5f5f5;
    }

    .notification-menu {
      width: 280px;
    }

    mat-nav-list {
      .mat-icon {
        margin-right: 8px;
      }

      a.active {
        background: rgba(63, 81, 181, 0.1);
        color: #3f51b5;

        mat-icon {
          color: #3f51b5;
        }
      }
    }

    .mat-list-item {
      &:hover {
        background: rgba(0, 0, 0, 0.04);
      }
    }
  `]
})
export class DashboardLayoutComponent {
  constructor(private authService: AuthService) {}

  logout(): void {
    this.authService.logout();
  }
}