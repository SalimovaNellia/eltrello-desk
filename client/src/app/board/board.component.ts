import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Observable, filter } from 'rxjs';

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

  constructor(private boardsService: BoardsService, private boardService: BoardService, private activeRoute: ActivatedRoute) {
    const boardId = this.activeRoute.snapshot.paramMap.get('boardId');
    if (!boardId) { throw new Error("Can't get boardId from url"); }
    this.boardId = boardId;
    this.board$ = this.boardService.board$.pipe(filter(Boolean));
  }

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData(): void {
    this.boardsService.getBoard(this.boardId).subscribe(boardData => this.boardService.setBoard(boardData)
    );
  }
}
