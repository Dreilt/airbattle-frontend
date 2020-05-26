import {Component, OnInit} from '@angular/core';
import {Game} from '../models/game';
import {GameService} from '../services/game.service';
import {Router} from '@angular/router';
import {TokenStorageService} from '../services/token-storage.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Message} from '../models/message';
import {User} from '../models/user';
import {MessageService} from '../services/message.service';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnInit {

  isLoggedIn = false;
  userLogged: User;

  messageForm: FormGroup;
  messageList: Message[];

  gameAvailableList: Game[];
  displayedColumns: string[] = ['firstPlayer', 'gameStatus', 'dateCreated', 'actions'];

  constructor(
    private formBuilder: FormBuilder,
    private tokenStorageService: TokenStorageService,
    private messageService: MessageService,
    private gameService: GameService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.isLoggedIn = !!this.tokenStorageService.getToken();

    if (this.isLoggedIn) {
      this.userLogged = this.tokenStorageService.getUser();
      this.messageForm = this.formBuilder.group({
        message: ['', Validators.required],
      });

      setInterval(() => {
        this.getLast50Messages();
      }, 500);

      setInterval(() => {
        this.getGamesToJoin();
      }, 3000);
    }
  }

  sendMessage() {
    if (this.messageForm.valid) {
      let message: Message = new Message();
      message.setTextMessage(this.messageForm.value.message);
      message.setDateCreated(Date.now().toString());

      this.messageService.createMessage(message)
        .then(res => {
          console.log(res);
        });
    }
  }

  clearInput() {
    setTimeout(() => {
        this.messageForm.reset();
      },
      100);
  }

  getLast50Messages() {
    this.messageService.getLast50Messages().then(
      messageList => {
        this.messageList = messageList;
      }
    ).catch(error => {
      console.log(error);
    });
  }

  getGamesToJoin() {
    this.gameService.getGamesToJoin().then(
      gameList => {
        this.gameAvailableList = gameList;
      }
    ).catch(error => {
      this.router.navigate(['new_game']);
    });
  }

  joinGame(gameId: number) {
    this.gameService.joinGame(gameId);
  }
}
