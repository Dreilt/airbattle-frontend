import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Game } from '../models/game';
import { NewGameData } from '../models/new-game-data';
import { GameService } from '../services/game.service';
import {TokenStorageService} from '../services/token-storage.service';
import {User} from '../models/user';
import {GameHistory} from '../models/game-history';

interface Enemy {
  value: string;
  viewValue: string;
}

interface DifficultyLevel {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-new-game',
  templateUrl: './new-game.component.html',
  styleUrls: ['./new-game.component.scss']
})
export class NewGameComponent implements OnInit {

  enemies: Enemy[] = [
    { value: 'P', viewValue: 'Inny gracz' },
    { value: 'C', viewValue: 'Komputer' }
  ];

  difficultyLevels: DifficultyLevel[] = [
    { value: 'E', viewValue: 'Łatwy' },
    { value: 'M', viewValue: 'Średni' },
    { value: 'H', viewValue: 'Trudny' }
  ];

  userLogged: User;

  newGameForm: FormGroup;
  selectedEnemy: string;
  public newGameData: NewGameData = new NewGameData();
  game: Game;

  userGameHistory: GameHistory[];
  displayedColumnsTable1: string[] = ['enemy', 'difficultyLevel', 'dateCreated', 'status'];

  friendsGameHistory: GameHistory[];
  displayedColumnsTable2: string[] = ['friend', 'enemy', 'difficultyLevel', 'dateCreated', 'status'];

  constructor(
    private formBuilder: FormBuilder,
    private gameService: GameService,
    private tokenStorageService: TokenStorageService,
  ) { }

  ngOnInit(): void {
    this.newGameForm = this.formBuilder.group({
      enemy: ['', Validators.required],
      difficultyLevel: [''],
    });

    this.userLogged = this.tokenStorageService.getUser();
    this.getUserGameHistory();
    this.getFriendsGameHistory();
  }

  get enemy() {
    return this.newGameForm.get('enemy');
  }

  get difficultyLevel() {
    return this.newGameForm.get('difficultyLevel');
  }

  createNewGame() {
    this.gameService.createNewGame(this.newGameData);
  }

  getUserGameHistory() {
    this.gameService.getUserGameHistory().then(
      gameHistory => {
        this.userGameHistory = gameHistory;
        console.log(gameHistory);
      }
    ).catch(error => {
      console.log('Nie udało się pobrać historii gier użytkownika');
    });
  }

  getFriendsGameHistory() {
    this.gameService.getFriendsGameHistory().then(
      gameHistory => {
        this.friendsGameHistory = gameHistory;
      }
    ).catch(error => {
      console.log('Nie udało się pobrać historii gier Twoich znajomych');
    });
  }
}
