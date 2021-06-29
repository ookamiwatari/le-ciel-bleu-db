import { AfterViewInit, OnInit, Component, Input, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import itemList from '../../../assets/json/item.json';
import servDropList from '../../../assets/json/serv_drop.json';
import dropList from '../../../assets/json/drop.json';


@Component({
  selector: 'mms-table',
  styleUrls: ['mms-table.component.css'],
  templateUrl: 'mms-table.component.html',
})
export class MmsTableComponent implements OnInit {

  ngOnChanges(changes: SimpleChanges) {
    if (this.point <= 30000) {
      this.rank = 30000;
    } else if (this.point <= 100000) {
      this.rank = 100000;
    } else if (this.point <= 250000) {
      this.rank = 250000;
    } else if (this.point <= 600000) {
      this.rank = 600000;
    } else if (this.point <= 1400000) {
      this.rank = 1400000
    } else if (this.point <= 4000000) {
      this.rank = 4000000;
    } else {
      this.rank = 10000000;
    }
    this.slot = this.point % 26 + 1;
    this.items = [];
    const serv_drop = servDropList.root.drop.find((drop: any) => drop['怪物名稱'] === '聖靈鍊金' + this.rank + '-' + this.slot);
    const latest_drop = dropList.root.drop.find((drop: any) => drop['怪物名稱'] === '聖靈鍊金' + this.rank + '-' + this.slot);
    if (!serv_drop || !latest_drop) return;
    const factor = +serv_drop['factor'];
    const adv_factor = +serv_drop['adv_factor'];
    for (let i = 1; i <= 10; i++) {
      const id = latest_drop['item'+i];
      if (!id) continue;
      const item = itemList.root['道具'].find((item: any) => { return item['編號'] === id; });
      const count = latest_drop['count'+i];
      const prob = +serv_drop['prob'+i];
      this.items.push({ id: item['編號'], name: item['基本名稱'], count: count, description: item['說明定義'], prob: factor && prob ? prob * 100 / factor : undefined });
    }
  }

  @Input() point: number = 0;
  public rank: number = 30000;
  public slot: number = 1;
  public items: any = [];

  constructor(
  ) {
  }

  ngOnInit () {
  }

}
