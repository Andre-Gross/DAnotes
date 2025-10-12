import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), importProvidersFrom(provideFirebaseApp(() => initializeApp({"projectId":"danotes-ce65a","appId":"1:900113218155:web:2f269931bd7ca13545cf2e","storageBucket":"danotes-ce65a.firebasestorage.app","apiKey":"AIzaSyCWNI2bxw1d0CDb3D5v2i4hXVs0bCBc_MQ","authDomain":"danotes-ce65a.firebaseapp.com","messagingSenderId":"900113218155"}))), importProvidersFrom(provideFirestore(() => getFirestore()))]
};
