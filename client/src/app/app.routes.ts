import { Routes } from '@angular/router';

import { TaskModalComponent } from './board/components/task-modal/task-modal.component';
import { RegisterComponent } from './auth/components/register/register.component';
import { LoginComponent } from './auth/components/login/login.component';
import { HomeComponent } from './home/components/home/home.component';
import { BoardsComponent } from './boards/boards/boards.component';
import { BoardComponent } from './board/board.component';
import { authGuard } from './auth/services/auth.guard';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'login', component: LoginComponent },
    { path: 'boards', component: BoardsComponent, canActivate: [authGuard] },
    {
        path: 'boards/:boardId', component: BoardComponent, canActivate: [authGuard], children: [
            {
                path: 'tasks/:taskId',
                component: TaskModalComponent
            }
        ]
    }
];
