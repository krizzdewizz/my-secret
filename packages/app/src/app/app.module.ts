import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import {FormsModule} from "@angular/forms";
import {BannerComponent} from "./components/banner/banner.component";
import { UploadIconComponent } from './components/upload-icon/upload-icon.component';
import { DownloadIconComponent } from './components/download-icon/download-icon.component';
import { SecretComponent } from './components/secret/secret.component';
import { EyeIconComponent } from './components/eye-icon/eye-icon.component';
import { TrashIconComponent } from './components/trash-icon/trash-icon.component';
import { PlusIconComponent } from './components/plus-icon/plus-icon.component';

@NgModule({
  declarations: [
    AppComponent,
    BannerComponent,
    UploadIconComponent,
    DownloadIconComponent,
    SecretComponent,
    EyeIconComponent,
    TrashIconComponent,
    PlusIconComponent,
  ],
  imports: [
    BrowserModule,
      FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
