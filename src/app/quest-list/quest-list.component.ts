import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';

import questList from '../../assets/json/quest.json';
import questSteplistList from '../../assets/json/quest_steplist.json';
import questStepinfoList from '../../assets/json/quest_stepinfo.json';
import pickupList from '../../assets/json/pickup.json';

export interface ItemData {
  id: number;
  name: string;
  lv: number;
  lexp: number;
  premise: string;
  infos: string;
}

/**
 * @title Data table with sorting, pagination, and filtering.
 */
@Component({
  selector: 'quest-list',
  styleUrls: ['quest-list.component.css'],
  templateUrl: 'quest-list.component.html',
})
export class QuestListComponent implements AfterViewInit {
  displayedColumns: string[] = ['id', 'name', 'lv', 'lexp', 'premise', 'infos'];
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
    this.pickups = pickupList.quests;
    document.getElementsByTagName('mat-sidenav-content')[0].scrollTo(0, 0);
  }

  ngAfterViewInit() {
    const datas = questList.root['任務'].map((quest: any) => {
      return {
        id: quest['_編號'],
        name: quest['_任務名稱'],
        lv: quest['_等級限制'],
        lexp: quest['_任務評價'],
        premise: questList.root['任務'].find((_quest) => _quest['_編號'] === quest['_前置任務'])['_任務名稱'],
        infos: this.getQuestInfos(quest),
        memo: pickupList.quests.filter((pickup) => pickup.ids.find(id => id === +quest['_編號'])).map(pickup => pickup.version).join(', ')
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

  getQuestInfos (quest: any) {
    let infos = [];
    for (let i = 1; i < 9; i++) {
      if (quest['_導引0'+i]) {
        const steplist: any = questSteplistList.root['列表'].find((steplist: any) => steplist['_編號'] === quest['_導引0'+i]);
        for (let j = 1; j < 6; j++) {
          if (steplist && steplist['_item'+j]) {
            const stepinfo: any = questStepinfoList.root.info.find((stepinfo: any) => stepinfo['_編號'] === steplist['_item'+j]);
            if (stepinfo['_位置查表'] === '物品') infos.push(stepinfo['_說明'] + (+stepinfo['_需求數量'] > 1 ? 'x' + stepinfo['_需求數量'] : ''));
          }
        }
      }
    }
    return [...new Set(infos)].join('\n');
  }

  clickRow(event: MouseEvent, row: any) {
    if (event.view?.getSelection()?.type !== 'Caret') return;
    this.router.navigate(['/quest/' + row.id]);
  }
}
