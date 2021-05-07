import { AfterViewInit, OnInit, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import itemList from '../../../assets/json/item.json';
import servDropList from '../../../assets/json/serv_drop.json';

@Component({
  selector: 'mms-item-target',
  styleUrls: ['mms-item-target.component.css'],
  templateUrl: 'mms-item-target.component.html',
})
export class MmsItemTargetComponent implements OnInit {

  targetControl = new FormControl();
  targetFilteredOption = this.targetControl.valueChanges.pipe(startWith(''), map((value: any) => this._targetFilter(value)));

  targetList = servDropList.root.drop
    .filter((drop: any) => { return drop['怪物名稱'] && drop['怪物名稱'].indexOf('聖靈鍊金') === 0})
    .map((drop: any) => {
      return Object.keys(drop)
        .filter(key => key.indexOf('item') === 0)
        .map(key => { return { name: itemList.root['道具'].find((item: any) => item['編號'] === drop[key])['基本名稱'], table: drop['怪物名稱'] }})
    })
    .reverse()
    .flat();

  inputControls = [new FormControl(), new FormControl(), new FormControl()];
  inputFilteredOptions = [
    this.inputControls[0].valueChanges.pipe(startWith(''), map((value: any) => this._inputFilter(value))),
    this.inputControls[1].valueChanges.pipe(startWith(''), map((value: any) => this._inputFilter(value))),
    this.inputControls[2].valueChanges.pipe(startWith(''), map((value: any) => this._inputFilter(value)))
  ];

  targetItem: any = {};
  items: any[] = [null, null, null];
  results: any[] = [];
  message = '';

  constructor () {
  }

  ngOnInit () {
  }

  private _targetFilter (value: string) {
    return this.targetList
      .filter((item: any) => item.name.indexOf(value) != -1)
      .slice(0, 20);
  }

  public targetItemSelected (option: any) {
    this.targetItem = option.value;
    this.results = [];
  }

  public targetDisplayFn (option: any): string {
    if (!option) return '';
    return option.name + ': ' + option.table;
  }

  public clearTargetItem () {
    this.targetItem = {};
    this.targetControl.setValue('');
  }

  private _inputFilter (value: string) {
    return itemList.root['道具']
      .filter((item: any) => { return +item['鍊金點數']})
      .filter((item: any) => { return item['基本名稱'] && item['基本名稱'].indexOf(value) != -1})
      .map((item: any) => { return { name: item['基本名稱'], point: +item['鍊金點數'], stack: item['可堆疊'] == '是', potential: item['可堆疊'] == '是' ? +item['鍊金點數'] * 200 : +item['鍊金點數'], cost: Math.ceil(item['價格'] * 0.7) } })
      .sort((item1: any, item2: any) => { return item2.potential - item1.potential})
      .slice(0, 50);
  }

  public inputItemSelected (id: number, option: any) {
    this.items[id] = option.value;
    console.log('items', JSON.stringify(this.items));
    this.results = [];
  }

  public inputDisplayFn (option: any): string {
    if (!option) return '';
    return option.name + ': ' + option.point;
  }

  public clearInputItem (id: number) {
    this.items[id] = null;
    this.inputControls[id].setValue('');
  }

  public search (): void {
    if (!this.targetItem) {
      this.message = 'アイテムが選択されていません';
      return;
    }
    this.message = '検索中...';
    const target_rank = this.targetItem.table.match(/聖靈鍊金(\d+)-(\d+)/)[1];
    const target_mod = +this.targetItem.table.match(/聖靈鍊金(\d+)-(\d+)/)[2] - 1;
    const target_point = this._getTargetPoint(target_rank);
    console.log('target_rank', target_rank);
    console.log('targetItem', this.targetItem);
    console.log('target_point', target_point);
    console.log('target_mod', target_mod);

    if (!this.items.length) {
      this.message = 'アイテムが選択されていません'
    }

    if (this.items[0].potential * 5 < target_point && this.items[1].potential * 5 < target_point && this.items[2].potential * 5 < target_point) {
      console.log('ポイント不足');
      this.message = 'ポイントが不足しています。もっと良いアイテムを指定してください。';
      return;
    }

    if (this.items.includes((item: any) => !item.stack)) {
      this.message = 'スタックされないアイテムについては未実装です。';
      return;
    }

    this.results = this._bruteforceSearch(this.items, target_point, target_mod);
    this.message = `${this.results.length}件の組み合わせが見つかりました。`

  }

  private _getTargetPoint(target_rank: string): number {
    switch (target_rank) {
      case '30000':
        return 0;
      case '100000':
        return 30000;
      case '250000':
        return  100000;
      case '600000':
        return 250000;
      case '1400000':
        return 1000000;
      case '4000000':
        return 3000000;
      case '10000000':
        return 4000000;
      default:
        throw Error('Table not found!!!');
    }
  }

  private _getPoint (items: any, counts: number[]) {
    let point = 0;
    if (items[0] && counts[0]) point += items[0].point * counts[0];
    if (items[1] && counts[1]) point += items[1].point * counts[1];
    if (items[2] && counts[2]) point += items[2].point * counts[2];
    return point;
  }

  private _getCost (items: any, counts: number[]) {
    let point = 0;
    if (items[0] && counts[0]) point += items[0].cost * counts[0];
    if (items[1] && counts[1]) point += items[1].cost * counts[1];
    if (items[2] && counts[2]) point += items[2].cost * counts[2];
    return point;
  }

  private _bruteforceSearch (items: any, target_point: number, target_mod: number) {

    const result_map: any = {};
    const stacks = [];
    for (let i = 0; i < 6; i++) {
      for (let j = 0; j < 6; j++) {
        if (i + j > 5) break;
        for (let k = 0; k < 6; k++) {
          if (i + j + k > 5) break;
          if (i + j + k != 5) continue;
          stacks.push([i, items.filter((i: any) => i).length === 1 ? 0 : j, items.filter((i: any) => i).length === 3 ? k : 0]);
        }
      }
    }

    stacks.forEach((stack) => {
      let il, jl;
      for (let i = 0, imax = (stack[0] && items[0] && items[0].stack) ? stack[0] * 200 : stack[0]; i <= imax; i++) {
        for (let j = 0, jmax = (stack[1] && items[1] && items[1].stack) ? stack[1] * 200 : stack[1]; j <= jmax; j++) {
          for (let k = 0, kmax = (stack[2] && items[2] && items[2].stack) ? stack[2] * 200 : stack[2]; k <= kmax; k++) {
            const point = this._getPoint(items, [i, j, k]);
            if (point < target_point || point % 26 !== target_mod) continue;
            if (!il || !jl) {
              il = i + 25;
              jl = j + 25;
            }
            result_map[`${i}-${j}-${k}`] = {point, counts: [i, j, k], key:`${i}-${j}-${k}`, cost: this._getCost(items, [i, j, k]), stack};
            break;
          }
          if (j === jl) break;
        }
        if (i === il) break;
      }
    });

    const results: any[] = Object.values(result_map);

    console.log('results', results.sort((r1, r2) => r1.cost - r2.cost));

    return results.filter((r1) => {
      return !results.find((r2) => {
        if (r1.counts[0] === r2.counts[0] && r1.counts[1] === r2.counts[1] && r1.counts[2] === r2.counts[2]) return false;
        return r2.counts[0] <= r1.counts[0] && r2.counts[1] <= r1.counts[1] && r2.counts[2] <= r1.counts[2]
      });
    }).sort((r1, r2) => {
      return r1.cost - r2.cost
    });

  }

}
