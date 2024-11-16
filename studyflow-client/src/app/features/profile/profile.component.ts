import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ProfileService, UserProfile } from '../../auth/services/profile.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatChipsModule,
    MatIconModule,
    MatTabsModule,
    MatDividerModule,
    MatSnackBarModule
  ],
  template: `
    <div class="profile-container">
      <mat-card class="profile-card">
        <mat-card-header>
          <mat-card-title>Profile Settings</mat-card-title>
        </mat-card-header>

        <mat-card-content>
          <mat-tab-group>
            <!-- Personal Information Tab -->
            <mat-tab label="Personal Information">
              <form [formGroup]="profileForm" (ngSubmit)="onSubmit()" class="profile-form">
                <!-- Avatar Upload -->
                <div class="avatar-section">
                  <div class="avatar-container" [style.backgroundImage]="'url(' + (profile?.avatar || '/assets/default-avatar.png') + ')'">
                    <button mat-mini-fab color="primary" class="upload-button" (click)="triggerFileInput()">
                      <mat-icon>edit</mat-icon>
                    </button>
                    <input 
                      type="file" 
                      #fileInput 
                      hidden 
                      accept="image/*"
                      (change)="onFileSelected($event)">
                  </div>
                </div>

                <!-- Profile Fields -->
                <div class="form-grid">
                  <mat-form-field appearance="outline">
                    <mat-label>First Name</mat-label>
                    <input matInput formControlName="firstName" placeholder="Enter your first name">
                    @if (profileForm.get('firstName')?.hasError('required') && 
                         profileForm.get('firstName')?.touched) {
                      <mat-error>First name is required</mat-error>
                    }
                
    
                  </mat-form-field>

                  <mat-form-field appearance="outline">
                    <mat-label>Last Name</mat-label>
                    <input matInput formControlName="lastName" placeholder="Enter your last name">
                    @if (profileForm.get('lastName')?.hasError('required') && 
                         profileForm.get('lastName')?.touched) {
                      <mat-error>Last name is required</mat-error>
                    }
                  </mat-form-field>

                  <mat-form-field appearance="outline" class="full-width">
                    <mat-label>Email</mat-label>
                    <input matInput formControlName="email" placeholder="Enter your email">
                    @if (profileForm.get('email')?.hasError('required') && 
                         profileForm.get('email')?.touched) {
                      <mat-error>Email is required</mat-error>
                    }
                    @if (profileForm.get('email')?.hasError('email')) {
                      <mat-error>Please enter a valid email</mat-error>
                    }
                  </mat-form-field>

                  <mat-form-field appearance="outline" class="full-width">
                    <mat-label>Bio</mat-label>
                    <textarea 
                      matInput 
                      formControlName="bio" 
                      placeholder="Tell us about yourself"
                      rows="4">
                    </textarea>
                  </mat-form-field>
                </div>

                <!-- Submit Button -->
                <div class="button-container">
                  <button 
                    mat-raised-button 
                    color="primary" 
                    type="submit"
                    [disabled]="profileForm.invalid || profileForm.pristine">
                    Save Changes
                  </button>
                </div>
              </form>
            </mat-tab>

            <!-- Study Preferences Tab -->
            <mat-tab label="Study Preferences">
              <form [formGroup]="studyPreferencesForm" class="preferences-form">
                <!-- Study Duration -->
                <mat-form-field appearance="outline">
                  <mat-label>Default Study Duration (minutes)</mat-label>
                  <input 
                    matInput 
                    type="number" 
                    formControlName="defaultStudyDuration"
                    min="5" 
                    max="120">
                </mat-form-field>

                <!-- Break Duration -->
                <mat-form-field appearance="outline">
                  <mat-label>Default Break Duration (minutes)</mat-label>
                  <input 
                    matInput 
                    type="number" 
                    formControlName="defaultBreakDuration"
                    min="1" 
                    max="30">
                </mat-form-field>

                <!-- Daily Goal -->
                <mat-form-field appearance="outline">
                  <mat-label>Daily Study Goal (hours)</mat-label>
                  <input 
                    matInput 
                    type="number" 
                    formControlName="dailyGoalHours"
                    min="1" 
                    max="24">
                </mat-form-field>

                <!-- Save Button -->
                <div class="button-container">
                  <button 
                    mat-raised-button 
                    color="primary"
                    (click)="saveStudyPreferences()"
                    [disabled]="studyPreferencesForm.invalid || studyPreferencesForm.pristine">
                    Save Preferences
                  </button>
                </div>
              </form>
            </mat-tab>

            <!-- Notification Settings Tab -->
            <mat-tab label="Notifications">
              <form [formGroup]="notificationForm" class="notification-form">
                <!-- Notification checkboxes here -->
              </form>
            </mat-tab>
          </mat-tab-group>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .profile-container {
      max-width: 800px;
      margin: 2rem auto;
      padding: 0 1rem;
    }

    .profile-card {
      margin-bottom: 2rem;
    }

    .avatar-section {
      display: flex;
      justify-content: center;
      margin: 2rem 0;
    }

    .avatar-container {
      position: relative;
      width: 150px;
      height: 150px;
      border-radius: 50%;
      background-size: cover;
      background-position: center;
      background-color: #f5f5f5;

      .upload-button {
        position: absolute;
        bottom: 0;
        right: 0;
        transform: translate(25%, 25%);
      }
    }

    .form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
      margin: 1rem 0;

      .full-width {
        grid-column: 1 / -1;
      }
    }

    .button-container {
      display: flex;
      justify-content: flex-end;
      margin-top: 1rem;
    }

    mat-form-field {
      width: 100%;
    }

    .preferences-form,
    .notification-form {
      padding: 1rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    // Responsive adjustments
    @media (max-width: 600px) {
      .form-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class ProfileComponent implements OnInit {
    profileForm!: FormGroup;
    studyPreferencesForm!: FormGroup;
    notificationForm!: FormGroup;
    profile: UserProfile | null = null;
  
    constructor(
      private fb: FormBuilder,
      private profileService: ProfileService,
      private snackBar: MatSnackBar
    ) {
      this.initializeForms();
    }
  
    ngOnInit(): void {
      this.loadProfile();
    }
  
    private initializeForms(): void {
      this.profileForm = this.fb.group({
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        bio: ['']
      });
  
      this.studyPreferencesForm = this.fb.group({
        defaultStudyDuration: [25, [Validators.required, Validators.min(5), Validators.max(120)]],
        defaultBreakDuration: [5, [Validators.required, Validators.min(1), Validators.max(30)]],
        dailyGoalHours: [4, [Validators.required, Validators.min(1), Validators.max(24)]]
      });
  
      this.notificationForm = this.fb.group({
        email: [true],
        push: [true],
        studyReminders: [true],
        breakReminders: [true]
      });
    }
  
    private loadProfile(): void {
      this.profileService.getUserProfile().subscribe({
        next: (profile: UserProfile) => {
          this.profile = profile;
          this.updateFormsWithProfile(profile);
        },
        error: (error: any) => {
          this.snackBar.open('Error loading profile', 'Close', {
            duration: 3000
          });
        }
      });
    }
  
    private updateFormsWithProfile(profile: UserProfile): void {
      this.profileForm.patchValue({
        firstName: profile.firstName,
        lastName: profile.lastName,
        email: profile.email,
        bio: profile.bio
      });
  
      this.studyPreferencesForm.patchValue({
        defaultStudyDuration: profile.studyPreferences.defaultStudyDuration,
        defaultBreakDuration: profile.studyPreferences.defaultBreakDuration,
        dailyGoalHours: profile.studyPreferences.dailyGoalHours
      });
  
      this.notificationForm.patchValue(profile.notifications);
    }
  
    onSubmit(): void {
      if (this.profileForm.valid) {
        const updatedProfile = {
          ...this.profile,
          ...this.profileForm.value
        };
  
        this.profileService.updateProfile(updatedProfile).subscribe({
          next: () => {
            this.snackBar.open('Profile updated successfully', 'Close', {
              duration: 3000
            });
          },
          error: () => {
            this.snackBar.open('Error updating profile', 'Close', {
              duration: 3000
            });
          }
        });
      }
    }
  
    saveStudyPreferences(): void {
      if (this.studyPreferencesForm.valid) {
        const updatedProfile = {
          ...this.profile,
          studyPreferences: this.studyPreferencesForm.value
        };
  
        this.profileService.updateProfile(updatedProfile).subscribe({
          next: () => {
            this.snackBar.open('Study preferences updated', 'Close', {
              duration: 3000
            });
          },
          error: () => {
            this.snackBar.open('Error updating preferences', 'Close', {
              duration: 3000
            });
          }
        });
      }
    }
  
    triggerFileInput(): void {
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      fileInput?.click();
    }
  
    onFileSelected(event: Event): void {
      const element = event.target as HTMLInputElement;
      const file = element.files?.[0];
      if (file) {
        this.profileService.uploadAvatar(file).subscribe({
          next: (url: string) => {
            this.snackBar.open('Avatar updated successfully', 'Close', {
              duration: 3000
            });
          },
          error: () => {
            this.snackBar.open('Error uploading avatar', 'Close', {
              duration: 3000
            });
          }
        });
      }
    }
  }
  