import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { DocumentosService } from 'src/app/services/documentos.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
  
  Login:FormGroup

  constructor(private fb:FormBuilder,private auth:AuthService,private fire:DocumentosService ,private route:Router) { 
    this.Login = this.fb.group({
    correo:['',[Validators.required,Validators.email]],
    contraseña:['',Validators.required]
    })
  }

  ngOnInit(): void {
  this.auth.getAuth().subscribe((data)=>{
    console.log(data)
    localStorage.setItem('Id',String(data?.uid))
    localStorage.setItem('nombre',String(data?.displayName))
    localStorage.setItem('correo',String(data?.email))
    if(data){
      this.route.navigate(['/Inicio']);
     }
  })
  }

  login(){
    if(this.Login.invalid){
      alert('campos faltantes')
      return
    }
     this.usuarioExiste();
  }

  usuarioExiste(){
    this.auth.login(this.Login.value.correo,this.Login.value.contraseña).then((auth)=>{
      localStorage.setItem('Id',String(auth.user?.uid))
      localStorage.setItem('nombre',String(auth.user?.displayName))
      localStorage.setItem('correo',String(auth.user?.email))
      alert('Acceso correcto');
      this.primerLogin();
     }).catch((err)=>{
       alert('Usuario o contraseña invalidos')
     })
  }

  primerLogin(){
    let id=String(localStorage.getItem('Id'));
    this.fire.getDocumento(id,'usuarios').subscribe((data:any)=>{
      console.log(data.type)
                                       //true       false
      let ruta = data.type === "removed" ? "Perfil" : "Inicio";
      this.route.navigate(['/'+ruta]);
    })
  
  }
}