import {Injectable} from '@angular/core';
import {NgbDateStruct} from "@ng-bootstrap/ng-bootstrap";

@Injectable({
  providedIn: 'root'
})
export class NgbDateCustomParserFormatter {



  readonly DELIMITER = '.';

  parse(value: string): NgbDateStruct | null {
    if (value) {
      const date = value.split(this.DELIMITER);
      return {
        day: parseInt(date[0], 10),
        month: parseInt(date[1], 10),
        year: parseInt(date[2], 10),
      };
    }
    return null;
  }

  format(date: NgbDateStruct | null): string {
    return date
      ? (date.day> 9 ? date.day : "0"+date.day) + this.DELIMITER +(date.month> 9 ? date.month : "0"+date.month) + this.DELIMITER + date.year
      : '';
  }
}

