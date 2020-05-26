import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { NewGameData } from '../models/new-game-data';
import { ChangeCoordinatesValueDto } from '../dto/change-coordinates-value-dto';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json; charset=UTF-8'})
};

@Injectable({
  providedIn: 'root'
})
export class GameService {

  gameId: number;

  constructor(
    private httpClient: HttpClient,
    private router: Router
  ) { }

  createNewGame(newGameData: NewGameData) {
    this.httpClient.post<any>('http://localhost:8080/api/game/create_game', newGameData, httpOptions).toPromise()
      .then(game => {
        this.gameId = game.id;
        this.router.navigate(['game', this.gameId]);
      }).catch(error => {
      return Promise.reject(error);
    });
  }

  getGamesToJoin(): Promise<any> {
    return this.httpClient.get('http://localhost:8080/api/game/list', httpOptions).toPromise()
      .then(gameList => {
        return gameList;
      }).catch(error => {
        return Promise.reject(error);
      });
  }

  joinGame(gameId: number) {
    this.httpClient.post<any>(`${'http://localhost:8080/api/game'}/${gameId}${'=join'}`, httpOptions).toPromise()
      .then(game => {
        this.gameId = game.id;
        this.router.navigate(['game', this.gameId]);
      }).catch(error => {
      this.router.navigate(['new_game']);
    });
  }

  getDataGame(gameId: number): Promise<any> {
    return this.httpClient.get(`${'http://localhost:8080/api/game'}/${gameId}`).toPromise()
      .then(game => {
        return game;
      }).catch(error => {
        return Promise.reject(error);
      });
  }

  changePlayerStatus(gameId: number, playerStatus: string) {
    return this.httpClient.post<any>(`${'http://localhost:8080/api/game'}/${gameId}${'=change_player_status'}`, playerStatus, httpOptions);
  }

  getAllCoordinates(gameId: number): Promise<any> {
    return this.httpClient.get(`${'http://localhost:8080/api/game'}/${gameId}${'=get_all_coordinates'}`).toPromise()
      .then(r => {
        return r;
      }).catch(error => {
        return Promise.reject(error);
      });
  }

  changeValueAtCoordinates(gameId: number, changeCoordinatesValueDTO: ChangeCoordinatesValueDto) {
    return this.httpClient.post<any>(`${'http://localhost:8080/api/game'}/${gameId}${'=change_value_at_coordinates'}`, changeCoordinatesValueDTO, httpOptions);
  }

  changeValueAtCoordinatesComputer(gameId: number, changeCoordinatesValueDTO: ChangeCoordinatesValueDto) {
    return this.httpClient.post<any>(`${'http://localhost:8080/api/game'}/${gameId}${'=change_value_at_coordinates_computer'}`, changeCoordinatesValueDTO, httpOptions);
  }

  getUserGameHistory(): Promise<any> {
    return this.httpClient.get('http://localhost:8080/api/game/get_user_game_history', httpOptions).toPromise()
      .then(gameHistory => {
        return gameHistory;
      }).catch(error => {
        return Promise.reject(error);
      });
  }

  getFriendsGameHistory(): Promise<any> {
    return this.httpClient.get('http://localhost:8080/api/game/get_friends_game_history', httpOptions).toPromise()
      .then(gameHistory => {
        return gameHistory;
      }).catch(error => {
        return Promise.reject(error);
      });
  }
}
