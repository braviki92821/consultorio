import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AngularFireModule } from '@angular/fire/compat';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon'
import { HttpClientModule } from '@angular/common/http';
import { PdfMakeWrapper } from 'pdfmake-wrapper';

import { AppRoutingModule } from './app-routing.module';


import { AppComponent } from './app.component';
import { LoginComponent } from './paginas/login/login.component';
import { RegistroComponent } from './paginas/registro/registro.component';
import { DashboardComponent } from './paginas/dashboard/dashboard.component';
import { HeaderComponent } from './paginas/header/header.component';
import { PerfilComponent } from './paginas/perfil/perfil.component';
import { HistorialComponent } from './paginas/historial/historial.component';

import { environment } from 'src/environments/environment';
import { ReactiveFormsModule } from '@angular/forms';
import { SaludComponent } from './paginas/salud/salud.component';
import { ConsultaComponent } from './paginas/consulta/consulta.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegistroComponent,
    DashboardComponent,
    HeaderComponent,
    PerfilComponent,
    HistorialComponent,
    SaludComponent,
    ConsultaComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NoopAnimationsModule,
    MatIconModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
