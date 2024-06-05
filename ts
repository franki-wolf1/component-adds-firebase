Para crear un componente en Angular que muestre anuncios en formato multimedia usando Firestore como base de datos y el almacenamiento de Firebase para el contenido multimedia, primero necesitas configurar Firebase en tu proyecto Angular.

A continuación, te proporciono un ejemplo de cómo crear esta funcionalidad paso a paso:

Instalar Firebase: Si aún no lo has hecho, instala Firebase y AngularFire en tu proyecto Angular.

bash
Copiar código
ng add @angular/fire
Configurar Firebase: Configura Firebase en tu proyecto Angular agregando tu configuración de Firebase en environments/environment.ts.

typescript
Copiar código
// environments/environment.ts
export const environment = {
  production: false,
  firebase: {
    apiKey: "your-api-key",
    authDomain: "your-auth-domain",
    projectId: "your-project-id",
    storageBucket: "your-storage-bucket",
    messagingSenderId: "your-messaging-sender-id",
    appId: "your-app-id"
  }
};
Crear el servicio para interactuar con Firestore y Firebase Storage:

typescript
Copiar código
// src/app/services/ad.service.ts
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

export interface Ad {
  id?: string;
  imageUrl: string;
  title: string;
  description: string;
}

@Injectable({
  providedIn: 'root'
})
export class AdService {
  constructor(private firestore: AngularFirestore, private storage: AngularFireStorage) {}

  getAds(): Observable<Ad[]> {
    return this.firestore.collection<Ad>('ads').snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Ad;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }

  uploadImage(file: File): Observable<string> {
    const filePath = `ads/${file.name}`;
    const task = this.storage.upload(filePath, file);
    return task.snapshotChanges().pipe(
      switchMap(() => this.storage.ref(filePath).getDownloadURL())
    );
  }
}
Crear el componente que mostrará los anuncios:

typescript
Copiar código
// src/app/components/ad-list/ad-list.component.ts
import { Component, OnInit } from '@angular/core';
import { AdService, Ad } from '../../services/ad.service';

@Component({
  selector: 'app-ad-list',
  templateUrl: './ad-list.component.html',
  styleUrls: ['./ad-list.component.css']
})
export class AdListComponent implements OnInit {
  ads: Ad[] = [];

  constructor(private adService: AdService) {}

  ngOnInit(): void {
    this.adService.getAds().subscribe(ads => {
      this.ads = ads;
    });
  }
}
html
Copiar código
<!-- src/app/components/ad-list/ad-list.component.html -->
<div class="ad-list">
  <div *ngFor="let ad of ads" class="card">
    <img class="card-img-top" [src]="ad.imageUrl" alt="Card image cap">
    <div class="card-body">
      <h5 class="card-title">{{ ad.title }}</h5>
      <p class="card-text">{{ ad.description }}</p>
    </div>
  </div>
</div>
Agregar el componente a tu módulo:

typescript
Copiar código
// src/app/app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { environment } from '../environments/environment';
import { AppComponent } from './app.component';
import { AdListComponent } from './components/ad-list/ad-list.component';
import { AdService } from './services/ad.service';

@NgModule({
  declarations: [
    AppComponent,
    AdListComponent
  ],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireStorageModule
  ],
  providers: [AdService],
  bootstrap: [AppComponent]
})
export class AppModule { }
Estilizar el componente (opcional):

css
Copiar código
/* src/app/components/ad-list/ad-list.component.css */
.ad-list {
  display: flex;
  flex-wrap: wrap;
}

.card {
  margin: 10px;
  width: 200px;
}

.card-img-top {
  width: 100%;
  height: auto;
}
Con estos pasos, has creado un componente que muestra anuncios en formato multimedia utilizando Firestore y Firebase Storage para el almacenamiento y gestión de los datos y archivos multimedia.






