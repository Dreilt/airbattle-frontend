export class CoordinatesDto {
  id: number;
  rowNumber: number;
  columnNumber: number;
  coordinatesValue: string;
  userName: string;

  public getRowNumber(): number {
    return this.rowNumber;
  }

  public setRowNumber(rowNumber: number) {
    this.rowNumber = rowNumber;
  }

  public getColumnNumber(): number {
    return this.columnNumber;
  }

  public setColumnNumber(columnNumber: number) {
    this.columnNumber = columnNumber;
  }

  public getCoordinatesValue(): string {
    return this.coordinatesValue;
  }

  public setCoordinatesValue(coordinatesValue: string) {
    this.coordinatesValue = coordinatesValue;
  }
}
