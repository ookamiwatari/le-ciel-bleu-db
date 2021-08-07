import { AfterViewInit, OnInit, Component, Input, EventEmitter, NgZone } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'mms-bookmark',
  styleUrls: ['mms-bookmark.component.css'],
  templateUrl: 'mms-bookmark.component.html',
})
export class MmsBookmarkComponent implements OnInit {

  @Input() event!: EventEmitter<void>;
  public bookmarks: any[] = [];

  constructor(
    private ngZone: NgZone
  ) {
  }

  ngOnInit () {

  }

  ngAfterViewInit () {
    this.event.subscribe(() => {
      this.update();
    })
  }

  public delete (id: number) {
    console.log('delete', id);
    const request = indexedDB.open('mms');
    request.onsuccess = (event: Event) => {
      const db = (<IDBRequest>event.target).result;
      const transaction = db.transaction(["bookmarks"], "readwrite");
      const objectStore = transaction.objectStore("bookmarks");
      objectStore.delete(id);
      this.update();
    };
  }

  private update () {
    this.bookmarks = [];
    const request = indexedDB.open('mms');
    request.onsuccess = (event: Event) => {
      const db = (<IDBRequest>event.target).result;
      const transaction = db.transaction(["bookmarks"], "readonly");
      const objectStore = transaction.objectStore("bookmarks");
      const req = objectStore.openCursor();
      req.onsuccess = (event: any) => {
        const cursor = event.target.result;
        console.log('cursor', cursor);
        if (!cursor) {
          console.log('bookmarks', this.bookmarks);
          return;
        }
        this.ngZone.run(() => {
          this.bookmarks.push({ key: cursor.key, value: cursor.value });
        })
        cursor.continue();
      }
    };
  }

}
