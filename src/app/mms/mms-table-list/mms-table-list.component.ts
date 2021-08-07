import { AfterViewInit, OnInit, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';

import itemList from '../../../assets/json/item.json';
import servDropList from '../../../assets/json/serv_drop.json';
import dropList from '../../../assets/json/drop.json';

export interface TableData {
  id: number;
  name: string;
  description: string;
  memo: string;
}

@Component({
  selector: 'mms-table-list',
  styleUrls: ['mms-table-list.component.css'],
  templateUrl: 'mms-table-list.component.html',
})
export class MmsTableListComponent implements OnInit {

  displayedColumns: string[] = ['name', 'description'];
  targetControl = new FormControl();
  dataSource: MatTableDataSource<TableData>;
  input: string = '';

  constructor () {
    // Assign the data to the data source for the table to render
    this.dataSource = new MatTableDataSource();
    document.getElementsByTagName('mat-sidenav-content')[0].scrollTo(0, 0);
  }

  ngOnInit () {
  }

  ngAfterViewInit() {
    const datas = dropList.root.drop.filter((drop: any) => {
      return typeof drop !== 'string' && drop['編號'] && drop['怪物名稱'].indexOf('聖靈鍊金') === 0 && +drop['怪物名稱'].slice(-2) < 27
    }).map((drop: any) => {
      return {
        id: drop['編號'],
        name: drop['怪物名稱'],
        description: this.getDropDescription(drop),
        memo: this.getDropMemo(drop)
      };
    });
    for (const data of datas) {
      this.dataSource.data.push(data);
    }
    this.dataSource.filter = '';
  }

  applyFilter() {
    this.dataSource.filter = this.input.trim().toLowerCase();
  }

  getDropDescription (drop: any) {
    const drops = [];
    for (let i = 1; i <= 40; i++) {
      if (drop['item'+i]) drops.push({ id: drop['item'+i], count: drop['count'+i], i});
    }
    return drops.map((d) => itemList.root['道具'].find((item: any) => item['編號'] === d.id)['基本名稱'] + '(' + this.getProbPercent(drop, d) + '%)').join(', ');
  }

  getProbPercent (drop: any, d: any) {
    const serv_drop = servDropList.root.drop.find((sd) => sd['編號'] === drop['編號']);
    return Math.round(+serv_drop['prob'+d.i] / serv_drop['factor'] * 10000) / 100;
  }

  getDropMemo (drop: any) {
    const drops = [];
    for (let i = 1; i <= 40; i++) {
      if (drop['item'+i]) drops.push({ id: drop['item'+i], count: drop['count'+i]});
    }
    return drops.map((d) => {
      const item = itemList.root['道具'].find((item: any) => item['編號'] === d.id);
      switch(item['物品類別']) {
        case '頭飾':
          if (item['頭部裝備']) return 's' + (item['打孔上限'] ? item['打孔上限'] : 0) + '頭';
          if (item['臉部裝備']) return 's' + (item['打孔上限'] ? item['打孔上限'] : 0) + '顔';
          return '';
        case '手套':
          if (item['職業2號可用']) return 's' + (item['打孔上限'] ? item['打孔上限'] : 0) + 'ガントレット, ' +  's' + (item['打孔上限'] ? item['打孔上限'] : 0) + '腕';
          if (item['職業4號可用']) return 's' + (item['打孔上限'] ? item['打孔上限'] : 0) + '指輪, ' +  's' + (item['打孔上限'] ? item['打孔上限'] : 0) + '腕';
          return '';
        case '盾':
          return 's' + (item['打孔上限'] ? item['打孔上限'] : 0) + '盾, ' +  's' + (item['打孔上限'] ? item['打孔上限'] : 0) + '腕';
        case '衣服':
          if (item['身體裝備']) return 's' + (item['打孔上限'] ? item['打孔上限'] : 0) + '鎧, ' +  's' + (item['打孔上限'] ? item['打孔上限'] : 0) + '体';
          if (item['套裝裝備']) return 's' + (item['打孔上限'] ? item['打孔上限'] : 0) + 'スーツ, ' +  's' + (item['打孔上限'] ? item['打孔上限'] : 0) + '服';
          return '';
        case '鞋子':
          return 's' + (item['打孔上限'] ? item['打孔上限'] : 0) + '足, ' +  's' + (item['打孔上限'] ? item['打孔上限'] : 0) + '靴';
        case '飾品':
          return 's' + (item['打孔上限'] ? item['打孔上限'] : 0) + 'アクセ';
        case '披風':
          return 's' + (item['打孔上限'] ? item['打孔上限'] : 0) + '背中, ' +  's' + (item['打孔上限'] ? item['打孔上限'] : 0) + '羽';
        case '短劍':
          return 's' + (item['打孔上限'] ? item['打孔上限'] : 0) + '短剣';
        case '長劍':
          return 's' + (item['打孔上限'] ? item['打孔上限'] : 0) + '片手剣';
        case '雙持劍':
          return 's' + (item['打孔上限'] ? item['打孔上限'] : 0) + '双剣';
        case '大劍':
          return 's' + (item['打孔上限'] ? item['打孔上限'] : 0) + '大剣';
        case '棍':
          return 's' + (item['打孔上限'] ? item['打孔上限'] : 0) + '棍棒';
        case '弓箭':
          return 's' + (item['打孔上限'] ? item['打孔上限'] : 0) + '弓';
        case '法杖':
          return 's' + (item['打孔上限'] ? item['打孔上限'] : 0) + '杖, ' +  's' + (item['打孔上限'] ? item['打孔上限'] : 0) + 'ロッド';
        case '法典':
          return 's' + (item['打孔上限'] ? item['打孔上限'] : 0) + '本, ' +  's' + (item['打孔上限'] ? item['打孔上限'] : 0) + '法典';
        case '槍械':
          return 's' + (item['打孔上限'] ? item['打孔上限'] : 0) + '銃';
        case '拳套':
          return 's' + (item['打孔上限'] ? item['打孔上限'] : 0) + '拳, ' +  's' + (item['打孔上限'] ? item['打孔上限'] : 0) + 'グラブ';
        default:
          return '';
      }
    }).join(', ');
  }

}
