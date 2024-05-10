import { Socket, io } from 'socket.io-client';
import { Injectable } from '@angular/core';

import { CurrentUserInterface } from '../../auth/types/currentUser.interface';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';

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
  };

  emit(eventName: string, message: any): void {
    if (!this.socket) {
      throw new Error('Socket connection is not established');
    }
    this.socket.emit(eventName, message);
  }

  listen<T>(eventName: string): Observable<T> {
    const socket = this.socket;

    if (!socket) {
      throw new Error('Socket connection is not established');
    }
    return new Observable((subscriber) => {
      socket.on(eventName, (data) => {
        subscriber.next(data);
      });
    });
  }
}
