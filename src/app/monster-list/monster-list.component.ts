import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';

import monsterList from '../../assets/json/monster.json';

export interface ItemData {
  id: number;
  name: string;
  type: string
  description: string;
}

/**
 * @title Data table with sorting, pagination, and filtering.
 */
@Component({
  selector: 'monster-list',
  styleUrls: ['monster-list.component.css'],
  templateUrl: 'monster-list.component.html',
})
export class MonsterListComponent implements AfterViewInit {
  displayedColumns: string[] = ['id', 'name', 'lv', 'type', 'description'];
  dataSource: MatTableDataSource<ItemData>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor() {
    // Assign the data to the data source for the table to render
    this.dataSource = new MatTableDataSource();
  }

  ngAfterViewInit() {
    const datas = monsterList.root.npc.filter((monster: any) => {
      return typeof monster !== 'string' && monster['_編號']
    }).map((monster: any) => {
      return {
        id: monster['_編號'],
        name: monster['_名稱'],
        lv: monster['_等級'],
        type: monster['_系別'],
        description: monster['_圖鑑說明'],
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
}
