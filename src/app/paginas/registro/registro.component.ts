import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html'
})
export class RegistroComponent implements OnInit {
  
  Registrar:FormGroup

  constructor(private fb:FormBuilder,private auth:AuthService) {
    this.Registrar=this.fb.group({
      nombres: ['',Validators.required],
      correo: ['',[Validators.required,Validators.email]],
      contraseña: ['',[Validators.required,Validators.maxLength(8)]],
      contraseñar: ['',[Validators.required,Validators.maxLength(8)]],
    })
   }

  ngOnInit(): void {
  }

  Registro(){
   if(this.Registrar.invalid && this.samePassword()){
     alert('algunos campos son invalidos')
     return
   }
    this.auth.registrarUsuario(this.Registrar.value).subscribe((data:any)=>{
     alert('Registrado Correctamente')},
    (err)=>this.auth.retornarError(err.error.error.message)
    )
  }

  campo(campo:string):boolean{
    let bool = this.Registrar.get(campo)?.invalid ? true : false;
    return  bool
  }

  samePassword():boolean{
    let pass1= this.Registrar.get('contraseña')?.value
    let pass2= this.Registrar.get('contraseñar')?.value
    let bool= pass1 !== pass2 ? true : false;
    return bool; 
  }

}
