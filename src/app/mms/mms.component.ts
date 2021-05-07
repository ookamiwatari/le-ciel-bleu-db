import { AfterViewInit, OnInit, Component } from '@angular/core';
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

  constructor(
  ) {
  }

  ngOnInit () {
  }

}
