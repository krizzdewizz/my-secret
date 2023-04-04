import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import {FormsModule} from "@angular/forms";
import {BannerRceComponent} from "./components/banner-rce/banner-rce.component";
import { UploadIconComponent } from './components/upload-icon/upload-icon.component';
import { DownloadIconComponent } from './components/download-icon/download-icon.component';
import { SecretComponent } from './components/secret/secret.component';
import { EyeIconComponent } from './components/eye-icon/eye-icon.component';

@NgModule({
  declarations: [
    AppComponent,
    BannerRceComponent,
    UploadIconComponent,
    DownloadIconComponent,
    SecretComponent,
    EyeIconComponent,
  ],
  imports: [
    BrowserModule,
      FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
