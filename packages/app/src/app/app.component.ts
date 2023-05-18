import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  AppState,
  AppStateInitial,
  AppStateOpen,
  SecretService,
  UploadAction,
} from './secret.service';
import { Result, Secret } from '@my-secret/my-secret';
import orderBy from 'lodash.orderby';
import copy from 'copy-to-clipboard';
import IdleTracker from 'idle-tracker';

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
  info1,
}: SecretView): Secret => ({
  name,
  user,
  password,
  info0,
  info1,
});

const secretToSecretView = (secret: Secret): SecretView => ({
  ...secret,
  visible: false,
  stars: '*',
  original: secret,
});

const IDLE_TIMEOUT = 1_000 * 60 * 5;
const SAVE_INTERVAL = 3_000;

@Component({
  selector: 'my-secret-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewInit {
  @ViewChild('passwordEl') passwordEl!: ElementRef;
  password = '';
  passwordVisible = false;
  error = '';
  secrets: SecretView[] = [];
  filteredSecrets: SecretView[] = [];
  changed = false;
  uploadAction: UploadAction = 'upload';
  secretCopied?: Secret = undefined;

  private readonly idleTracker = new IdleTracker({
    timeout: IDLE_TIMEOUT,
    onIdleCallback: () => this.onIdle(),
  });

  constructor(private secretService: SecretService) {
    setInterval(() => this.saveSecrets(), SAVE_INTERVAL);
  }

  private _searchTerm = '';

  get searchTerm(): string {
    return this._searchTerm;
  }

  set searchTerm(value: string) {
    this._searchTerm = value;
    this.updateFilteredSecrets();
  }

  get initialTitle(): string {
    return this.initialPassword ? 'Set password' : 'No secret stored yet';
  }

  get initialPassword(): boolean {
    const state = this.state as AppStateInitial;
    return !!state.initial;
  }

  get state(): AppState {
    return this.secretService.state;
  }

  ngOnInit(): void {
    this.secretService.init();

    // never stopped
    this.idleTracker.start();
  }

  ngAfterViewInit(): void {
    if (this.state.state === 'secretsPresent') {
      this.focusPasswordInput();
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
      () => this.focusPasswordInput()
    );
  }

  createNew(): void {
    this.handleResult(this.secretService.createNew(), () =>
      this.focusPasswordInput()
    );
  }

  createSecret(): void {
    this.handleResult(this.secretService.create(this.password), () => {
      this.updateUi();
    });
  }

  unlock(): void {
    const unlockRes = this.secretService.unlock(this.password);
    if (unlockRes.outcome === 'error') {
      this.password = '';
    }
    this.handleResult(unlockRes, () => {
      this.updateUi();
      this.focusSearchInput();
    });
  }

  onChanged(): void {
    this.changed = true;
  }

  saveSecrets(): void {
    if (this.state.state !== 'open' || !this.changed) {
      return;
    }

    const saveRes = this.secretService.saveSecrets(this.password, {
      secrets: this.secrets.map(secretViewToSecret),
    });

    if (saveRes.outcome === 'ok') {
      this.changed = false;
    }

    this.handleResult(saveRes);
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

  reset(): void {
    if (!confirm('Delete my-secret data from local storage?')) {
      return;
    }

    this.password = '';
    this.handleResult(this.secretService.reset(), () => this.updateUi());
  }

  open(): void {
    this.handleResult(this.secretService.open(this.password));
  }

  copy(password: string, secret: Secret): void {
    copy(password);
    this.secretCopied = secret;
    setTimeout(() => (this.secretCopied = undefined), 2_000);
  }

  private handleResult(result: Result<unknown>, onOk?: () => void): void {
    if (result.outcome === 'error') {
      this.error = result.error;
    } else {
      this.error = '';
      onOk?.();
    }
  }

  private focusPasswordInput(): void {
    setTimeout(() => {
      const el: HTMLInputElement = this.passwordEl.nativeElement;
      el.focus();
    }, 200);
  }

  private updateUi(): void {
    this.secrets =
      (this.state as AppStateOpen).secret?.secrets.map(secretToSecretView) ||
      [];

    this.updateFilteredSecrets();
  }

  private updateFilteredSecrets(): void {
    const searchLower = this._searchTerm.toLowerCase();

    this.filteredSecrets = orderBy(
      this.secrets.filter(s =>
        [
          s.name,
          s.user,
          s.info0,
          s.info0,
          (s.tags || []).reduce((acc, it) => acc + it, ''),
        ].some(s => s && s.includes(searchLower))
      ),
      [s => s.new, s => s.name.toLowerCase()]
    );
  }

  private focusNameInput(): void {
    setTimeout(() => {
      const nameInp = document.querySelector(
        '.secret-container input'
      ) as HTMLInputElement;
      nameInp.focus();
      nameInp.setSelectionRange(0, 10_000);
    }, 200);
  }

  private focusSearchInput(): void {
    setTimeout(
      () =>
        (
          document.querySelector('.toolbar .search') as HTMLInputElement
        )?.focus(),
      100
    );
  }

  private onIdle(): void {
    const lockRes = this.secretService.lock();

    if (lockRes.outcome === 'ok') {
      this.password = '';
    }

    this.handleResult(lockRes, () => {
      this.updateUi();
      this.focusPasswordInput();
    });
  }
}
