import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';

import itemList from '../../assets/json/item.json';

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
  selector: 'item-list',
  styleUrls: ['item-list.component.css'],
  templateUrl: 'item-list.component.html',
})
export class ItemListComponent implements AfterViewInit {
  displayedColumns: string[] = ['id', 'name', 'type', 'description'];
  dataSource: MatTableDataSource<ItemData>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private router: Router
  ) {
    // Assign the data to the data source for the table to render
    this.dataSource = new MatTableDataSource();
    document.getElementsByTagName('mat-sidenav-content')[0].scrollTo(0, 0);
  }

  ngAfterViewInit() {
    const datas = itemList.root['道具'].filter((item: any) => {
      return typeof item !== 'string' && item['_基本名稱']
    }).map((item: any) => {
      let addDescription = '';
      if (item['_物品類別'] === '寶石') {
        if (item['_動態資料1'] === '0') {
          addDescription += '部位: 頭　';
        } else if (item['_動態資料1'] === '1'){
          addDescription += '部位: 顔　';
        } else if (item['_動態資料1'] === '2'){
          addDescription += '部位: 武器　';
        } else if (item['_動態資料1'] === '3'){
          addDescription += '部位: 腕　';
        } else if (item['_動態資料1'] === '4'){
          addDescription += '部位: 胴　';
        } else if (item['_動態資料1'] === '5'){
          addDescription += '部位: 背　';
        } else if (item['_動態資料1'] === '6'){
          addDescription += '部位: 足　';
        } else if (item['_動態資料1'] === '7'){
          addDescription += '部位: アクセ　';
        }
        if (item['_動態資料2']) {
          addDescription += `安定度: ${+item['_動態資料2'] / 10}　`;
        }
      }
      return {
        id: item['_編號'],
        name: item['_基本名稱'],
        type: item['_物品類別'],
        description: item['_說明定義'] ? addDescription + item['_說明定義'] : ''
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

  private clickRow(event: MouseEvent, row: any) {
    if (event.view?.getSelection()?.type !== 'Caret') return;
    this.router.navigate(['/drop/' + row.id]);
  }
}
