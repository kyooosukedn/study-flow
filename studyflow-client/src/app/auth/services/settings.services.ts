import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface UserSettings {
  theme: 'light' | 'dark' | 'system';
  language: string;
  timezone: string;
  studySettings: {
    pomodoroLength: number;
    shortBreakLength: number;
    longBreakLength: number;
    longBreakInterval: number;
    autoStartBreaks: boolean;
    autoStartPomodoros: boolean;
  };
  notificationPreferences: {
    sound: boolean;
    desktop: boolean;
    studyReminders: boolean;
    breakReminders: boolean;
    achievementNotifications: boolean;
  };
  privacy: {
    profileVisibility: 'public' | 'private' | 'friends';
    showOnlineStatus: boolean;
    shareStudyStats: boolean;
  };
}

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private settingsSubject = new BehaviorSubject<UserSettings>(this.getDefaultSettings());
  public settings$ = this.settingsSubject.asObservable();

  constructor() {
    const savedSettings = localStorage.getItem('userSettings');
    if (savedSettings) {
      this.settingsSubject.next(JSON.parse(savedSettings));
    }
  }

  private getDefaultSettings(): UserSettings {
    return {
      theme: 'system',
      language: 'en',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      studySettings: {
        pomodoroLength: 25,
        shortBreakLength: 5,
        longBreakLength: 15,
        longBreakInterval: 4,
        autoStartBreaks: true,
        autoStartPomodoros: false
      },
      notificationPreferences: {
        sound: true,
        desktop: true,
        studyReminders: true,
        breakReminders: true,
        achievementNotifications: true
      },
      privacy: {
        profileVisibility: 'public',
        showOnlineStatus: true,
        shareStudyStats: true
      }
    };
  }

  getSettings(): Observable<UserSettings> {
    return this.settings$;
  }

  updateSettings(newSettings: Partial<UserSettings>): Observable<UserSettings> {
    const currentSettings = this.settingsSubject.value;
    const updatedSettings = { ...currentSettings, ...newSettings };

    return of(updatedSettings).pipe(
      tap(settings => {
        localStorage.setItem('userSettings', JSON.stringify(settings));
        this.settingsSubject.next(settings);
      })
    );
  }

  resetSettings(): Observable<UserSettings> {
    const defaultSettings = this.getDefaultSettings();
    return this.updateSettings(defaultSettings);
  }
}