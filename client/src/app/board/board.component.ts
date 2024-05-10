import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { Observable, combineLatest, filter, map } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InlineFormComponent } from "../shared/components/inline-form/inline-form.component";
import { TopBarComponent } from "../shared/components/top-bar/top-bar.component";
import { ColumnInputInterface } from '../shared/types/columnInput.interface';
import { SocketEventsEnum } from '../shared/types/socketEvents.enum';
import { ColumnsService } from '../shared/services/columns.service';
import { ColumnInterface } from '../shared/types/column.interface';
import { SocketService } from '../shared/services/socket.service';
import { BoardsService } from '../shared/services/boards.service';
import { BoardInterface } from '../shared/types/board.interface';
import { BoardService } from './services/board.service';

@Component({
  selector: 'board',
  standalone: true,
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss',
  imports: [CommonModule, TopBarComponent, InlineFormComponent]
})
export class BoardComponent implements OnInit {
  boardId: string;
  board$: Observable<BoardInterface>;

  data$: Observable<{
    board: BoardInterface,
    columns: ColumnInterface[]
  }>;

  constructor(
    private columnsService: ColumnsService,
    private socketService: SocketService,
    private boardsService: BoardsService,
    private activeRoute: ActivatedRoute,
    private boardService: BoardService,
    private router: Router
  ) {
    const boardId = this.activeRoute.snapshot.paramMap.get('boardId');
    if (!boardId) { throw new Error("Can't get boardId from url"); }

    this.boardId = boardId;

    this.data$ = combineLatest([
      this.board$ = this.boardService.board$.pipe(filter(Boolean)),
      this.boardService.columns$
    ]).pipe(map(([board, columns]) => ({
      board,
      columns
    })));
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
    });

    this.socketService.listen<ColumnInterface>(SocketEventsEnum.columnsCreateSuccess)
      .subscribe(column => {
        this.boardService.addColumn(column);
      });
  }

  fetchData(): void {
    this.boardsService.getBoard(this.boardId).subscribe(boardData => this.boardService.setBoard(boardData));
    this.columnsService.getColumns(this.boardId).subscribe(columns => this.boardService.setColumns(columns));
  }

  createColumn(title: string): void {
    const columnInput: ColumnInputInterface = {
      title: title,
      boardId: this.boardId
    };

    this.columnsService.createColumn(columnInput);
  }
}
