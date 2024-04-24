import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { BoardInterface } from '../../shared/types/board.interface';

@Injectable({
  providedIn: 'root'
})
export class BoardService {

  board$ = new BehaviorSubject<BoardInterface | null>(null);

  constructor() { }

  setBoard(board: BoardInterface): void {
    this.board$.next(board);
  }
}