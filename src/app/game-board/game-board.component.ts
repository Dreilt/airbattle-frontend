import { Component, OnInit } from '@angular/core';
import { Game } from '../models/game';
import { GameService } from '../services/game.service';
import { User } from '../models/user';
import { ActivatedRoute } from '@angular/router';
import { TokenStorageService } from '../services/token-storage.service';
import { CoordinatesDto } from '../dto/coordinates-dto';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ChangeCoordinatesValueDto } from '../dto/change-coordinates-value-dto';
import { UserService } from '../services/user.service';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json; charset=UTF-8'})
};

@Component({
  selector: 'app-game-board',
  templateUrl: './game-board.component.html',
  styleUrls: ['./game-board.component.scss']
})
export class GameBoardComponent implements OnInit {

  public gameStatusMessage: string;
  public firstPlayerBoard: string[][];
  public secondPlayerBoard: string[][];

  userLogged: User;
  isFriend = 1;

  gameId: number;
  game: Game;

  allCoordinates: CoordinatesDto[];

  coordinatesForComputer = [];
  coordinates: CoordinatesDto;
  isHitPlane = false;
  targetMissed = 0;
  TroopCarrierPlaneFP = 0;
  isTroopCarrierPlaneFP = true;
  TroopCarrierPlaneSP = 0;
  isTroopCarrierPlaneSP = true;
  BomberPlaneFP = 0;
  isBomberPlaneFP = true;
  BomberPlaneSP = 0;
  isBomberPlaneSP = true;
  FighterPlaneFP = 0;
  isFighterPlaneFP = true;
  FighterPlaneSP = 0;
  isFighterPlaneSP = true;
  HelicopterFP = 0;
  isHelicopterFP = true;
  HelicopterSP = 0;
  isHelicopterSP = true;
  ReconnaissanceAircraftFP = 0;
  isReconnaissanceAircraftFP = true;
  ReconnaissanceAircraftSP = 0;
  isReconnaissanceAircraftSP = true;

  constructor(
    private activatedRoute: ActivatedRoute,
    private tokenStorageService: TokenStorageService,
    private gameService: GameService,
    private httpClient: HttpClient,
    private userService: UserService
  ) {
    setInterval(() => {
      this.gameService.getDataGame(this.gameId).then(
        r => {
          this.game = r;
        }
      ).catch(e => {
        console.log('Nie pobrano danych gry.');
      });

      if (this.game.gameStatus === 'IN_PROGRESS') {
        this.getAllCoordinates();
      }

      if (this.game.enemy === 'P') {
        if (this.game.gameStatus === 'DRAW_COORDINATES' && this.game.secondPlayer !== null) {
          this.gameStatusMessage = `Losowanie współrzędnych samolotów`;
          this.userService.checkIfFriends(this.game.id).then(
            r => {
              this.isFriend = r;
            }
          ).catch(e => {
            console.log('Nie pobrano informacji o relacji graczy.');
          });
        }

        if (this.game.gameStatus === 'IN_PROGRESS') {
          this.getAllCoordinates();
          this.gameStatusMessage = `Ruch gracza ${this.game.currentPlayer.userName}`;
        }
      }

      if (this.game.gameStatus === 'GAME_FINISHED') {
        if (this.game.currentPlayer !== null) {
          this.gameStatusMessage = `Wygrywa gracz ${this.game.currentPlayer.userName}!`;
        } else {
          this.gameStatusMessage = `Wygrywa gracz Komputer!`;
        }
      }
    }, 1000);
  }

  ngOnInit(): void {
    this.firstPlayerBoard = [];
    this.secondPlayerBoard = [];
    for (let row = 0; row < 10; row++) {
      this.firstPlayerBoard[row] = [];
      this.secondPlayerBoard[row] = [];
      for (let column = 0; column < 10; column++) {
        this.firstPlayerBoard[row][column] = '';
        this.secondPlayerBoard[row][column] = '';
      }
    }

    this.userLogged = this.tokenStorageService.getUser();

    this.newGame();
  }

