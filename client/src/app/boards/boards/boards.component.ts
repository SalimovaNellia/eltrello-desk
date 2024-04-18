import { Component } from '@angular/core';

import { BoardsService } from '../../shared/services/boards.service';

@Component({
  selector: 'boards',
  standalone: true,
  imports: [],
  templateUrl: './boards.component.html',
  styleUrl: './boards.component.scss'
})
export class BoardsComponent {

  constructor(private boardsService: BoardsService) { }

  ngOnInit(): void {
    this.boardsService.getBoards().subscribe((boards) => {
      console.log('boards', boards);
    })
  }
}
