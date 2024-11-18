import { Injectable } from '@angular/core';
import { BehaviorSubject, interval, Subscription } from 'rxjs';
import { map, takeWhile } from 'rxjs/operators';
import { NotificationService } from '../../../core/notification.service';

@Injectable({
  providedIn: 'root'
})
export class TimerService {
  private timer: BehaviorSubject<number> = new BehaviorSubject(0);
  private timerSubscription?: Subscription;
  private currentPhase: 'focus' | 'break' = 'focus';

  public readonly timeRemaining$ = this.timer.asObservable();

  constructor(private notificationService: NotificationService) {}

  startTimer(duration: number, phase: 'focus' | 'break' = 'focus'): void {
    this.stopTimer();
    this.currentPhase = phase;
    const endTime = Date.now() + duration * 1000;

    this.timerSubscription = interval(1000).pipe(
      map(() => Math.round((endTime - Date.now()) / 1000)),
      takeWhile(timeLeft => timeLeft >= 0)
    ).subscribe({
      next: (timeLeft) => {
        this.timer.next(timeLeft);
      },
      complete: () => {
        this.handleTimerComplete();
      }
    });
  }

  stopTimer(): void {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }

  private handleTimerComplete(): void {
    // Determine notification message based on phase
    const message = this.currentPhase === 'focus'
      ? 'Focus session completed! Time for a break.'
      : 'Break time is over. Ready to focus again?';

    // Show notification with all options enabled
    this.notificationService.notify(message, {
      title: 'Timer Complete',
      sound: true,
      desktop: true
    });
  }
}