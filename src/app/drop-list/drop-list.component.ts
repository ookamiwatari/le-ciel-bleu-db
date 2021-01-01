import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';

import itemList from '../../assets/json/item.json';
import dropList from '../../assets/json/drop.json';
import monsterList from '../../assets/json/monster.json';

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
  liteItemList: any[];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private router: Router
  ) {
    // Assign the data to the data source for the table to render
    this.dataSource = new MatTableDataSource();
    this.liteItemList = itemList.root['道具'].map((item: any) => { return { id: item['_編號'], name: item['_基本名稱'] } });
    document.getElementsByTagName('mat-sidenav-content')[0].scrollTo(0, 0);
  }

  ngAfterViewInit() {
    const datas = dropList.root.drop.filter((drop: any) => {
      return typeof drop !== 'string' && drop['_編號']
    }).map((drop: any) => {
      const monster = monsterList.root.npc.find((monster: any) => {
        return monster['_編號'] === drop['_編號'];
      });
      return {
        id: drop['_編號'],
        name: monster && monster['_名稱'] ? monster['_名稱'] : drop['_怪物名稱'],
        count: drop['_個數'],
        description: this.generateDropTxt(drop)
      }
    });
    for (const data of datas) {
      this.dataSource.data.push(data);
    }
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  private generateDropTxt(drop: any) {
    const drops = [];
    for (let i = 1; i <= 40; i++) {
      if (drop['_item'+i]) drops.push({ id: drop['_item'+i], count: drop['_count'+i]});
    }
    return drops.map((d) => {
      if (d.id === '2224') return '焼きカボチャの種(未実装)' + (d.count !== '1' ? 'x' + d.count : '');
      if (d.id === '2225') return 'りんご飴(未実装)' + (d.count !== '1' ? 'x' + d.count : '');
      if (7000 < +d.id && +d.id < 7209) return 'ペットスキルカード' + d.id + '(未実装)' + (d.count !== '1' ? 'x' + d.count : '');
      if (10701 < +d.id && +d.id < 10750) return 'レヴェイエ' + d.id + '(未実装)' + (d.count !== '1' ? 'x' + d.count : '');
      if (31251 < +d.id && +d.id < 31287) return '本国用アイテム' + d.id + '(未実装)' + (d.count !== '1' ? 'x' + d.count : '');
      if (d.id === '10857') return 'アシストメダル(未実装)' + (d.count !== '1' ? 'x' + d.count : '');
      if (d.id === '20061') return '翡翠魂魄(未実装)' + (d.count !== '1' ? 'x' + d.count : '');
      if (d.id === '20062') return '淡紅魂魄(未実装)' + (d.count !== '1' ? 'x' + d.count : '');
      if (d.id === '20063') return '青藍魂魄(未実装)' + (d.count !== '1' ? 'x' + d.count : '');
      if (d.id === '20064') return '黄色魂魄(未実装)' + (d.count !== '1' ? 'x' + d.count : '');
      if (d.id === '20065') return '紫烏魂魄(未実装)' + (d.count !== '1' ? 'x' + d.count : '');
      return this.liteItemList.find((i) => i.id === d.id).name + (d.count !== '1' ? 'x' + d.count : '');
    }).join(', ');
  }

  private clickRow(event: MouseEvent, row: any) {
    if (event.view?.getSelection()?.type !== 'Caret') return;
    this.router.navigate(['/drop/' + row.id]);
  }
}
