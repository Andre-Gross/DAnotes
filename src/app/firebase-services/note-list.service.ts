import { Injectable, inject } from '@angular/core';
import { Note } from '../interfaces/note.interface';
import { collectionData, Firestore, collection, doc, onSnapshot } from '@angular/fire/firestore';

@Injectable({
    providedIn: 'root'
})
export class NoteListService {
    normalNotes: Note[] = [];
    thrashNotes: Note[] = [];

    unsubNotes;
    unsubTrash;

    firestore: Firestore = inject(Firestore);


    constructor() {
        this.unsubNotes = this.subNotesList();
        this.unsubTrash = this.subTrashList();
    }


    ngOnDestroy() {
        this.unsubNotes();
        this.unsubTrash();
    }


    subTrashList() {
        return onSnapshot(this.getTrashRef(), (list) => {
            this.thrashNotes = [];
            list.forEach((element) => {
                this.thrashNotes.push(this.setNoteObject(element.data(), element.id));
            })
        });
    }


    subNotesList() {
        return onSnapshot(this.getNotesRef(), (list) => {
            this.normalNotes = [];
            list.forEach((element) => {
                this.normalNotes.push(this.setNoteObject(element.data(), element.id));
            })
        });
    }


    setNoteObject(obj: any, id: string): Note {
        return {
            id: id || "",
            type: obj.type || "note",
            title: obj.title || "",
            content: obj.content || "",
            marked: obj.marked || false,
        }
    }

    // itemCollection = collection(this.firestore, 'items');

    getNotesRef() {
        return collection(this.firestore, 'notes')
    }


    getTrashRef() {
        return collection(this.firestore, 'trash')
    }


    getSingleDocRef(colId: string, docId: string) {
        return doc(collection(this.firestore, docId))
    }
}
