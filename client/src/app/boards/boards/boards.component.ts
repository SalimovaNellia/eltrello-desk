import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { InlineFormComponent } from "../../shared/components/inline-form/inline-form.component";
import { TopBarComponent } from "../../shared/components/top-bar/top-bar.component";
import { BoardsService } from '../../shared/services/boards.service';
import { BoardInterface } from '../../shared/types/board.interface';

@Component({
  selector: 'boards',
  standalone: true,
  templateUrl: './boards.component.html',
  styleUrl: './boards.component.scss',
  imports: [RouterModule, CommonModule, InlineFormComponent, TopBarComponent]
})
export class BoardsComponent {
  boards: BoardInterface[] = [];

  constructor(private boardsService: BoardsService) { }

  ngOnInit(): void {
    this.boardsService.getBoards().subscribe((boards) => {
      this.boards = boards;
    });
  }

  createBoard(title: string): void {
    this.boardsService.createBoard(title).subscribe(createdBoard => {
      this.boards = [...this.boards, createdBoard];
    });
  }
}
