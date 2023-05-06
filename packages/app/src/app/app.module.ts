import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { BannerComponent } from './components/banner/banner.component';
import { UploadIconComponent } from './components/icon/upload-icon/upload-icon.component';
import { DownloadIconComponent } from './components/icon/download-icon/download-icon.component';
import { EyeIconComponent } from './components/icon/eye-icon/eye-icon.component';
import { TrashIconComponent } from './components/icon/trash-icon/trash-icon.component';
import { PlusIconComponent } from './components/icon/plus-icon/plus-icon.component';
import { SaveIconComponent } from './components/icon/save-icon/save-icon.component';
import { ExportIconComponent } from './components/icon/export-icon/export-icon.component';
import { CopyIconComponent } from './components/icon/copy-icon/copy-icon.component';

@NgModule({
  declarations: [
    AppComponent,
    BannerComponent,
    UploadIconComponent,
    DownloadIconComponent,
    EyeIconComponent,
    TrashIconComponent,
    PlusIconComponent,
    SaveIconComponent,
    ExportIconComponent,
    CopyIconComponent
  ],
  imports: [BrowserModule, FormsModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
