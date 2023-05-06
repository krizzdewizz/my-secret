import { Component, HostBinding, Input } from '@angular/core';

@Component({
  selector: 'my-secret-eye-icon',
  templateUrl: './eye-icon.component.html',
  styleUrls: ['./eye-icon.component.scss'],
})
export class EyeIconComponent {
  @HostBinding('attr.title')
  readonly title = 'Show password';

  @Input()
  active = false;
}
