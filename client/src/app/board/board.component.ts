import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, filter } from 'rxjs';

import { SocketEventsEnum } from '../shared/types/socketEvents.enum';
import { SocketService } from '../shared/services/socket.service';
import { BoardsService } from '../shared/services/boards.service';
import { BoardInterface } from '../shared/types/board.interface';
import { BoardService } from './services/board.service';

@Component({
  selector: 'board',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss'
})
export class BoardComponent implements OnInit {
  boardId: string;
  board$: Observable<BoardInterface>;

  constructor(
    private socketService: SocketService,
    private boardsService: BoardsService,
    private activeRoute: ActivatedRoute,
    private boardService: BoardService,
    private router: Router
  ) {
    const boardId = this.activeRoute.snapshot.paramMap.get('boardId');
    if (!boardId) { throw new Error("Can't get boardId from url"); }
    this.boardId = boardId;
    this.board$ = this.boardService.board$.pipe(filter(Boolean));
  }

  ngOnInit(): void {
    this.socketService.emit(SocketEventsEnum.boardsJoin, { boardId: this.boardId }); // emits socketio message for backend
    this.fetchData();
    this.initializeListeners();
  }

  initializeListeners(): void {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.boardService.leaveBoard(this.boardId);
      }
    })
  }

  fetchData(): void {
    this.boardsService.getBoard(this.boardId).subscribe(boardData => this.boardService.setBoard(boardData)
    );
  }
}
