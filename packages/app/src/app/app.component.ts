import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild
} from '@angular/core';
import {
  AppState,
  AppStateInitial,
  AppStateOpen,
  SecretService,
  UploadAction
} from './secret.service';
import { Result, Secret } from '@my-secret/my-secret';
import orderBy from 'lodash.orderby';

type SecretView = Secret & {
  visible: boolean;
  stars: string;
  original: Secret;
};

const secretViewToSecret = ({
  name,
  user,
  password,
  info0,
  info1
}: SecretView): Secret => ({
  name,
  user,
  password,
  info0,
  info1
});

const secretToSecretView = (secret: Secret): SecretView => ({
  ...secret,
  visible: false,
  stars: '*',
  original: secret
});

@Component({
  selector: 'my-secret-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {
  get searchTerm(): string {
    return this._searchTerm;
  }

  set searchTerm(value: string) {
    this._searchTerm = value;
    this.updateFilteredSecrets();
  }

  @ViewChild('passwordEl') passwordEl!: ElementRef;

  password = '';
  error = '';

  secrets: SecretView[] = [];
  filteredSecrets: SecretView[] = [];
  private _searchTerm = '';
  changed = false;
  uploadAction: UploadAction = 'upload';

  get initialTitle(): string {
    return this.initialPassword ? 'Set password' : 'No secret stored yet';
  }

  get initialPassword(): boolean {
    const state = this.state as AppStateInitial;
    return !!state.initial;
  }

  constructor(private secretService: SecretService) {}

  get state(): AppState {
    return this.secretService.state;
  }


  ngOnInit(): void {
    this.secretService.init();
  }

  ngAfterViewInit(): void {
    if (this.state.state === 'secretsPresent') {
      this.focusPassword();
    }
  }

  exportSecrets(): void {
    this.handleResult(this.secretService.exportSecrets());
  }

  downloadSecrets(): void {
    this.handleResult(this.secretService.downloadSecrets());
  }

  async onFileChange(e: { target: { files: File[] } } | any): Promise<void> {
    const [file]: File[] = e.target.files;
    const text = await file.text();
    this.handleResult(
      this.secretService.upload(text, { action: this.uploadAction }),
      () => this.focusPassword()
    );
  }

  createNew(): void {
    this.handleResult(this.secretService.createNew(), () =>
      this.focusPassword()
    );
  }

  createSecret(): void {
    this.handleResult(this.secretService.create(this.password), () => {
      this.updateUi();
    });
  }

  private handleResult(result: Result<unknown>, onOk?: () => void): void {
    if (result.outcome === 'error') {
      this.error = result.error;
    } else {
      this.error = '';
      onOk?.();
    }
  }

  private focusPassword(): void {
    setTimeout(() => {
      const el: HTMLInputElement = this.passwordEl.nativeElement;
      el.focus();
    }, 200);
  }

  unlock(): void {
    this.handleResult(this.secretService.unlock(this.password), () => {
      this.updateUi();
    });
  }

  private updateUi(): void {
    this.secrets = (this.state as AppStateOpen).secret?.secrets.map(
      secretToSecretView
    ) || [];

    this.updateFilteredSecrets();
  }

  private updateFilteredSecrets(): void {
    const searchLower = this._searchTerm.toLowerCase();

    this.filteredSecrets = orderBy(
      this.secrets.filter(s =>
        [s.name, s.user, s.info0, s.info0].some(
          s => !s || s.includes(searchLower)
        )
      ),
      [s => s.new, s => s.name]
    );
  }

  onChanged(): void {
    this.changed = true;
  }

  saveSecrets(): void {
    this.changed = false;

    this.handleResult(
      this.secretService.saveSecrets(this.password, {
        secrets: this.secrets.map(secretViewToSecret)
      })
    );
  }

  addSecret(): void {
    this.changed = true;
    this.handleResult(this.secretService.addSecret(), () => {
      this.updateUi();
      this.focusNameInput();
    });
  }

  deleteSecret(secret: SecretView): void {
    this.changed = true;
    this.handleResult(this.secretService.deleteSecret(secret.original), () =>
      this.updateUi()
    );
  }

  private focusNameInput(): void {
    setTimeout(() => {
      const inp = document.querySelector(
        '.secret-container input'
      ) as HTMLInputElement;
      inp.focus();
    }, 100);
  }

  reset():void {
    if (!confirm('Delete my-secret data from local storage?')) {
      return;
    }

    this.password = '';
    this.handleResult(this.secretService.reset(), () =>
      this.updateUi()
    );
  }

  open(): void {
    this.handleResult(this.secretService.open(this.password));
  }
}
