import { AfterViewInit, OnInit, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import itemList from '../../../assets/json/item.json';

@Component({
  selector: 'mms-item-input',
  styleUrls: ['mms-item-input.component.css'],
  templateUrl: 'mms-item-input.component.html',
})
export class MmsItemInputComponent implements OnInit {

  myControls = [new FormControl(), new FormControl(), new FormControl(), new FormControl(), new FormControl()];
  filteredOptions = [
    this.myControls[0].valueChanges.pipe(startWith(''), map((value: any) => this._filter(value))),
    this.myControls[1].valueChanges.pipe(startWith(''), map((value: any) => this._filter(value))),
    this.myControls[2].valueChanges.pipe(startWith(''), map((value: any) => this._filter(value))),
    this.myControls[3].valueChanges.pipe(startWith(''), map((value: any) => this._filter(value))),
    this.myControls[4].valueChanges.pipe(startWith(''), map((value: any) => this._filter(value)))
  ];
  points = [0, 0, 0, 0, 0];
  counts = [0, 0, 0, 0, 0];
  values = [0, 0, 0, 0, 0];
  point = 0;

  constructor(
  ) {
  }

  ngOnInit () {
  }

  private _filter(value: string) {
    return itemList.root['道具']
      .filter((item: any) => { return +item['鍊金點數']})
      .filter((item: any) => { return item['基本名稱'] && item['基本名稱'].indexOf(value) != -1})
      .sort((item1: any, item2: any) => { return item2['鍊金點數'] - item1['鍊金點數']})
      .map((item: any) => { return {name: item['基本名稱'], point: item['鍊金點數'], stack: item['可堆疊'] == '是'}})
      .slice(0, 20);
  }

  public displayFn(option: any): string {
    if (!option) return '';
    return option.name + ': ' + option.point;
  }

  public itemSelected(id: number, option: any) {
    this.points[id] = option.value.point;
    if (option.value.stack) {
      if (this.points[id] < 20000)
        this.counts[id] = 200;
      else {
        this.counts[id] = Math.ceil(4000000 / this.points[id]);
      }
    } else {
      this.counts[id] = 1;
    }
    this.update();
  }

  public clearItem (id: number) {
    this.points[id] = 0;
    this.counts[id] = 0;
    this.myControls[id].setValue('');
    this.update();
  }

  public update() {
    this.point = 0;
    for (let i = 0; i < 5; i++) {
      this.values[i] = this.points[i] * this.counts[i];
      this.point += this.values[i];
    }
    console.log('point', this.point);
  }

}
