import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';

import magicList from '../../assets/json/magic.json';

export interface MagicData {
  id: number;
  name: string;
  class: string;
  description: string;
}

const classes: any = {
  '職業1號': '冒険者',
  '職業2號': 'ソードマン',
  '職業3號': 'アーチャー',
  '職業4號': 'マジシャン',
  '職業5號': 'ヒーラー',
  '職業6號': 'アサシン',
  '職業7號': 'ワンダラー',
  '職業8號': 'ブレイバー',
  '職業9號': 'スカウター',
  '職業10號': 'マギウス',
  '職業11號': 'プリースト',
  '職業12號': 'オプスキュリテ',
  '職業13號': 'マジックナイト',
  '職業14號': '？？？',
  '職業15號': 'ガンスリンガー',
  '職業16號': 'メイド/バトラー',
  '職業17號': '？？？',
  '職業18號': 'エクスマスター',
  '職業19號': 'エリュシオン',
  '職業20號': '？？？',
  '職業21號': 'フライシュッツ',
  '職業22號': 'メイドチーフ/チーフバトラー',
  '職業23號': '？？？',
  '職業24號': 'ゼロスリュクス/アヴィルネス',
  '職業25號': 'リブラギアス',
  '職業26號': 'ヴァルアモス',
  '職業27號': 'アンクノワール',
  '職業28號': 'クレアブランシュ',
  '職業29號': 'リアニムス',
  '職業30號': 'ミロディア',
  '職業31號': 'メリオネティオ',
  '職業32號': 'アスティロギア',
}

/**
 * @title Data table with sorting, pagination, and filtering.
 */
@Component({
  selector: 'magic-list',
  styleUrls: ['magic-list.component.css'],
  templateUrl: 'magic-list.component.html',
})
export class MagicListComponent implements AfterViewInit {
  displayedColumns: string[] = ['id', 'name', 'class', 'description'];
  dataSource: MatTableDataSource<MagicData>;

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
    const datas = magicList.root['法術'].filter((magic: any) => {
      return typeof magic !== 'string' && magic['_編號']
    }).map((magic: any) => {
      let class_string = '';
      if (magic['_可學職業1'] && classes[magic['_可學職業1']]) class_string += classes[magic['_可學職業1']];
      if (magic['_可學職業2'] && classes[magic['_可學職業2']]) class_string += '・' + classes[magic['_可學職業2']];
      return {
        id: magic['_編號'],
        name: magic['_名稱'],
        class: class_string,
        description: magic['_說明']
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
