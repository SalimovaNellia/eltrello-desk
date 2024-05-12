export enum SocketEventsEnum {
    boardsJoin = 'boards:join',
    boardsLeave = 'boards:leave',
    boardsUpdate = 'boards:update',
    boardsUpdateSuccess = 'boards:updateSuccess',
    boardsUpdateFailure = 'boards:updateFailure',
    boardsDelete = 'boards:delete',
    boardsDeleteSuccess = 'boards:deleteSuccess',
    boardsDeleteFailure = 'boards:deleteFailure',
    columnsCreate = 'columns:create',
    columnsCreateSuccess = 'columns:createSuccess',
    columnsCreateFailure = 'columns:createFailure',
    columnsDelete = 'columns:delete',
    columnsDeleteSuccess = 'columns:deleteSuccess',
    columnsDeleteFailure = 'columns:deleteFailure',
    tasksCreate = 'tasks:create',
    tasksCreateSuccess = 'tasks:createSuccess',
    tasksCreateFailure = 'tasks:createFailure'
}
