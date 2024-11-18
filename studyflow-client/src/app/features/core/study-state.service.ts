    // src/app/core/services/study-state.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface StudySession {
  id: string;
  startTime: Date;
  endTime?: Date;
  duration: number;
  type: 'focus' | 'break';
  completed: boolean;
}

export interface StudyState {
  activeSessions: StudySession[];
  completedSessions: StudySession[];
  dailyStats: {
    totalStudyTime: number;
    sessionsCompleted: number;
  };
}

const initialState: StudyState = {
  activeSessions: [],
  completedSessions: [],
  dailyStats: {
    totalStudyTime: 0,
    sessionsCompleted: 0
  }
};

@Injectable({ providedIn: 'root' })
export class StudyStateService {
  private state = new BehaviorSubject<StudyState>(this.loadState());
  
  state$ = this.state.asObservable();
  completedSessions$ = this.state$.pipe(
    map(state => state.completedSessions)
  );
  dailyStats$ = this.state$.pipe(
    map(state => state.dailyStats)
  );

  constructor() {
    // Load saved state from localStorage on initialization
    this.loadState();
  }

  private loadState(): StudyState {
    const savedState = localStorage.getItem('studyState');
    if (savedState) {
      const parsedState = JSON.parse(savedState);
      return {
        ...parsedState,
        completedSessions: parsedState.completedSessions.map((session: any) => ({
          ...session,
          startTime: new Date(session.startTime),
          endTime: session.endTime ? new Date(session.endTime) : undefined
        }))
      };
    }
    return initialState;
  }

  private saveState(state: StudyState): void {
    localStorage.setItem('studyState', JSON.stringify(state));
  }

  addCompletedSession(session: StudySession): void {
    const currentState = this.state.value;
    const newState = {
      ...currentState,
      completedSessions: [session, ...currentState.completedSessions],
      dailyStats: {
        totalStudyTime: currentState.dailyStats.totalStudyTime + session.duration,
        sessionsCompleted: currentState.dailyStats.sessionsCompleted + 1
      }
    };
    
    this.state.next(newState);
    this.saveState(newState);
  }

  getTodaySessions(): StudySession[] {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return this.state.value.completedSessions.filter(session => {
      const sessionDate = new Date(session.startTime);
      sessionDate.setHours(0, 0, 0, 0);
      return sessionDate.getTime() === today.getTime();
    });
  }

  clearCompletedSessions(): void {
    const newState = {
      ...this.state.value,
      completedSessions: [],
      dailyStats: {
        totalStudyTime: 0,
        sessionsCompleted: 0
      }
    };
    
    this.state.next(newState);
    this.saveState(newState);
  }
}