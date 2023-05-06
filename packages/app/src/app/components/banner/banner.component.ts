import { Component } from '@angular/core';

const TITLE = `
 _______ __   __      _______ _______ _______  ______ _______ _______
 |  |  |   \\_/        |______ |______ |       |_____/ |______    |   
 |  |  |    |         ______| |______ |_____  |    \\_ |______    |   
`;

const toLines = (text: string): string[][] => {
  return text
    .split('\n')
    .filter(it => !!it)
    .map(line => Array.from(line));
};

@Component({
  selector: 'my-secret-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss']
})
export class BannerComponent {
  readonly lines = toLines(TITLE);
}
