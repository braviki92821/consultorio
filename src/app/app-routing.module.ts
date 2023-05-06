import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './paginas/login/login.component';
import { RegistroComponent } from './paginas/registro/registro.component';
import { DashboardComponent } from './paginas/dashboard/dashboard.component';
import { PerfilComponent } from './paginas/perfil/perfil.component';
import { AngularFireAuthGuard } from '@angular/fire/compat/auth-guard';
import { AuthguardGuard } from './guard/authguard.guard';
import { SaludComponent } from './paginas/salud/salud.component';
import { ConsultaComponent } from './paginas/consulta/consulta.component';
import { HistorialComponent } from './paginas/historial/historial.component';

const routes: Routes = [
  {path:'',redirectTo:'Login',pathMatch:'full'},
  {path:'Login',component:LoginComponent},
  {path:'Registrarse',component:RegistroComponent},
  {path:'Inicio',component:DashboardComponent,canActivate:[AuthguardGuard]},
  {path:'Perfil',component:PerfilComponent,canActivate:[AuthguardGuard]},
  {path:'DatosMedicos',component:SaludComponent,canActivate:[AuthguardGuard]},
  {path:'Consultar',component:ConsultaComponent,canActivate:[AuthguardGuard]},
  {path:'Historial',component:HistorialComponent,canActivate:[AuthguardGuard]},
  {path:'**', redirectTo: 'Login',pathMatch:'full'},
 
];
//, { useHash: true }
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
