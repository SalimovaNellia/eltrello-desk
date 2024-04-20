import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment.development';
import { BoardInterface } from '../types/board.interface';

@Injectable({
  providedIn: 'root'
})
export class BoardsService {
  constructor(private http: HttpClient) { }

  getBoards(): Observable<BoardInterface[]> {
    const url = environment.apiUrl + '/boards';
    return this.http.get<BoardInterface[]>(url);
  }

  createBoard(title: string): Observable<BoardInterface> {
    const url = environment.apiUrl + '/boards';
    return this.http.post<BoardInterface>(url, { title });
  }

}
