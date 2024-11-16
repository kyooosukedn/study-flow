import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { SettingsService, UserSettings } from '../auth/services/settings.services';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatButtonModule,
    MatDividerModule,
    MatSnackBarModule
  ],
  template: `
    <div class="settings-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Application Settings</mat-card-title>
        </mat-card-header>

        <mat-card-content>
          <form [formGroup]="settingsForm" class="settings-form">
            <!-- Appearance Settings -->
            <section class="settings-section">
              <h3>Appearance</h3>
              <mat-form-field appearance="outline">
                <mat-label>Theme</mat-label>
                <mat-select formControlName="theme">
                  <mat-option value="light">Light</mat-option>
                  <mat-option value="dark">Dark</mat-option>
                  <mat-option value="system">System Default</mat-option>
                </mat-select>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Language</mat-label>
                <mat-select formControlName="language">
                  <mat-option value="en">English</mat-option>
                  <mat-option value="es">Spanish</mat-option>
                  <mat-option value="fr">French</mat-option>
                </mat-select>
              </mat-form-field>
            </section>

            <mat-divider></mat-divider>

            <!-- Study Settings -->
            <section class="settings-section" formGroupName="studySettings">
              <h3>Study Timer Settings</h3>
              
              <div class="settings-grid">
                <mat-form-field appearance="outline">
                  <mat-label>Pomodoro Length (minutes)</mat-label>
                  <input matInput type="number" formControlName="pomodoroLength">
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Short Break Length (minutes)</mat-label>
                  <input matInput type="number" formControlName="shortBreakLength">
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Long Break Length (minutes)</mat-label>
                  <input matInput type="number" formControlName="longBreakLength">
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Long Break Interval</mat-label>
                  <input matInput type="number" formControlName="longBreakInterval">
                </mat-form-field>
              </div>

              <div class="toggle-options">
                <mat-slide-toggle formControlName="autoStartBreaks">
                  Auto-start breaks
                </mat-slide-toggle>

                <mat-slide-toggle formControlName="autoStartPomodoros">
                  Auto-start pomodoros
                </mat-slide-toggle>
              </div>
            </section>

            <mat-divider></mat-divider>

            <!-- Notification Settings -->
            <section class="settings-section" formGroupName="notificationPreferences">
              <h3>Notifications</h3>
              
              <div class="toggle-options">
                <mat-slide-toggle formControlName="sound">
                  Sound notifications
                </mat-slide-toggle>

                <mat-slide-toggle formControlName="desktop">
                  Desktop notifications
                </mat-slide-toggle>

                <mat-slide-toggle formControlName="studyReminders">
                  Study reminders
                </mat-slide-toggle>

                <mat-slide-toggle formControlName="breakReminders">
                  Break reminders
                </mat-slide-toggle>

                <mat-slide-toggle formControlName="achievementNotifications">
                  Achievement notifications
                </mat-slide-toggle>
              </div>
            </section>

            <mat-divider></mat-divider>

            <!-- Privacy Settings -->
            <section class="settings-section" formGroupName="privacy">
              <h3>Privacy</h3>
              
              <mat-form-field appearance="outline">
                <mat-label>Profile Visibility</mat-label>
                <mat-select formControlName="profileVisibility">
                  <mat-option value="public">Public</mat-option>
                  <mat-option value="private">Private</mat-option>
                  <mat-option value="friends">Friends Only</mat-option>
                </mat-select>
              </mat-form-field>

              <div class="toggle-options">
                <mat-slide-toggle formControlName="showOnlineStatus">
                  Show online status
                </mat-slide-toggle>

                <mat-slide-toggle formControlName="shareStudyStats">
                  Share study statistics
                </mat-slide-toggle>
              </div>
            </section>
          </form>
        </mat-card-content>

        <mat-card-actions align="end">
          <button 
            mat-button 
            color="warn" 
            (click)="resetSettings()">
            Reset to Defaults
          </button>
          <button 
            mat-raised-button 
            color="primary" 
            [disabled]="!settingsForm.dirty"
            (click)="saveSettings()">
            Save Changes
          </button>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .settings-container {
      max-width: 800px;
      margin: 2rem auto;
      padding: 0 1rem;
    }

    .settings-section {
      padding: 1.5rem 0;

      h3 {
        margin: 0 0 1rem;
        color: #333;
        font-weight: 500;
      }
    }

    .settings-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
    }

    .toggle-options {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      margin-top: 1rem;
    }

    mat-form-field {
      width: 100%;
    }

    mat-card-actions {
      padding: 1rem;
      gap: 1rem;
    }

    mat-divider {
      margin: 1rem 0;
    }
  `]
})
export class SettingsComponent implements OnInit {
    settingsForm!: FormGroup;
  
    constructor(
      private fb: FormBuilder,
      private settingsService: SettingsService,
      private snackBar: MatSnackBar
    ) {
      this.initForm();
    }
  
    ngOnInit(): void {
      this.loadSettings();
    }
  
    private initForm(): void {
      this.settingsForm = this.fb.group({
        theme: ['system'],
        language: ['en'],
        studySettings: this.fb.group({
          pomodoroLength: [25],
          shortBreakLength: [5],
          longBreakLength: [15],
          longBreakInterval: [4],
          autoStartBreaks: [true],
          autoStartPomodoros: [false]
        }),
        notificationPreferences: this.fb.group({
          sound: [true],
          desktop: [true],
          studyReminders: [true],
          breakReminders: [true],
          achievementNotifications: [true]
        }),
        privacy: this.fb.group({
          profileVisibility: ['public'],
          showOnlineStatus: [true],
          shareStudyStats: [true]
        })
      });
    }
  
    private loadSettings(): void {
      this.settingsService.getSettings().subscribe({
        next: (settings: UserSettings) => {
          this.settingsForm.patchValue(settings);
          this.settingsForm.markAsPristine();
        }
      });
    }
  
    saveSettings(): void {
      if (this.settingsForm.valid && this.settingsForm.dirty) {
        this.settingsService.updateSettings(this.settingsForm.value).subscribe({
          next: () => {
            this.snackBar.open('Settings saved successfully', 'Close', {
              duration: 3000
            });
            this.settingsForm.markAsPristine();
          },
          error: () => {
            this.snackBar.open('Error saving settings', 'Close', {
              duration: 3000
            });
          }
        });
      }
    }
  
    resetSettings(): void {
      this.settingsService.resetSettings().subscribe({
        next: (settings: UserSettings) => {
          this.settingsForm.patchValue(settings);
          this.snackBar.open('Settings reset to defaults', 'Close', {
            duration: 3000
          });
        },
        error: () => {
          this.snackBar.open('Error resetting settings', 'Close', {
            duration: 3000
          });
        }
      });
    }
  }
  