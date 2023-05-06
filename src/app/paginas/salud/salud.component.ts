import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DocumentosService } from 'src/app/services/documentos.service';

@Component({
  selector: 'app-salud',
  templateUrl: './salud.component.html'
})
export class SaludComponent implements OnInit {

  Datos:FormGroup
  registrado:boolean;

  constructor(private fb:FormBuilder,private fire:DocumentosService) { 
    this.Datos=this.fb.group({
      estatura:['',Validators.required],
      peso:['',Validators.required],
      tipoSangre:['',Validators.required],
      alergias:['',Validators.required],
      probmedicos:['',Validators.required],
      cirujias:['',Validators.required]
    })

    
  }

  ngOnInit(): void {
    this.obtenerDatos()
  }

  guardarDatos(){
    if(this.registrado){
      if(this.Datos.invalid){
        alert('campos invalidos')
        return
       }
     this.fire.documento(this.Datos.value,'datosMedicos',String(localStorage.getItem('Id'))).then(data=>{
       alert('Datos Guardados exitosamente')
      }).catch(err=>alert(' ha ocurrido un error'))
    }else{
      if(this.Datos.invalid){
        alert('Campos requeridos')
        return
      }
      this.fire.updateDocumento(this.Datos.value,'datosMedicos',String(localStorage.getItem('Id'))).then(data=>{
        alert('Datos Actualizados exitosamente')
       }).catch(err=>alert(' ha ocurrido un error'))
       this.obtenerDatos()
    }

  }

  obtenerDatos(){
       this.fire.getDocumento(String(localStorage.getItem('Id')),'datosMedicos').subscribe((datos)=>{
          this.registrado=datos.type==="removed"? true : false;
          if(this.registrado){
            alert('complete sus datos personales por favor y despues sus datos medicos')
          }else{
            this.Datos.setValue({
              estatura: datos.payload.data()['estatura'],
              peso: datos.payload.data()['peso'],
              tipoSangre: datos.payload.data()['tipoSangre'],
              alergias: datos.payload.data()['alergias'],
              probmedicos: datos.payload.data()['probmedicos'],
              cirujias: datos.payload.data()['cirujias'],
            })
          }
       })
  }

}
