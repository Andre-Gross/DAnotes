import { Injectable, inject } from '@angular/core';
import { Note } from '../interfaces/note.interface';
import { collectionData, Firestore, collection, doc, onSnapshot, addDoc, updateDoc, deleteDoc } from '@angular/fire/firestore';

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


    async addNote(item: Partial<Note>, colId: "note" | "trash" = item.type || "note") {
        await addDoc(this.getColRef(colId), this.getCleanJson(item, colId)).catch(
            (err) => { console.error(err) }
        ).then(
            (docRef) => { console.log("Document written with ID: ", docRef?.id) }
        );
    }


    async updateNote(note: Note) {
        if (note.id) {
            let docRef = this.getSingleDocRef(this.getColIdFromNote(note), note.id)
            await updateDoc(docRef, this.getCleanJson(note)).catch(
                (err) => { console.error(err) })
                .then();
        }
    }


    async deleteNote(colId: "notes" | "trash", docId: string) {
        await deleteDoc(this.getSingleDocRef(colId, docId)).catch(
            (err) => { console.error(err) }
        )
    }


    getCleanJson(note: Partial<Note>, colId: "note" | "trash" = note.type || "note") {
        return {
            type: colId || note.type || "note",
            title: note.title || "",
            content: note.content || "",
            marked: note.marked || false,
        }
    }


    getColIdFromNote(note: Note): "notes" | "trash" {
        if (note.type === "note") {
            return 'notes';
        } else {
            return 'trash';
        }
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


    getColRef(colId: "note" | "trash") {
        return colId === "note" ? this.getNotesRef() : this.getTrashRef();
    }

    getNotesRef() {
        return collection(this.firestore, 'notes')
    }


    getTrashRef() {
        return collection(this.firestore, 'trash')
    }


    getSingleDocRef(colId: string, docId: string) {
        return doc(collection(this.firestore, colId), docId);
    }
}
