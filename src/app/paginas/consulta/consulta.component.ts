import { Component, OnInit } from '@angular/core';
import { enfermedades } from 'src/app/interfaces/enfermedades.interface';
import { DocumentosService } from 'src/app/services/documentos.service';
import * as pdfFonts from 'pdfmake/build/vfs_fonts'
import * as pdfMake from 'pdfmake/build/pdfmake';
import { DatePipe } from '@angular/common';
import { historial } from 'src/app/modelos/historial.models';
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-consulta',
  templateUrl: './consulta.component.html'
})
export class ConsultaComponent implements OnInit {

  enfermedades:enfermedades[]

  historialM:historial ={
    idUser: '',
    tratamiento: '',
    diagnostico: '',
    fecha: ''
  }
  estatura:string
  peso:string
  probmedicos:string
  medicamentos:string

  today: Date = new Date();

  pipe = new DatePipe('en-US');
  
  todayWithPipe: string | null | undefined;

  constructor(private fire:DocumentosService) {
    
   }

  ngOnInit(): void {
    this.todayWithPipe = this.pipe.transform(Date.now(), 'dd/MM/yyyy');
    this.datosMedicos()
  }

  consultarEnfermedades(sintomas:any){

    let result = this.cadenas(String(sintomas.value))

    this.fire.sos(result).subscribe( data =>{this.enfermedades = data
    console.log(data)})
  }

  cadenas(cadenaSintomas:string):string[]{
    ///Hola,Mundo
    // [ Hola, Mundo ]
    let sintomas = cadenaSintomas.split(',')
    console.log(sintomas)
    return sintomas
  }

  generarReceta(Tratamiento:any,Diagnostico:any){
    const pdfDefinition: any = {
      content: [
          { text: 'Receta Medica', style:'header' },
          { text: [ 'Fecha: ',{ text: this.today.toLocaleDateString(), style:'datos' }] },
          { text: [ 'Nombre: ',{ text: localStorage.getItem('nombre'), style:'datos' }] },
          { text: [ 'Estatura: ',{ text: this.estatura, style:'datos' }] },
          { text: [ 'Peso: ',{ text: this.peso, style:'datos' }] },
          { text: [ 'Problemas medicos: ',{ text: this.probmedicos, style:'datos' }] },
          { text: [ 'Diagnostico: ',{ text: Diagnostico.value, style:'datos' }] },
          { text: 'Tratamiento',style:'header'},
          { text:  Tratamiento.value,style:'texto'},
      ]
    ,

     styles: {
    header: {
      fontSize: 22,
      bold: true,
      alignment: 'center'
    },
    texto: {
      fontSize: 16,
    },
    datos:{
      fontSize: 16,
      decoration: 'underline'
    }
     }
    }
    pdfMake.createPdf(pdfDefinition).download()
    this.enfermedades = []
    // this.historialM = new historial(String(localStorage.getItem('Id')),Tratamiento.value,Diagnostico.value,this.today.toLocaleDateString())
    this.historialM.idUser = String(localStorage.getItem('Id'))
    this.historialM.diagnostico = Diagnostico.value
    this.historialM.tratamiento = Tratamiento.value
    this.historialM.fecha = this.today.toLocaleDateString()

    this.fire.documento(this.historialM,'historial',this.fire.getId())
    alert('Gracias por su preferencia, visite a un medico para asegurarase')
  }

  datosMedicos(){
    this.fire.getDocumento(String(localStorage.getItem('Id')),'datosMedicos').subscribe((data)=>{
      this.estatura = data.payload.data()['estatura']
      this.peso = data.payload.data()['peso']
      this.probmedicos = data.payload.data()['probmedicos']
    })
  }


}
