import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationPermission: NotificationPermission = 'default';

  constructor(private snackBar: MatSnackBar) {
    this.initializeNotifications();
  }

  private async initializeNotifications() {
    if ('Notification' in window) {
      // Check if we already have permission
      this.notificationPermission = Notification.permission;

      // Request permission if not granted
      if (this.notificationPermission === 'default') {
        try {
          const permission = await Notification.requestPermission();
          this.notificationPermission = permission;
        } catch (error) {
          console.warn('Failed to request notification permission:', error);
        }
      }
    }
  }

  async notify(message: string, options: {
    title?: string;
    sound?: boolean;
    desktop?: boolean;
  } = {}) {
    // Always show snackbar
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      horizontalPosition: 'end',
      verticalPosition: 'top'
    });

    // Show desktop notification if enabled
    if (options.desktop !== false && this.notificationPermission === 'granted') {
      try {
        const notification = new Notification(options.title || 'StudyFlow', {
          body: message,
          icon: '/assets/icons/notification-icon.png'
        });

        // Auto close after 5 seconds
        setTimeout(() => notification.close(), 5000);
      } catch (error) {
        console.warn('Failed to show desktop notification:', error);
      }
    }

    // Play sound if enabled
    if (options.sound !== false) {
      this.playNotificationSound();
    }
  }

  private playNotificationSound(): void {
    try {
      const audio = new Audio('/assets/sounds/notification.mp3');
      audio.volume = 0.5; // Set volume to 50%
      audio.play().catch(error => {
        console.warn('Failed to play notification sound:', error);
      });
    } catch (error) {
      console.warn('Failed to create audio object:', error);
    }
  }
}