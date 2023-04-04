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
  SecretService
} from './secret.service';
import { Result, Secret } from '@my-secret/my-secret';

type SecretView = Secret & { visible: boolean; stars: string };

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

  password = 'a';
  error = '';

  secrets: SecretView[] = [];
  filteredSecrets: SecretView[] = [];
  private _searchTerm = '';
  changed = false;

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

  open() {
    this.secretService.open(this.password);
  }

  ngOnInit(): void {
    this.secretService.init();
  }

  ngAfterViewInit(): void {
    if (this.state.state === 'secretsPresent') {
      this.focusPassword();
    }
  }

  download() {
    // todo
  }

  async onFileChange(e: { target: { files: File[] } } | any) {
    const [file]: File[] = e.target.files;
    const text = await file.text();
    this.handleResult(this.secretService.uploadedData(text), () =>
      this.focusPassword()
    );
  }

  createNew() {
    this.handleResult(this.secretService.createNew(), () =>
      this.focusPassword()
    );
  }

  save() {
    this.handleResult(this.secretService.create(this.password));
  }

  private handleResult(result: Result<unknown>, onOk?: () => void) {
    if (result.outcome === 'error') {
      this.error = result.error;
    } else {
      this.error = '';
      onOk?.();
    }
  }

  private focusPassword() {
    setTimeout(() => {
      const el: HTMLInputElement = this.passwordEl.nativeElement;
      el.focus();
    }, 200);
  }

  unlock() {
    this.handleResult(this.secretService.unlock(this.password), () => {
      this.secrets = (this.state as AppStateOpen).secret.secrets.map(
        secret => ({
          ...secret,
          visible: false,
          stars: '***'
        })
      );

      this.updateFilteredSecrets();
    });
  }

  private updateFilteredSecrets() {
    const searchLower = this._searchTerm.toLowerCase();
    this.filteredSecrets = this.secrets.filter(s =>
      [s.name, s.user, s.info0, s.info0].some(s => s.includes(searchLower))
    );
  }

  onChanged() {
    this.changed = true;
  }

  saveSecrets() {
    this.changed = false;
  }
}
