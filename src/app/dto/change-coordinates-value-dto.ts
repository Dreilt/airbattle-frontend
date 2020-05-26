import { User } from '../models/user';

export class ChangeCoordinatesValueDto {
  id: number;
  user: User;
  rowNumber: number;
  columnNumber: number;
  coordinatesValue: string;

  public setUser(user: User) {
    this.user = user;
  }

  public setRowNumber(rowNumber: number) {
    this.rowNumber = rowNumber;
  }

  public setColumnNumber(columnNumber: number) {
    this.columnNumber = columnNumber;
  }

  public setCoordinatesValue(coordinatesValue: string) {
    this.coordinatesValue = coordinatesValue;
  }
}
