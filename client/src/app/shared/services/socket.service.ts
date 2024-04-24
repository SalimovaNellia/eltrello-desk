import { Injectable } from '@angular/core';
import { CurrentUserInterface } from '../../auth/types/currentUser.interface';
import { Socket, io } from 'socket.io-client';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  socket: Socket | undefined;
  constructor() { }

  setupSocketConnection(currentUser: CurrentUserInterface): void {
    this.socket = io(environment.socketUrl, {
      auth: { token: currentUser.token },
    })
  };

  disconnectSocketConnection(): void {
    if (!this.socket) {
      throw new Error('Socket connection is not established');
    }
    this.socket?.disconnect();
  }
}
