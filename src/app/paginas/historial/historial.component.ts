import { Component, OnInit } from '@angular/core';
import { historial } from 'src/app/modelos/historial.models';
import { DocumentosService } from 'src/app/services/documentos.service';

@Component({
  selector: 'app-historial',
  templateUrl: './historial.component.html'
})
export class HistorialComponent implements OnInit {
  historial:historial[]=[]

  constructor(private fire:DocumentosService) { }

  ngOnInit(): void {
    this.consultarHistorial()
  }

  consultarHistorial(){
   this.fire.getHistory(String(localStorage.getItem('Id'))).subscribe((data)=>{
     console.log(data)
     this.historial = data
   })
  }

}
