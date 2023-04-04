import {Component} from '@angular/core';

const TITLE = `
 _______ __   __      _______ _______ _______  ______ _______ _______
 |  |  |   \\_/        |______ |______ |       |_____/ |______    |   
 |  |  |    |         ______| |______ |_____  |    \\_ |______    |   
`
const toHtml = (text: string) => {
  return text
    .split('\n')
    .filter(it => !!it)
    .map(line => {
      const chars = Array.from(line)
        .map(c => `<span class="char">${c === ' ' ? '&nbsp;' : c}</span>`)
        .join('')
      ;

      return `<div class="line">${chars}</div>`
    })
    .join('\n');
}

@Component({
  selector: 'rce-banner-rce',
  templateUrl: './banner-rce.component.html',
  styleUrls: ['./banner-rce.component.scss']
})
export class BannerRceComponent {
  readonly title = toHtml(TITLE)
}
