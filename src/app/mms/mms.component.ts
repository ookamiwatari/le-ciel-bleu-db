import { AfterViewInit, OnInit, Component, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import itemList from '../../assets/json/item.json';

@Component({
  selector: 'mms',
  styleUrls: ['mms.component.css'],
  templateUrl: 'mms.component.html',
})
export class MmsComponent implements OnInit {

  public event: EventEmitter<void> = new EventEmitter();

  constructor(
  ) {
  }

  ngOnInit () {
    this.initIndexedDb();
  }

  private initIndexedDb () {
    const request = indexedDB.open('mms', 2);

    request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
      const db = (<IDBRequest>event.target).result;
      // 次回はここに何か足す
      if (event.oldVersion > 1) return;
      db.createObjectStore("itemHistories", { autoIncrement : true });
      db.createObjectStore("targetHistories", { autoIncrement : true });
      if (event.oldVersion > 0) return;
      db.createObjectStore("bookmarks", { autoIncrement : true });
    };
  }

}
