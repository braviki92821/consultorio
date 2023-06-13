import { Component, OnInit } from '@angular/core';
import { enfermedades } from 'src/app/interfaces/enfermedades.interface';
import { DocumentosService } from 'src/app/services/documentos.service';
import * as pdfFonts from 'pdfmake/build/vfs_fonts'
import * as pdfMake from 'pdfmake/build/pdfmake';
import { DatePipe } from '@angular/common';
import { historial } from 'src/app/modelos/historial.models';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-consulta',
  templateUrl: './consulta.component.html'
})
export class ConsultaComponent implements OnInit {

  FormDiagnostico:FormGroup

  logo:string

  sintomas:string[] = []

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

  constructor(private fire:DocumentosService,private fb:FormBuilder) {
     this.FormDiagnostico = this.fb.group({
      dolorC: ['',Validators.required],
      dolorG: ['',Validators.required],
      Mareos: ['',Validators.required],
      Fiebre: ['',Validators.required],
      narizTap: ['',Validators.required],
      dolorCor: ['',Validators.required],
      dolorOc: ['',Validators.required],
      sarpullido: ['',Validators.required],
      diarrea: ['',Validators.required],
      nauseas: ['',Validators.required],
      vomito: ['',Validators.required],
      tos: ['',Validators.required],
      reflujo: ['',Validators.required],
      insomnio: ['',Validators.required],
      cansancio: ['',Validators.required],
      hardtobreath: ['',Validators.required]
     }) 
   }

  ngOnInit(): void {
    this.todayWithPipe = this.pipe.transform(Date.now(), 'dd/MM/yyyy');
    this.datosMedicos()
     this.getImageDataUrlFromLocalPath1('assets/Logo.png').then(
      result => this.logo = result
     )
  }

  consultarEnfermedades(sintomas:any){
    // let result = this.cadenas(String(sintomas.value))
    this.fire.sos(sintomas).subscribe( data =>{
     if(data.length !== 0){
       this.enfermedades = data
       console.log(this.enfermedades)
       return
      }
      this.fire.sas(sintomas).subscribe( data =>{
        this.enfermedades = data.filter((f)=>{ return f.sintomas.length >= sintomas.length })
        console.log(this.enfermedades)
      })
 
    })
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
      background:{ image:this.logo,margin: [350,500, 0, 15],opacity:0.5,width: 150,
			height: 150,},
      header:{
        columns:[
        {image: this.logo ,
            width: 50,
            height: 50,
            alignment: 'left',margin: [15, 5, 0, 15]},{text:'Consultorio Medico Virtual',fontSize:28,bold: true, alignment: 'left',
            margin: [25, 5, 0, 15]}, ]
      },
      content: [

          {text: '--------------------------------------------------------------------', style:'header'} ,
          { columns:[
          {  alignment: 'left',margin: [0, 5, 0, 15], text: [ 'Fecha: ',{ text: this.today.toLocaleDateString(), style:'datos' },] },
          {  alignment: 'right',margin: [0, 5, 0, 15] ,text: [ 'Nombre: ',{ text: localStorage.getItem('nombre'), style:'datos' }] },
          ]},
          { columns:[
            {  alignment: 'left',margin: [0, 5, 0, 15], text: [ 'Estatura: ',{ text: this.estatura, style:'datos' }] },
            {  alignment: 'right',margin: [0, 5, 0, 15], text: [ 'Diagnostico: ',{ text: Diagnostico.value, style:'datos' }] },
          ]},
          // { text: [ 'Fecha: ',{ text: this.today.toLocaleDateString(), style:'datos' },] },
          // { text: [ 'Nombre: ',{ text: localStorage.getItem('nombre'), style:'datos' }] },
          // { text: [ 'Estatura: ',{ text: this.estatura, style:'datos' }] },
          // { text: [ 'Peso: ',{ text: this.peso, style:'datos' }] },
          // { text: [ 'Problemas medicos: ',{ text: this.probmedicos, style:'datos' }] },
          // { text: [ 'Diagnostico: ',{ text: Diagnostico.value, style:'datos' }] },
          { text: 'Tratamiento',style:'header'},
          { text:  Tratamiento.value,style:'texto' },
      ]
    ,
    footer:{
      columns: [
        { text: 'Consultorio Virtual derechos reservados 2023', alignment: 'center',fontSize: 22, },
      ]
    },
     styles: {
    header: {
      fontSize: 22,
      bold: true,
      alignment: 'center',
			margin: [0, 5, 0, 15]
    },
    texto: {
      fontSize: 16,
    },
    datos:{
      fontSize: 14,
      decoration:'underline'
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

  array(){
    if(this.FormDiagnostico.invalid){
      alert('complete todas las selecciones')
      return //que detiene el codigo y
    }
    console.log(this.FormDiagnostico.value)
    
    this.sintomas = []
    this.sintomas.push(this.FormDiagnostico.value.dolorC)
    this.sintomas.push(this.FormDiagnostico.value.dolorG)
    this.sintomas.push(this.FormDiagnostico.value.Mareos)
    this.sintomas.push(this.FormDiagnostico.value.Fiebre)
    this.sintomas.push(this.FormDiagnostico.value.narizTap)
    this.sintomas.push(this.FormDiagnostico.value.dolorCor)
    this.sintomas.push(this.FormDiagnostico.value.dolorOc)
    this.sintomas.push(this.FormDiagnostico.value.sarpullido)
    this.sintomas.push(this.FormDiagnostico.value.diarrea)
    this.sintomas.push(this.FormDiagnostico.value.nauseas)
    this.sintomas.push(this.FormDiagnostico.value.vomito)
    this.sintomas.push(this.FormDiagnostico.value.tos)
    this.sintomas.push(this.FormDiagnostico.value.reflujo)
    this.sintomas.push(this.FormDiagnostico.value.insomnio)
    this.sintomas.push(this.FormDiagnostico.value.cansancio)  //ya sea el - o valor del s
    this.sintomas.push(this.FormDiagnostico.value.hardtobreath)

    console.log(this.sintomas)


    this.sintomas = this.sintomas.filter((f)=> { return f !=='-' })

    this.sintomas.sort()
    console.log(this.sintomas)
   this.consultarEnfermedades(this.sintomas)
  }

  getImageDataUrlFromLocalPath1(localPath: string): Promise<string> {
    return new Promise((resolve, reject) => {
        let canvas = document.createElement('canvas');
        let img = new Image();
        img.onload = () => {
            canvas.height = img.height;
            canvas.width = img.width;
            canvas.getContext("2d")?.drawImage(img, 0, 0);
            resolve(canvas.toDataURL('image/png'));
        }
        img.onerror = () => reject('Imagen no disponible')
        img.src = localPath;
    })

  }

}
