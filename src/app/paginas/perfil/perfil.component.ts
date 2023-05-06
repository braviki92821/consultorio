import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { DocumentosService } from 'src/app/services/documentos.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html'
})
export class PerfilComponent implements OnInit {
  
  Perfil:FormGroup

  url:string
  newImage:string
  correo=localStorage.getItem('correo')
  nombre=localStorage.getItem('nombre')
  registrar:boolean

  constructor(private fire:DocumentosService,private fb:FormBuilder,private auth:AuthService) {
    this.Perfil= this.fb.group({
      nombre:[''+this.nombre,Validators.required],
      telefono:['',Validators.required],
      codigoPostal:['',Validators.required],
      estado:['',Validators.required],
      municipio:['',Validators.required],
      correo:[''+this.correo+'',[Validators.required,Validators.email]],
      NSS:['']
    })
   }

  ngOnInit(): void {
    this.obtenerPerfil();
    console.log(this.url)
  }

  obtenerPerfil(){
    this.fire.getDocumento(String(localStorage.getItem('Id')),'usuarios').subscribe((data)=>{
      console.log(data)
        this.registrar = data.type==="removed"? true : false;
        if(this.registrar){
          alert('complete sus datos personales por favor y despues sus datos medicos')
        }else{
          this.url=data.payload.data()['foto'];
          this.Perfil.setValue({
            nombre: data.payload.data()['nombre'],
            telefono: data.payload.data()['telefono'],
            codigoPostal: data.payload.data()['codigoPostal'],
            estado: data.payload.data()['estado'],
            municipio: data.payload.data()['municipio'],
            correo: data.payload.data()['correo'],
            NSS: data.payload.data()['NSS'],
          })
        }
    })
  }

  guardarPerfil(){
    if(this.registrar){
      if(this.Perfil.invalid){
        alert('Campos requeridos')
        return
      }
      this.fire.documento(this.Perfil.value,'usuarios',String(localStorage.getItem('Id'))).then(data=>console.log(data)).catch(err=>console.log(err))
      alert('Datos guardados correctamente')
      this.obtenerPerfil();
     }else{
      if(this.Perfil.invalid){
        alert('Campos requeridos')
        return
      }
      this.fire.updateDocumento(this.Perfil.value,'usuarios',String(localStorage.getItem('Id'))).then(data=>data).catch(err=>console.log(err))
      this.auth.updateName(this.Perfil.value.nombre)
      alert('Datos actualizados correctamente')
      this.obtenerPerfil();
    }
  }

  subir(event: any) {
    this.newImage = event.target.files[0];
    console.log(this.newImage)
  }

  async uploadPhoto(){
   // document.getElementById('file')?.click();
    let data:any={foto:''}
    if(this.url === undefined || this.url === ''){
      if(this.newImage !== '' || this.newImage !== undefined){
        let res = await this.fire.agregarArchivo(this.newImage,String(localStorage.getItem('Id')),'profileUsers/');
        data.foto = res;
        this.fire.updateDocumento(data,'usuarios',String(localStorage.getItem('Id')))
        alert('Foto de perfil subida correctamente')
      }else{
        alert('no has seleccionado una imagen')
      }
    }else{
      if(this.newImage !== '' || this.newImage !== undefined){
         this.fire.borrarArchivo(this.url);
         let res = await this.fire.agregarArchivo(this.newImage,String(this.nombre),'profileUsers/');
         data.foto = res;
         this.fire.updateDocumento(data,'usuarios',String(localStorage.getItem('Id')))
         alert('Foto de perfil actualizada correctamente')
         this.url=res
      }else{
        alert('no has seleccionado una imagen')
      }
    }
  }
}
