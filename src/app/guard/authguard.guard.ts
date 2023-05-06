import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthguardGuard implements CanActivate {
  
  constructor(private router: Router,
    private Auth: AngularFireAuth){  
    }

  canActivate(): Observable<boolean> {
    return this.Auth.authState.pipe(
      map((auth) => {
        if (auth) {
          localStorage.setItem('Id',String(auth.uid))
          localStorage.setItem('nombre',String(auth.displayName))
          localStorage.setItem('correo',String(auth.email))
          return true;
        } else {
          this.router.navigate(['/']);
          return false;
        }
      })
    );
  }
  
}
