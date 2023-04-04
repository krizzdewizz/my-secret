import { Component, Input } from '@angular/core';
import { Secret } from '@my-secret/my-secret';

@Component({
  selector: 'my-secret-secret',
  templateUrl: './secret.component.html',
  styleUrls: ['./secret.component.scss']
})
export class SecretComponent {
  @Input()
  secret!: Secret;
}
