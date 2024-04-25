import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { SocketEventsEnum } from '../../shared/types/socketEvents.enum';
import { SocketService } from '../../shared/services/socket.service';
import { BoardInterface } from '../../shared/types/board.interface';

@Injectable({
  providedIn: 'root'
})
export class BoardService {

  board$ = new BehaviorSubject<BoardInterface | null>(null);

  constructor(private socketService: SocketService) { }

  setBoard(board: BoardInterface): void {
    this.board$.next(board);
  }

  leaveBoard(boardId: string): void {
    this.board$.next(null);
    this.socketService.emit(SocketEventsEnum.boardsLeave, { boardId: boardId });
  }
}
