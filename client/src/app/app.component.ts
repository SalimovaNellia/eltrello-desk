import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { SocketService } from './shared/services/socket.service';
import { AuthService } from './auth/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {

  constructor(private authService: AuthService, private socketService: SocketService) { }

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe({
      next: (currentUser) => {
        this.socketService.setupSocketConnection(currentUser);
        this.authService.setCurrentUser(currentUser);
      },
      error: (err) => {
        console.log('Error', err.message);
        this.authService.setCurrentUser(null);
      }
    });
  }
}
