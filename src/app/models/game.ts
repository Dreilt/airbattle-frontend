import { User } from './user';

export class Game {
  id: number;
  firstPlayer: User;
  firstPlayerStatus: string;
  enemy: string;
  difficultyLevel: string;
  secondPlayer: User;
  secondPlayerStatus: string;

  gameStatus: string;

  dateCreated: string;
  currentPlayer: User;
}
