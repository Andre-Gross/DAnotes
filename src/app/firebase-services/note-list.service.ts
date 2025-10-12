import { Injectable, inject } from '@angular/core';
import { Firestore, collection, doc } from '@angular/fire/firestore';

@Injectable({
    providedIn: 'root'
})
export class NoteListService {

    firestore: Firestore = inject(Firestore);


    constructor() { }


    // itemCollection = collection(this.firestore, 'items');

    getNotesRef() {
        return collection(this.firestore, 'notes')
    }


    getTrashRef() {
        return collection(this.firestore, 'trash')
    }


    getSingleDocRef(colId:string, docId:string) {
        return doc(collection(this.firestore, docId))
    }
}
