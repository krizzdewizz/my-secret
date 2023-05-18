import { Component } from '@angular/core';

@Component({
  selector: 'my-secret-check-icon',
  templateUrl: './check-icon.component.html',
  styles: [
    `
      :host {
        transform: scale(1.9);
        position: relative;
        top: 2px;
        left: 2px;
      }
    `,
  ],
})
export class CheckIconComponent {}
