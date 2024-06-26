import { Observable, Subject, combineLatest, filter, map, takeUntil } from 'rxjs';
import { Component, HostBinding, OnDestroy } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { InlineFormComponent } from "../../../shared/components/inline-form/inline-form.component";
import { SocketEventsEnum } from '../../../shared/types/socketEvents.enum';
import { ColumnInterface } from '../../../shared/types/column.interface';
import { SocketService } from '../../../shared/services/socket.service';
import { TasksService } from '../../../shared/services/tasks.service';
import { TaskInterface } from '../../../shared/types/task.interface';
import { BoardService } from '../../services/board.service';

@Component({
  selector: 'task-modal',
  standalone: true,
  templateUrl: './task-modal.component.html',
  styleUrl: './task-modal.component.scss',
  imports: [InlineFormComponent, CommonModule, ReactiveFormsModule]
})
export class TaskModalComponent implements OnDestroy {
  @HostBinding('class') classes = 'task-modal';

  data$: Observable<{ task: TaskInterface, columns: ColumnInterface[] }>;
  unsubscribe$ = new Subject<void>();
  task$: Observable<TaskInterface>;

  columnForm = this.fb.group({
    columnId: ['']
  })

  boardId: string;
  taskId: string;

  constructor(
    private socketService: SocketService,
    private boardService: BoardService,
    private tasksService: TasksService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router
  ) {
    const taskId = this.route.snapshot.paramMap.get('taskId');
    const boardId = this.route.parent?.snapshot.paramMap.get('boardId');

    if (!boardId) {
      throw new Error("Can't get boardId from URL");
    }

    if (!taskId) {
      throw new Error("Can't get taskId from URL");
    }

    this.taskId = taskId;
    this.boardId = boardId;

    this.task$ = this.boardService.tasks$.pipe(
      map(tasks => {
        return tasks.find(task => task.id === this.taskId)
      }),
      filter(Boolean)
    );

    this.data$ = combineLatest([this.task$, this.boardService.columns$]).pipe(
      map(([task, columns]) => ({
        task,
        columns
      }))
    );

    this.task$.pipe(takeUntil(this.unsubscribe$)).subscribe(task => {
      this.columnForm.patchValue({ columnId: task.columnId })
    })

    combineLatest([this.task$, this.columnForm.get('columnId')!.valueChanges])
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(([task, columnId]) => {
        if (task.columnId !== columnId) {
          this.tasksService.updateTask(this.boardId, task.id, { columnId: columnId as string | undefined });
        }
      });

    this.socketService.listen<string>(SocketEventsEnum.tasksDeleteSuccess)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => this.goToBoard());
  }

  goToBoard(): void {
    this.router.navigate(['boards', this.boardId]);
  }

  updateTaskName(taskName: string): void {
    this.tasksService.updateTask(this.boardId, this.taskId, { title: taskName });
  }

  updateTaskDescription(taskDescription: string): void {
    this.tasksService.updateTask(this.boardId, this.taskId, { description: taskDescription });
  }

  deleteTask(): void {
    this.tasksService.deleteTask(this.boardId, this.taskId);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
