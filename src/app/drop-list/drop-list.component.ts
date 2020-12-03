import {AfterViewInit, Component, ViewChild} from '@angular/core';
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

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor() {
    // Assign the data to the data source for the table to render
    this.dataSource = new MatTableDataSource();
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
    let txt = '';
    for (let i = 1; i <= 40; i++) {
      if (drop['_item'+i]) {
        txt += itemList.root['道具'].find((item: any) => { return item['_編號'] === drop['_item'+i]; })['_基本名稱'];
        if (+drop['_count'+i] > 1) {
          txt += 'x'
          txt += drop['_count'+i];
        }
        txt += ', ';
      }
    }
    if (txt != '') {
      return txt.substr( 0, txt.length - 2 )
    }
    return '';
  }
}
