import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Observable, finalize } from 'rxjs';
import { enfermedades } from '../interfaces/enfermedades.interface';
import { historial } from '../modelos/historial.models';

@Injectable({
  providedIn: 'root'
})
export class DocumentosService {

  constructor(private firebase:AngularFirestore,
    private storage: AngularFireStorage) { }

  documento(data: any, path: string, id: string) {
    const collection = this.firebase.collection(path);
    return collection.doc(id).set(data);
  }

  getDocumento(id: string,collection:string):Observable<any>{
    return this.firebase.collection(collection).doc(id).snapshotChanges()
   }

  updateDocumento(data:any,path:string,id:string){
    return this.firebase.collection(path).doc(id).update(data);
  }

  agregarArchivo(archivo: any, nombre: string,path:string): Promise<string> {
    return new Promise((resolve) => {
      const ruta = path + nombre;
      const ref = this.storage.ref(ruta);
      const task = ref.put(archivo);
      task.snapshotChanges().pipe( finalize(() => {
            ref.getDownloadURL().subscribe((res) => {
              const downloadURL = res;
              console.log(downloadURL);
              resolve(downloadURL);
              return;
            });
          })
        )
        .subscribe();
    });
  }

  borrarArchivo(archivo:any){
    return new Promise((resolve)=>{
      const ref =this.storage.refFromURL(archivo);
      ref.delete()
    })
  }

  getCollection<tipo>(path: string) {
    const collection = this.firebase.collection<tipo>(path);
    return collection.valueChanges();
  }
  //where camo==''
  sos(cadena:string[]){
   const collection = this.firebase.collection<enfermedades>('enfermedades', (ref) =>
     ref.where('sintomas','array-contains-any',cadena)   
   )
   return collection.valueChanges();
  }

  getHistory(idUser:string){
    const collection = this.firebase.collection<historial>('historial', (ref) =>
      ref.where('idUser','==',idUser)
     )
     return collection.valueChanges();
  }

  getId() {
    return this.firebase.createId();
  }
}
