import { ActivatedRoute, NavigationStart, Router, RouterModule } from '@angular/router';
import { Observable, Subject, combineLatest, filter, map, takeUntil } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InlineFormComponent } from "../shared/components/inline-form/inline-form.component";
import { TopBarComponent } from "../shared/components/top-bar/top-bar.component";
import { ColumnInputInterface } from '../shared/types/columnInput.interface';
import { TaskInputInterface } from '../shared/types/taskInput.interface';
import { SocketEventsEnum } from '../shared/types/socketEvents.enum';
import { ColumnsService } from '../shared/services/columns.service';
import { ColumnInterface } from '../shared/types/column.interface';
import { SocketService } from '../shared/services/socket.service';
import { BoardsService } from '../shared/services/boards.service';
import { BoardInterface } from '../shared/types/board.interface';
import { TasksService } from '../shared/services/tasks.service';
import { TaskInterface } from '../shared/types/task.interface';
import { BoardService } from './services/board.service';

@Component({
  selector: 'board',
  standalone: true,
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss',
  imports: [CommonModule, TopBarComponent, InlineFormComponent, RouterModule]
})
export class BoardComponent implements OnInit {
  boardId: string;
  board$: Observable<BoardInterface>;

  data$: Observable<{
    board: BoardInterface,
    columns: ColumnInterface[],
    tasks: TaskInterface[]
  }>;

  unsubscribe$ = new Subject<void>();

  constructor(
    private columnsService: ColumnsService,
    private socketService: SocketService,
    private boardsService: BoardsService,
    private activeRoute: ActivatedRoute,
    private boardService: BoardService,
    private tasksService: TasksService,
    private router: Router
  ) {
    const boardId = this.activeRoute.snapshot.paramMap.get('boardId');
    if (!boardId) { throw new Error("Can't get boardId from url"); }

    this.boardId = boardId;

    this.data$ = combineLatest([
      this.board$ = this.boardService.board$.pipe(filter(Boolean)),
      this.boardService.columns$,
      this.boardService.tasks$
    ]).pipe(map(([board, columns, tasks]) => ({
      board,
      columns,
      tasks
    })));
  }

  ngOnInit(): void {
    this.socketService.emit(SocketEventsEnum.boardsJoin, { boardId: this.boardId }); // emits socketio message for backend
    this.fetchData();
    this.initializeListeners();
  }

  initializeListeners(): void {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart && !event.url.includes('/boards/')) {
        this.boardService.leaveBoard(this.boardId);
      }
    });

    this.socketService
      .listen<BoardInterface>(SocketEventsEnum.boardsUpdateSuccess)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(updatedBoard => {
        this.boardService.updateBoard(updatedBoard);
      });

    this.socketService
      .listen<void>(SocketEventsEnum.boardsDeleteSuccess)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {
        this.router.navigateByUrl('/boards');
      });

    this.socketService
      .listen<ColumnInterface>(SocketEventsEnum.columnsCreateSuccess)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(column => {
        this.boardService.addColumn(column);
      });

    this.socketService
      .listen<ColumnInterface>(SocketEventsEnum.columnsUpdateSuccess)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(updatedColumn => {
        this.boardService.updateColumn(updatedColumn);
      });

    this.socketService
      .listen<string>(SocketEventsEnum.columnsDeleteSuccess)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((columnId) => {
        this.boardService.deleteColumn(columnId);
      });

    this.socketService
      .listen<TaskInterface>(SocketEventsEnum.tasksCreateSuccess)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(task => {
        this.boardService.addTask(task);
      });

    this.socketService
      .listen<TaskInterface>(SocketEventsEnum.tasksUpdateSuccess)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(updatedTask => {
        this.boardService.updateTask(updatedTask);
      });

    this.socketService
      .listen<string>(SocketEventsEnum.tasksDeleteSuccess)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((taskId) => this.boardService.deleteTask(taskId));
  }

  fetchData(): void {
    this.boardsService.getBoard(this.boardId).subscribe(boardData => this.boardService.setBoard(boardData));
    this.columnsService.getColumns(this.boardId).subscribe(columns => this.boardService.setColumns(columns));
    this.tasksService.getTasks(this.boardId).subscribe(tasks => this.boardService.setTasks(tasks));
  }

  updateBoardName(boardName: string): void {
    this.boardsService.updateBoard(this.boardId, { title: boardName });
  }

  deleteBoard(): void {
    if (confirm("Are you sure you want to delete the board?")) {
      this.boardsService.deleteBoard(this.boardId);
    }
  }

  createColumn(title: string): void {
    const columnInput: ColumnInputInterface = {
      title,
      boardId: this.boardId
    };
    this.columnsService.createColumn(columnInput);
  }

  updateColumnName(columnName: string, columnId: string): void {
    this.columnsService.updateColumn(this.boardId, columnId, { title: columnName });
  }

  deleteColumn(columnId: string): void {
    if (confirm("Are you sure you want to delete the column?")) {
      this.columnsService.deleteColumn(this.boardId, columnId);
    }
  }

  getTasksByColumn(columnId: string, tasks: TaskInterface[]): TaskInterface[] {
    return tasks.filter(task => task.columnId === columnId);
  }

  createTask(title: string, columnId: string): void {
    const taskInput: TaskInputInterface = {
      title,
      boardId: this.boardId,
      columnId
    };
    this.tasksService.createTask(taskInput);
  }

  openTask(taskId: string): void {
    this.router.navigate(['boards', this.boardId, 'tasks', taskId]);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
