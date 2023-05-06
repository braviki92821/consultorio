import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { environment } from 'src/environments/environment';
import { registrarUsuario } from '../interfaces/registro.interface';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private authfire:AngularFireAuth, private http:HttpClient,private fire:AngularFirestore) { }

   registrarUsuario(FormR:registrarUsuario){
     let body={email: FormR.correo, password: FormR.contraseña, displayName:FormR.nombres,returnSecureToken: true}
     return this.http.post('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key='+environment.firebaseConfig.apiKey,body)
   }

   login(correo:string,password:string){
      return  this.authfire.signInWithEmailAndPassword(correo,password)
   }

   getAuth() {
    return this.authfire.authState.pipe(map((auth) => auth));
   }

   registrar(){
      return  this.authfire.createUserWithEmailAndPassword('weqwewqe','dasdsadasd')
   }

   updateName(nombre:string){
    this.authfire.currentUser.then(data=>{
      data?.updateProfile({displayName:nombre})
    })
   }

   logout(){
    this.authfire.signOut()
   }

   retornarError(codeError:string){
    switch (codeError){
      case 'INVALID_EMAIL':
        return alert('Ingrese un correo valido');
      case 'EMAIL_NOT_FOUND':
        return alert('correo no registrado');
      case 'INVALID_PASSWORD':
        return alert('contraseña o correo incorrectos');
      case 'MISSING_PASSWORD':
        return alert('Debe colocar una contraseña');
      case 'WEAK_PASSWORD : Password should be at least 6 characters':
        return alert('Su contraseña debe ser de al menos 6 caracteres');
      case 'EMAIL_EXISTS':
        return alert('Este correo ya esta registrado');
      case 'The password is invalid or the user does not have a password. (auth/wrong-password).':
        return alert('contraseña o correo incorrectos');
    }
   }

}
