import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit {
  sesionA:boolean

  constructor(private auth:AuthService,private route:Router) { }

  ngOnInit(): void {
    this.auth.getAuth().subscribe((data)=>{
      if(localStorage.getItem('Id') === undefined || localStorage.getItem('Id') === 'undefined'){
        this.sesionA=false
        console.log(this.sesionA)
     }else{
        this.sesionA=true
        console.log(this.sesionA)
     }
    })
  }

  cerrarSesion(){
    localStorage.removeItem('Id');
    localStorage.removeItem('nombre')
    localStorage.removeItem('correo')
    this.auth.logout();
    this.route.navigate(['/Login'])
  }

}
