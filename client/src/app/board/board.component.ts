import { Component, OnInit } from '@angular/core';
import { BoardsService } from '../shared/services/boards.service';
import { ActivatedRoute } from '@angular/router';
import e from 'express';

@Component({
  selector: 'board',
  standalone: true,
  imports: [],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss'
})
export class BoardComponent implements OnInit {
  boardId: string;

  constructor(private boardsService: BoardsService, private activeRoute: ActivatedRoute) {
    const boardId = this.activeRoute.snapshot.paramMap.get('boardId');
    if (!boardId) { throw new Error("Can't get boardId from url"); }
    this.boardId = boardId;
  }

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData(): void {
    this.boardsService.getBoard(this.boardId).subscribe(boardData => console.log('board', boardData));
  }
}
