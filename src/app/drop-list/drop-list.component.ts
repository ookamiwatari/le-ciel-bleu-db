import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';

import itemList from '../../assets/json/item.json';
import dropList from '../../assets/json/drop.json';
import monsterList from '../../assets/json/monster.json';
import pickupList from '../../assets/json/pickup.json';

export interface DropData {
  id: number;
  name: string;
  count: number;
  description: string;
}

/**
 * @title Data table with sorting, pagination, and filtering.
 */
@Component({
  selector: 'drop-list',
  styleUrls: ['drop-list.component.css'],
  templateUrl: 'drop-list.component.html',
})
export class DropListComponent implements AfterViewInit {
  displayedColumns: string[] = ['id', 'name', 'count', 'description'];
  dataSource: MatTableDataSource<DropData>;
  input: string = '';
  pickups: any;
  pickup: string = '';
  liteItemList: any[];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private router: Router
  ) {
    // Assign the data to the data source for the table to render
    this.dataSource = new MatTableDataSource();
    this.pickups = pickupList.drops;
    document.getElementsByTagName('mat-sidenav-content')[0].scrollTo(0, 0);
    this.liteItemList = itemList.root['道具'].map((item: any) => { return { id: item['編號'], name: item['基本名稱'] } });
  }

  ngAfterViewInit() {
    const datas = dropList.root.drop.filter((drop: any) => {
      return typeof drop !== 'string' && drop['編號']
    }).map((drop: any) => {
      const monster = monsterList.root.npc.find((monster: any) => {
        return monster['編號'] === drop['編號'];
      });
      return {
        id: drop['編號'],
        name: +drop['編號'] < 4214 && monster && monster['名稱'] ? monster['名稱'] : drop['怪物名稱'],
        count: drop['個數'],
        description: this.generateDropTxt(drop),
        memo: pickupList.drops.filter((pickup) => pickup.ids.find(id => id === +drop['編號'])).map(pickup => pickup.version).join(', ')
      }
    });
    for (const data of datas) {
      this.dataSource.data.push(data);
    }
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter() {
    const filterValue = this.pickup !== '' ?  this.pickup : this.input;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  private generateDropTxt(drop: any) {
    const drops = [];
    for (let i = 1; i <= 40; i++) {
      if (drop['item'+i]) drops.push({ id: drop['item'+i], count: drop['count'+i]});
    }
    return drops.map((d) => {
      const item = this.liteItemList.find((i) => i.id === d.id);
      if (item) return item.name + (d.count !== '1' ? 'x' + d.count : '');
      if (d.id === '2224') return '焼きカボチャの種(未実装)' + (d.count !== '1' ? 'x' + d.count : '');
      if (d.id === '2225') return 'りんご飴(未実装)' + (d.count !== '1' ? 'x' + d.count : '');
      if (d.id === '20250') return '黒色火薬' + (d.count !== '1' ? 'x' + d.count : '');
      if (d.id === '20251') return '白色宝玉' + (d.count !== '1' ? 'x' + d.count : '');
      if (10701 < +d.id && +d.id < 10750) return 'レヴェイエ' + d.id + '(未実装)' + (d.count !== '1' ? 'x' + d.count : '');
      if (31251 < +d.id && +d.id < 31287) return '本国用アイテム' + d.id + '(未実装)' + (d.count !== '1' ? 'x' + d.count : '');
      if (d.id === '10857') return 'アシストメダル(未実装)' + (d.count !== '1' ? 'x' + d.count : '');
      return '不明なアイテム' + (d.count !== '1' ? 'x' + d.count : '');
    }).join(', ');
  }

  clickRow(event: MouseEvent, row: any) {
    if (event.view?.getSelection()?.type !== 'Caret') return;
    if (row.id < 4214) {
      this.router.navigate(['/monster/' + row.id]);
    } else {
      this.router.navigate(['/drop/' + row.id]);
    }
  }
}
