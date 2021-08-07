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
    const request = indexedDB.open('mms', 1);

    request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
      const db = (<IDBRequest>event.target).result;
      db.createObjectStore("bookmarks", { autoIncrement : true });
    };
  }

}
