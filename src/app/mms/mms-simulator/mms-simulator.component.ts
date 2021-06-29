import { AfterViewInit, OnInit, Component, Input, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import itemList from '../../../assets/json/item.json';
import servDropList from '../../../assets/json/serv_drop.json';
import dropList from '../../../assets/json/drop.json';


@Component({
  selector: 'mms-simulator',
  styleUrls: ['mms-simulator.component.css'],
  templateUrl: 'mms-simulator.component.html',
})
export class MmsSimulatorComponent implements OnInit {

  @Input() point: number = 0;
  public rank: number = 30000;
  public slot: number = 1;
  public openedStep: number = 0;
  public confirmed: number = -1;
  public items : any[] = [];
  public reverstone: number = 0;
  public pickups: any[] = [];

  constructor(
  ) {
  }

  ngOnInit () {
  }

  public calc() {
    this.openedStep = 0;
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
    const drop = servDropList.root.drop.find((drop: any) => drop['怪物名稱'] === '聖靈鍊金' + this.rank + '-' + this.slot);
    const drops = servDropList.root.drop.filter((drop: any) => drop['怪物名稱'] && drop['怪物名稱'].indexOf('聖靈鍊金' + this.rank) === 0);
    this.items = [
      this._lotItem(drop, this.point),
      this._lotItem(drops[Math.floor(Math.random() * 26)], this.point),
      this._lotItem(drops[Math.floor(Math.random() * 26)], this.point),
      this._lotItem(drops[Math.floor(Math.random() * 26)], this.point),
      this._lotItem(drops[Math.floor(Math.random() * 26)], this.point)
    ];
  }

  private _lotItem (drop: any, point: number) {
    const latest_drop = dropList.root.drop.find((d: any) => drop['怪物名稱'] === d['怪物名稱']);
    let rnd = Math.random() * drop.factor;
    for (let i = 1; i <= 10; i++) {
      rnd = rnd - +drop['prob' + i];
      if (rnd < 0) return this._findItem(latest_drop['item' + i], point)
    }
    return {
      name: '無し',
      id: null,
      canCorrection: false,
      correction: ''
    };
  }

  private _findItem (id: number, point: number) {
    const item = itemList.root['道具'].find((item: any) => { return item['編號'] === id; });
    return {
      name: item['基本名稱'],
      id,
      canCorrection: item['無組合變化'] === '是',
      correction: this._getCorrection(this.point)
    }
  }

  private _getCorrection (point: number) {
    const statuses = ['STR', 'VIT', 'INT', 'FAI', 'AGI', 'DEX'];
    if (this.point <= 500000) {
      return ''
    } else if (this.point < 1000000) { // 1~3
      return statuses[Math.floor(Math.random() * statuses.length)] + '+' + Math.floor(Math.random() * 3 + 1);
    } else if (this.point < 2000000) { // 4~6
      return statuses[Math.floor(Math.random() * statuses.length)] + '+' + Math.floor(Math.random() * 3 + 4);
    } else if (this.point < 3000000) { // 7~9
      return statuses[Math.floor(Math.random() * statuses.length)] + '+' + Math.floor(Math.random() * 3 + 7);
    } else { // 10~15
      return statuses[Math.floor(Math.random() * statuses.length)] + '+' + Math.floor(Math.random() * 6 + 10);
    }
  }

}
