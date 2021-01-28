import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';

import monsterList from '../../assets/json/monster.json';
import pickupList from '../../assets/json/pickup.json';

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
  input: string = '';
  pickups: any;
  pickup: string = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private router: Router
  ) {
    // Assign the data to the data source for the table to render
    this.dataSource = new MatTableDataSource();
    this.pickups = pickupList.monsters;
    document.getElementsByTagName('mat-sidenav-content')[0].scrollTo(0, 0);
  }

  ngAfterViewInit() {
    const datas = monsterList.root.npc.filter((monster: any) => {
      return typeof monster !== 'string' && monster['編號']
    }).map((monster: any) => {
      return {
        id: monster['編號'],
        name: monster['名稱'],
        lv: monster['等級'],
        type: monster['系別'],
        description: monster['圖鑑說明'],
        memo: pickupList.monsters.filter((pickup) => pickup.ids.find(id => id === +monster['編號'])).map(pickup => pickup.version).join(', ')
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

  clickRow(event: MouseEvent, row: any) {
    if (event.view?.getSelection()?.type !== 'Caret') return;
    this.router.navigate(['/monster/' + row.id]);
  }
}