  newGame() {
    this.gameId = this.activatedRoute.snapshot.params.id;
    this.gameService.getDataGame(this.gameId).then(
      r => {
        this.game = r;

        this.gameStatusMessage = 'Oczekiwanie na drugiego gracza';

        if (this.game.enemy === 'C') {
          if (this.game.gameStatus === 'DRAW_COORDINATES') {
            this.drawCoordinatesPlanesComputer();
            this.gameStatusMessage = `Losowanie współrzędnych samolotów`;
          }
        }
      }
    ).catch(e => {
      alert('Nie pobrano danych gry.');
    });
  }

  // Funkcje do losowania położenia samolotów
  async drawCoordinatesPlanesComputer() {

    // Transportowiec
    await this.drawCoordinatesTroopCarrierPlane(this.secondPlayerBoard);

    // Bombowiec
    await this.drawCoordinatesBomberPlane(this.secondPlayerBoard);

    // Myśliwiec
    this.drawCoordinatesFighterPlane(this.secondPlayerBoard);

    // Helikopter
    await this.drawCoordinatesHelicopter(this.secondPlayerBoard);

    // Samolot rozpoznawczy
    await this.drawCoordinatesReconnaissanceAircraft(this.secondPlayerBoard);

    let coordinatesDtoList = [];
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        if (this.secondPlayerBoard[i][j] !== '') {
          let coordinatesDto: CoordinatesDto = new CoordinatesDto();
          coordinatesDto.setRowNumber(i);
          coordinatesDto.setColumnNumber(j);
          coordinatesDto.setCoordinatesValue(this.secondPlayerBoard[i][j]);
          coordinatesDtoList.push(coordinatesDto);
        }
      }
    }

    if (coordinatesDtoList.length === 20) {
      this.httpClient.post(`${'http://localhost:8080/api/game'}/${this.game.id}${'=play_game_computer'}`, coordinatesDtoList, httpOptions).subscribe();
    } else {
      await this.drawCoordinatesPlanesComputer();
    }
  }

  async drawCoordinatesPlanes(board: string[][]) {
    await this.createNewBoard(board);

    // Transportowiec
    await this.drawCoordinatesTroopCarrierPlane(board);

    // Bombowiec
    await this.drawCoordinatesBomberPlane(board);

    // Myśliwiec
    await this.drawCoordinatesFighterPlane(board);

    // Helikopter
    this.drawCoordinatesHelicopter(board);

    // Samolot rozpoznawczy
    await this.drawCoordinatesReconnaissanceAircraft(board);

    let coordinatesDtoList = [];
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        if (board[i][j] !== '') {
          let coordinatesDto: CoordinatesDto = new CoordinatesDto();
          coordinatesDto.setRowNumber(i);
          coordinatesDto.setColumnNumber(j);
          coordinatesDto.setCoordinatesValue(board[i][j]);
          coordinatesDtoList.push(coordinatesDto);
        }
      }
    }

    if (coordinatesDtoList.length !== 20) {
      await this.drawCoordinatesPlanes(board);
    } else {
      await this.changePlayerStatus('SC');
    }
  }

  async createNewBoard(board: string[][]) {
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        board[i][j] = '';
      }
    }
  }

  async drawCoordinatesTroopCarrierPlane(board: string[][]) {
    let row: number;
    let column: number;
    let availableCoordinates = [];
    let optionNumber: number;
    let optionIndex: number;

    row = Math.floor(Math.random() * 6) + 2;
    column = Math.floor(Math.random() * 6) + 2;

    if (row > 1 && row < 8) {
      if (column > 1 && column < 8) {
        // przód
        board[row + 1][column] = 'T';
        // środek
        board[row][column] = 'T';
        // tył
        board[row - 1][column] = 'T';
        // skrzydło prawe
        board[row][column + 1] = 'T';
        // skrzydło lewe
        board[row][column - 1] = 'T';

        if (board[row + 2][column] === '') {
          availableCoordinates.push(1);
        }
        if (board[row - 2][column] === '') {
          availableCoordinates.push(2);
        }
        if (board[row][column + 2] === '') {
          availableCoordinates.push(3);
        }
        if (board[row][column - 2] === '') {
          availableCoordinates.push(4);
        }

        if (availableCoordinates.length > 0) {
          optionIndex = Math.floor(Math.random() * availableCoordinates.length);
          optionNumber = availableCoordinates[optionIndex];

          switch (optionNumber) {
            case 1:
              board[row + 2][column] = 'T';
              break;
            case 2:
              board[row - 2][column] = 'T';
              break;
            case 3:
              board[row][column + 2] = 'T';
              break;
            case 4:
              board[row][column - 2] = 'T';
              break;
          }
        } else {
          this.drawCoordinatesTroopCarrierPlane(board);
        }
      } else {
        this.drawCoordinatesTroopCarrierPlane(board);
      }
    } else {
      this.drawCoordinatesTroopCarrierPlane(board);
    }
  }

  async drawCoordinatesBomberPlane(board: string[][]) {
    let row: number;
    let column: number;

    row = Math.floor(Math.random() * 10);
    column = Math.floor(Math.random() * 10);

    if (row !== 0 && row !== 9) {
      if (column !== 0 && column !== 9) {

        if (board[row][column] !== 'T') {
          if (
            board[row + 1][column] !== 'B' &&
            board[row - 1][column] !== 'B' &&
            board[row][column + 1] !== 'B' &&
            board[row][column - 1] !== 'B'
          ) {
            // przód
            board[row + 1][column] = 'B';
            // środek
            board[row][column] = 'B';
            // tył
            board[row - 1][column] = 'B';
            // skrzydło prawe
            board[row][column + 1] = 'B';
            // skrzydło lewe
            board[row][column - 1] = 'B';
          } else {
            this.drawCoordinatesBomberPlane(board);
          }
        } else {
          this.drawCoordinatesBomberPlane(board);
        }
      } else {
        this.drawCoordinatesBomberPlane(board);
      }
    } else {
      this.drawCoordinatesBomberPlane(board);
    }
  }

  drawCoordinatesFighterPlane(board: string[][]) {
    let row: number;
    let column: number;
    let availableCoordinates = [];
    let availableCoordinates2 = [];
    let optionNumber: number;
    let optionIndex: number;

    row = Math.floor(Math.random() * 10);
    column = Math.floor(Math.random() * 10);

    if (row !== 0 && row !== 9) {
      if (column !== 0 && column !== 9) {
        if (board[row][column] === '') {

          if (board[row + 1][column] === '' && board[row - 1][column] === '') {
            availableCoordinates.push(1);
          }
          if (board[row][column + 1] === '' && board[row][column - 1] === '') {
            availableCoordinates.push(2);
          }

          if (availableCoordinates.length > 0) {
            optionIndex = Math.floor(Math.random() * availableCoordinates.length);
            optionNumber = availableCoordinates[optionIndex];

            switch (optionNumber) {
              case 1:
                board[row][column] = 'M';
                board[row + 1][column] = 'M';
                board[row - 1][column] = 'M';

                if (board[row][column + 1] === '') {
                  availableCoordinates2.push(1);
                } else if (board[row][column - 1] === '') {
                  availableCoordinates2.push(2);
                }

                if (availableCoordinates2.length > 0) {
                  optionIndex = Math.floor(Math.random() * availableCoordinates2.length);
                  optionNumber = availableCoordinates2[optionIndex];

                  switch (optionNumber) {
                    case 1:
                      board[row][column + 1] = 'M';
                      break;
                    case 2:
                      board[row][column - 1] = 'M';
                      break;
                  }
                } else {
                  this.drawCoordinatesFighterPlane(board);
                }

                break;
              case 2:
                board[row][column] = 'M';
                board[row][column + 1] = 'M';
                board[row][column - 1] = 'M';

                if (board[row + 1][column] === '') {
                  availableCoordinates2.push(1);
                } else if (board[row - 1][column] === '') {
                  availableCoordinates2.push(2);
                }

                if (availableCoordinates2.length > 0) {
                  optionIndex = Math.floor(Math.random() * availableCoordinates2.length);
                  optionNumber = availableCoordinates2[optionIndex];

                  switch (optionNumber) {
                    case 1:
                      board[row + 1][column] = 'M';
                      break;
                    case 2:
                      board[row - 1][column] = 'M';
                      break;
                  }
                } else {
                  this.drawCoordinatesFighterPlane(board);
                }

                break;
            }
          } else {
            this.drawCoordinatesFighterPlane(board);
          }

        } else {
          this.drawCoordinatesFighterPlane(board);
        }
      } else {
        this.drawCoordinatesFighterPlane(board);
      }
    } else {
      this.drawCoordinatesFighterPlane(board);
    }
  }

  async drawCoordinatesHelicopter(board: string[][]) {
    let row: number;
    let column: number;
    let availableCoordinates = [];
    let optionNumber: number;
    let optionIndex: number;

    row = Math.floor(Math.random() * 10);
    column = Math.floor(Math.random() * 10);

    if (row !== 0 && row !== 9) {
      if (column !== 0 && column !== 9) {

        if (board[row][column] === '') {

          if (board[row + 1][column] === '' && board[row - 1][column] === '') {
            availableCoordinates.push(1);
          }
          if (board[row][column + 1] === '' && board[row][column - 1] === '') {
            availableCoordinates.push(2);
          }

          if (availableCoordinates.length > 0) {
            optionIndex = Math.floor(Math.random() * availableCoordinates.length);
            optionNumber = availableCoordinates[optionIndex];

            switch (optionNumber) {
              case 1:
                board[row][column] = 'H';
                board[row + 1][column] = 'H';
                board[row - 1][column] = 'H';
                break;
              case 2:
                board[row][column] = 'H';
                board[row][column + 1] = 'H';
                board[row][column - 1] = 'H';
                break;
            }
          } else {
            this.drawCoordinatesHelicopter(board);
          }

        } else {
          this.drawCoordinatesHelicopter(board);
        }
      } else {
        this.drawCoordinatesHelicopter(board);
      }
    } else {
      this.drawCoordinatesHelicopter(board);
    }
  }

  async drawCoordinatesReconnaissanceAircraft(board: string[][]) {
    let row: number;
    let column: number;
    let availableCoordinates = [];
    let optionNumber: number;
    let optionIndex: number;

    row = Math.floor(Math.random() * 10);
    column = Math.floor(Math.random() * 10);

    if (row !== 0 && row !== 9) {
      if (column !== 0 && column !== 9) {

        if (board[row][column] === '') {
          if (board[row + 1][column] === '') {
            availableCoordinates.push(1);
          }
          if (board[row - 1][column] === '') {
            availableCoordinates.push(2);
          }
          if (board[row][column + 1] === '') {
            availableCoordinates.push(3);
          }
          if (board[row][column - 1] === '') {
            availableCoordinates.push(4);
          }

          if (availableCoordinates.length > 0) {
            optionIndex = Math.floor(Math.random() * availableCoordinates.length);
            optionNumber = availableCoordinates[optionIndex];

            switch (optionNumber) {
              case 1:
                board[row][column] = 'SR';
                board[row + 1][column] = 'SR';
                break;
              case 2:
                board[row][column] = 'SR';
                board[row - 1][column] = 'SR';
                break;
              case 3:
                board[row][column] = 'SR';
                board[row][column + 1] = 'SR';
                break;
              case 4:
                board[row][column] = 'SR';
                board[row][column - 1] = 'SR';
                break;
            }
          } else {
            this.drawCoordinatesReconnaissanceAircraft(board);
          }
        } else {
          this.drawCoordinatesReconnaissanceAircraft(board);
        }
      } else {
        this.drawCoordinatesReconnaissanceAircraft(board);
      }
    } else {
      this.drawCoordinatesReconnaissanceAircraft(board);
    }
  }

  async changePlayerStatus(playerStatus: string) {
    this.gameService.changePlayerStatus(this.game.id, playerStatus).subscribe();
  }

  async playGame(board: string[][]) {
    let coordinatesDtoList = [];

    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        if (board[i][j] !== '') {
          let coordinatesDto: CoordinatesDto = new CoordinatesDto();
          coordinatesDto.setRowNumber(i);
          coordinatesDto.setColumnNumber(j);
          coordinatesDto.setCoordinatesValue(board[i][j]);
          coordinatesDtoList.push(coordinatesDto);
        }
      }
    }

    this.httpClient.post(`${'http://localhost:8080/api/game'}/${this.game.id}${'=play_game'}`, coordinatesDtoList, httpOptions).subscribe();
  }

  getAllCoordinates() {
    this.TroopCarrierPlaneFP = 0;
    this.BomberPlaneFP = 0;
    this.FighterPlaneFP = 0;
    this.HelicopterFP = 0;
    this.ReconnaissanceAircraftFP = 0;

    this.TroopCarrierPlaneSP = 0;
    this.BomberPlaneSP = 0;
    this.FighterPlaneSP = 0;
    this.HelicopterSP = 0;
    this.ReconnaissanceAircraftSP = 0;

    this.gameService.getAllCoordinates(this.game.id).then(
      r => {
        this.allCoordinates = r;

        for (let coordinates of this.allCoordinates) {
          for (let i = 0; i < 10; i++) {
            for (let j = 0; j < 10; j++) {
              if (coordinates.rowNumber === i && coordinates.columnNumber === j) {
                if (coordinates.userName === this.game.firstPlayer.userName) {
                  this.firstPlayerBoard[i][j] = coordinates.coordinatesValue;

                  switch (coordinates.coordinatesValue) {
                    case 'T':
                      this.TroopCarrierPlaneFP++;
                      break;
                    case 'B':
                      this.BomberPlaneFP++;
                      break;
                    case 'M':
                      this.FighterPlaneFP++;
                      break;
                    case 'H':
                      this.HelicopterFP++;
                      break;
                    case 'SR':
                      this.ReconnaissanceAircraftFP++;
                      break;
                  }
                } else if ((this.game.secondPlayer !== null && coordinates.userName === this.game.secondPlayer.userName) || coordinates.userName === 'Computer') {
                  this.secondPlayerBoard[i][j] = coordinates.coordinatesValue;

                  switch (coordinates.coordinatesValue) {
                    case 'T':
                      this.TroopCarrierPlaneSP++;
                      break;
                    case 'B':
                      this.BomberPlaneSP++;
                      break;
                    case 'M':
                      this.FighterPlaneSP++;
                      break;
                    case 'H':
                      this.HelicopterSP++;
                      break;
                    case 'SR':
                      this.ReconnaissanceAircraftSP++;
                      break;
                  }
                }
              }
            }
          }
        }

        if (this.TroopCarrierPlaneFP === 0) { this.isTroopCarrierPlaneFP = false; }
        if (this.TroopCarrierPlaneSP === 0) { this.isTroopCarrierPlaneSP = false; }

        if (this.BomberPlaneFP === 0) { this.isBomberPlaneFP = false; }
        if (this.BomberPlaneSP === 0) { this.isBomberPlaneSP = false; }

        if (this.FighterPlaneFP === 0) { this.isFighterPlaneFP = false; }
        if (this.FighterPlaneSP === 0) { this.isFighterPlaneSP = false; }

        if (this.HelicopterFP === 0) { this.isHelicopterFP = false; }
        if (this.HelicopterSP === 0) { this.isHelicopterSP = false; }

        if (this.ReconnaissanceAircraftFP === 0) { this.isReconnaissanceAircraftFP = false; }
        if (this.ReconnaissanceAircraftSP === 0) { this.isReconnaissanceAircraftSP = false; }
      }
    ).catch(e => {
      alert('Nie pobrano współrzędnych wszystkich samolotów!');
    });
  }

  firstPlayerMove(row: number, column: number) {
    let changeCoordinatesValueDTO: ChangeCoordinatesValueDto = new ChangeCoordinatesValueDto();
    changeCoordinatesValueDTO.setRowNumber(row);
    changeCoordinatesValueDTO.setColumnNumber(column);
    changeCoordinatesValueDTO.setUser(this.game.firstPlayer);

    if (this.game.gameStatus !== 'GAME_FINISHED') {
      if (this.userLogged.id === this.game.firstPlayer.id) {
        if (this.game.firstPlayer.id === this.game.currentPlayer.id) {
          if (
            this.secondPlayerBoard[row][column] === 'T' ||
            this.secondPlayerBoard[row][column] === 'B' ||
            this.secondPlayerBoard[row][column] === 'M' ||
            this.secondPlayerBoard[row][column] === 'H' ||
            this.secondPlayerBoard[row][column] === 'SR'
          ) {
            changeCoordinatesValueDTO.setCoordinatesValue('ST');
            this.gameService.changeValueAtCoordinates(this.game.id, changeCoordinatesValueDTO).subscribe();
          } else {
            changeCoordinatesValueDTO.setCoordinatesValue('P');
            this.gameService.changeValueAtCoordinates(this.game.id, changeCoordinatesValueDTO).subscribe();
          }
        }
      }

      if (this.game.enemy === 'C') {
        this.gameStatusMessage = `Ruch gracza Komputer`;
        setTimeout(() => {
            this.computerPlayerMove();
            this.gameStatusMessage = `Ruch gracza ${this.game.currentPlayer.userName}`;
          },
          1500);
      }
    }
  }

  secondPlayerMove(row: number, column: number) {
    let changeCoordinatesValueDTO: ChangeCoordinatesValueDto = new ChangeCoordinatesValueDto();
    changeCoordinatesValueDTO.setRowNumber(row);
    changeCoordinatesValueDTO.setColumnNumber(column);
    changeCoordinatesValueDTO.setUser(this.game.secondPlayer);

    if (this.game.gameStatus !== 'GAME_FINISHED') {
      if (this.userLogged.id === this.game.secondPlayer.id) {
        if (this.game.secondPlayer.id === this.game.currentPlayer.id) {
          if (
            this.firstPlayerBoard[row][column] === 'T' ||
            this.firstPlayerBoard[row][column] === 'B' ||
            this.firstPlayerBoard[row][column] === 'M' ||
            this.firstPlayerBoard[row][column] === 'H' ||
            this.firstPlayerBoard[row][column] === 'SR'
          ) {
            changeCoordinatesValueDTO.setCoordinatesValue('ST');
            this.gameService.changeValueAtCoordinates(this.game.id, changeCoordinatesValueDTO).subscribe();
          } else {
            changeCoordinatesValueDTO.setCoordinatesValue('P');
            this.gameService.changeValueAtCoordinates(this.game.id, changeCoordinatesValueDTO).subscribe();
          }
        }
      }
    }
  }

  computerPlayerMove() {
    let row: number;
    let column: number;
    let optionIndex: number;

    if (this.game.difficultyLevel === 'E') {
      row = Math.floor(Math.random() * 10);
      column = Math.floor(Math.random() * 10);

    } else if (this.game.difficultyLevel === 'M') {
      if (this.targetMissed === 3) {
        this.isHitPlane = false;
        this.targetMissed = 0;
        this.coordinatesForComputer.length = 0;
      }

      if (this.coordinatesForComputer.length === 0) {
        row = Math.floor(Math.random() * 10);
        column = Math.floor(Math.random() * 10);

        if (
          this.firstPlayerBoard[row][column] === 'T' ||
          this.firstPlayerBoard[row][column] === 'B' ||
          this.firstPlayerBoard[row][column] === 'M' ||
          this.firstPlayerBoard[row][column] === 'H' ||
          this.firstPlayerBoard[row][column] === 'SR'
        ) {
          this.coordinatesForComputer = this.getCoordinatesForComputer(row, column);
        }
      } else {
        optionIndex = Math.floor(Math.random() * this.coordinatesForComputer.length);
        this.coordinates = this.coordinatesForComputer[optionIndex];
        this.coordinatesForComputer.splice(optionIndex, 1);
        row = this.coordinates.getRowNumber();
        column = this.coordinates.getColumnNumber();

        if (this.firstPlayerBoard[row][column] === '') {
          this.targetMissed++;
        }
      }

    } else if (this.game.difficultyLevel === 'H') {
      if (this.coordinatesForComputer.length === 0) {
        row = Math.floor(Math.random() * 10);
        column = Math.floor(Math.random() * 10);
      }

      if (this.coordinatesForComputer.length > 0) {
        optionIndex = Math.floor(Math.random() * this.coordinatesForComputer.length);
        this.coordinates = this.coordinatesForComputer[optionIndex];
        this.coordinatesForComputer.splice(optionIndex, 1);
        row = this.coordinates.getRowNumber();
        column = this.coordinates.getColumnNumber();
      }
    }

    // Część wspólna dla wszystkich poziomów trudności
    let changeCoordinatesValueDTO: ChangeCoordinatesValueDto = new ChangeCoordinatesValueDto();
    changeCoordinatesValueDTO.setRowNumber(row);
    changeCoordinatesValueDTO.setColumnNumber(column);

    if (this.firstPlayerBoard[row][column] === 'T' || this.firstPlayerBoard[row][column] === 'B' || this.firstPlayerBoard[row][column] === 'M' || this.firstPlayerBoard[row][column] === 'H' || this.firstPlayerBoard[row][column] === 'SR') {
      changeCoordinatesValueDTO.setCoordinatesValue('ST');
      this.gameService.changeValueAtCoordinatesComputer(this.game.id, changeCoordinatesValueDTO).subscribe();

      // Poziom średni
      if (this.game.difficultyLevel === 'M') {
        this.isHitPlane = true;
        this.targetMissed = 0;
      }

      // Poziom trudny
      if (this.game.difficultyLevel === 'H' && this.coordinatesForComputer.length === 0) {
        const aircraftType = this.firstPlayerBoard[row][column];

        for (let rowNumber = 0; rowNumber < 10; rowNumber++) {
          for (let columnNumber = 0; columnNumber < 10; columnNumber++) {
            if (this.firstPlayerBoard[rowNumber][columnNumber] === aircraftType) {
              let coordinates: CoordinatesDto = new CoordinatesDto();
              coordinates.setRowNumber(rowNumber);
              coordinates.setColumnNumber(columnNumber);
              this.coordinatesForComputer.push(coordinates);
            }
          }
        }
      }
    } else if (this.firstPlayerBoard[row][column] === '') {
      changeCoordinatesValueDTO.setCoordinatesValue('P');
      this.gameService.changeValueAtCoordinatesComputer(this.game.id, changeCoordinatesValueDTO).subscribe();
    } else if (this.firstPlayerBoard[row][column] === 'P' || this.firstPlayerBoard[row][column] === 'ST') {
      this.computerPlayerMove();
    }
  }

  getCoordinatesForComputer(row: number, column: number): CoordinatesDto[] {
    let coordinatesList = [];

    if (row > 1) {
      let coordinates: CoordinatesDto = new CoordinatesDto();
      coordinates.setRowNumber(row - 1);
      coordinates.setColumnNumber(column);
      coordinatesList.push(coordinates);

      if (row > 0) {
        let coordinates: CoordinatesDto = new CoordinatesDto();
        coordinates.setRowNumber(row - 2);
        coordinates.setColumnNumber(column);
        coordinatesList.push(coordinates);

        if (column < 9) {
          let coordinates: CoordinatesDto = new CoordinatesDto();
          coordinates.setRowNumber(row - 2);
          coordinates.setColumnNumber(column + 1);
          coordinatesList.push(coordinates);
        }

        if (column > 0) {
          let coordinates: CoordinatesDto = new CoordinatesDto();
          coordinates.setRowNumber(row - 2);
          coordinates.setColumnNumber(column - 1);
          coordinatesList.push(coordinates);
        }
      }
    }

    if (row > 1 && column < 8) {
      let coordinates: CoordinatesDto = new CoordinatesDto();
      coordinates.setRowNumber(row - 1);
      coordinates.setColumnNumber(column + 1);
      coordinatesList.push(coordinates);

      if (row > 0 && column < 9) {
        let coordinates: CoordinatesDto = new CoordinatesDto();
        coordinates.setRowNumber(row - 2);
        coordinates.setColumnNumber(column + 2);
        coordinatesList.push(coordinates);
      }
    }

    if (column < 8) {
      let coordinates: CoordinatesDto = new CoordinatesDto();
      coordinates.setRowNumber(row);
      coordinates.setColumnNumber(column + 1);
      coordinatesList.push(coordinates);

      if (column < 9) {
        let coordinates: CoordinatesDto = new CoordinatesDto();
        coordinates.setRowNumber(row);
        coordinates.setColumnNumber(column + 2);
        coordinatesList.push(coordinates);
      }

      if (row > 0) {
        let coordinates: CoordinatesDto = new CoordinatesDto();
        coordinates.setRowNumber(row - 1);
        coordinates.setColumnNumber(column + 2);
        coordinatesList.push(coordinates);
      }

      if (row < 9) {
        let coordinates: CoordinatesDto = new CoordinatesDto();
        coordinates.setRowNumber(row + 1);
        coordinates.setColumnNumber(column + 2);
        coordinatesList.push(coordinates);
      }
    }

    if (row < 8 && column < 8) {
      let coordinates: CoordinatesDto = new CoordinatesDto();
      coordinates.setRowNumber(row + 1);
      coordinates.setColumnNumber(column + 1);
      coordinatesList.push(coordinates);

      if (row < 9 && column < 9) {
        let coordinates: CoordinatesDto = new CoordinatesDto();
        coordinates.setRowNumber(row + 2);
        coordinates.setColumnNumber(column + 2);
        coordinatesList.push(coordinates);
      }
    }

    if (row < 8) {
      let coordinates: CoordinatesDto = new CoordinatesDto();
      coordinates.setRowNumber(row + 1);
      coordinates.setColumnNumber(column);
      coordinatesList.push(coordinates);

      if (row < 9) {
        let coordinates: CoordinatesDto = new CoordinatesDto();
        coordinates.setRowNumber(row + 2);
        coordinates.setColumnNumber(column);
        coordinatesList.push(coordinates);

        if (column < 9) {
          let coordinates: CoordinatesDto = new CoordinatesDto();
          coordinates.setRowNumber(row + 2);
          coordinates.setColumnNumber(column + 1);
          coordinatesList.push(coordinates);
        }

        if (column > 0) {
          let coordinates: CoordinatesDto = new CoordinatesDto();
          coordinates.setRowNumber(row + 2);
          coordinates.setColumnNumber(column - 1);
          coordinatesList.push(coordinates);
        }
      }
    }

    if (row < 8 && column > 1) {
      let coordinates: CoordinatesDto = new CoordinatesDto();
      coordinates.setRowNumber(row + 1);
      coordinates.setColumnNumber(column - 1);
      coordinatesList.push(coordinates);

      if (row < 9 && column > 0) {
        let coordinates: CoordinatesDto = new CoordinatesDto();
        coordinates.setRowNumber(row + 2);
        coordinates.setColumnNumber(column - 2);
        coordinatesList.push(coordinates);
      }
    }

    if (column > 1) {
      let coordinates: CoordinatesDto = new CoordinatesDto();
      coordinates.setRowNumber(row);
      coordinates.setColumnNumber(column - 1);
      coordinatesList.push(coordinates);

      if (column > 0) {
        let coordinates: CoordinatesDto = new CoordinatesDto();
        coordinates.setRowNumber(row);
        coordinates.setColumnNumber(column - 2);
        coordinatesList.push(coordinates);

        if (row > 0) {
          let coordinates: CoordinatesDto = new CoordinatesDto();
          coordinates.setRowNumber(row + 1);
          coordinates.setColumnNumber(column - 2);
          coordinatesList.push(coordinates);
        }

        if (row < 9) {
          let coordinates: CoordinatesDto = new CoordinatesDto();
          coordinates.setRowNumber(row - 1);
          coordinates.setColumnNumber(column - 2);
          coordinatesList.push(coordinates);
        }
      }
    }

    if (row > 1 && column > 1) {
      let coordinates: CoordinatesDto = new CoordinatesDto();
      coordinates.setRowNumber(row - 1);
      coordinates.setColumnNumber(column - 1);
      coordinatesList.push(coordinates);

      if (row > 0 && column > 0) {
        let coordinates: CoordinatesDto = new CoordinatesDto();
        coordinates.setRowNumber(row - 2);
        coordinates.setColumnNumber(column - 2);
        coordinatesList.push(coordinates);
      }
    }

    return coordinatesList;
  }

  sendInvitation(userId: number) {
    this.userService.sendInvitation(userId).subscribe();
    this.isFriend = 1;
  }
}
