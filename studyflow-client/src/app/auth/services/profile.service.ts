import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
  bio?: string;
  studyPreferences: {
    defaultStudyDuration: number;
    defaultBreakDuration: number;
    dailyGoalHours: number;
    preferredSubjects: string[];
  };
  notifications: {
    email: boolean;
    push: boolean;
    studyReminders: boolean;
    breakReminders: boolean;
  };
}

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private profileSubject = new BehaviorSubject<UserProfile | null>(null);
  public profile$ = this.profileSubject.asObservable();

  constructor(private http: HttpClient) {
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      this.profileSubject.next(JSON.parse(savedProfile));
    }
  }

  getUserProfile(): Observable<UserProfile> {
    const mockProfile: UserProfile = {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      bio: 'Computer Science student',
      studyPreferences: {
        defaultStudyDuration: 25,
        defaultBreakDuration: 5,
        dailyGoalHours: 4,
        preferredSubjects: ['Mathematics', 'Programming']
      },
      notifications: {
        email: true,
        push: true,
        studyReminders: true,
        breakReminders: true
      }
    };

    return of(mockProfile).pipe(
      tap(profile => {
        localStorage.setItem('userProfile', JSON.stringify(profile));
        this.profileSubject.next(profile);
      })
    );
  }

  updateProfile(data: Partial<UserProfile>): Observable<UserProfile> {
    const currentProfile = this.profileSubject.value;
    const updatedProfile = { ...currentProfile, ...data } as UserProfile;

    return of(updatedProfile).pipe(
      tap(profile => {
        localStorage.setItem('userProfile', JSON.stringify(profile));
        this.profileSubject.next(profile);
      })
    );
  }

  uploadAvatar(file: File): Observable<string> {
    const mockUrl = 'https://example.com/avatar.jpg';
    return of(mockUrl);
  }
}