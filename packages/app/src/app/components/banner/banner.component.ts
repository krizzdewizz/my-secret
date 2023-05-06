import { Component } from '@angular/core';

const TITLE = `
 _______ __   __      _______ _______ _______  ______ _______ _______
 |  |  |   \\_/        |______ |______ |       |_____/ |______    |   
 |  |  |    |         ______| |______ |_____  |    \\_ |______    |   
`;
const toHtml = (text: string): string => {
  return text
    .split('\n')
    .filter(it => !!it)
    .map(line => {
      const chars = Array.from(line)
        .map(c => `<span class='char'>${c === ' ' ? '&nbsp;' : c}</span>`)
        .join('');
      return `<div class='line'>${chars}</div>`;
    })
    .join('\n');
};

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
  readonly title = toHtml(TITLE);
  readonly lines = toLines(TITLE);
}
