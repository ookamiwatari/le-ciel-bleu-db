import { AfterViewInit, OnInit, Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import itemList from '../../assets/json/item.json';
import questList from '../../assets/json/quest.json';
import questSteplistList from '../../assets/json/quest_steplist.json';
import questStepinfoList from '../../assets/json/quest_stepinfo.json';

/**
 * @title Data table with sorting, pagination, and filtering.
 */
@Component({
  selector: 'quest',
  styleUrls: ['quest.component.css'],
  templateUrl: 'quest.component.html',
})
export class QuestComponent implements OnInit {

  quest: any;
  premise1: any;
  premise2: any;
  item1?: string;
  item2?: string;
  item3?: string;
  item4?: string;
  item5?: string;
  item6?: string;
  steps: any = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {
    document.getElementsByTagName('mat-sidenav-content')[0].scrollTo(0, 0);
  }

  ngOnInit () {
    const id: any = this.route.snapshot.paramMap.get('id');
    this.quest = questList.root['任務'].find((quest: any) => { return quest['編號'] === id; });
    console.log('quest', this.quest);
    if (!this.quest) return;
    if (this.quest['item1']) this.item1 = itemList.root['道具'].find((item: any) => item['編號'] === this.quest['item1'])['基本名稱'] + (+this.quest['count1'] > 1 ? 'x' + this.quest['count1'] : '');
    if (this.quest['item2']) this.item2 = itemList.root['道具'].find((item: any) => item['編號'] === this.quest['item2'])['基本名稱'] + (+this.quest['count1'] > 1 ? 'x' + this.quest['count2'] : '');
    if (this.quest['item3']) this.item3 = itemList.root['道具'].find((item: any) => item['編號'] === this.quest['item3'])['基本名稱'] + (+this.quest['count1'] > 1 ? 'x' + this.quest['count3'] : '');
    if (this.quest['item4']) this.item4 = itemList.root['道具'].find((item: any) => item['編號'] === this.quest['item4'])['基本名稱'] + (+this.quest['count1'] > 1 ? 'x' + this.quest['count4'] : '');
    if (this.quest['item5']) this.item5 = itemList.root['道具'].find((item: any) => item['編號'] === this.quest['item5'])['基本名稱'] + (+this.quest['count1'] > 1 ? 'x' + this.quest['count5'] : '');
    if (this.quest['前置任務']) this.premise1 = questList.root['任務'].find((quest: any) => { return quest['編號'] === this.quest['前置任務']; });
    if (this.quest['前置任務2']) this.premise2 = questList.root['任務'].find((quest: any) => { return quest['編號'] === this.quest['前置任務']; });
    for (let i = 0; i < 9; i++) {
      if (!this.quest['地點0'+i]) continue;
      const steplist: any = questSteplistList.root['列表'].find((steplist: any) => steplist['編號'] === this.quest['導引0'+i]);
      const trace = [];
      for (let j = 1; j < 6; j++) {
        if (!steplist || !steplist['item'+j]) continue;
        const stepinfo: any = questStepinfoList.root.info.find((stepinfo: any) => stepinfo['編號'] === steplist['item'+j]);
        trace.push(stepinfo);
      }
      const step = {
        area: this.quest['地點0'+i],
        step: this.quest['步驟0'+i],
        begin: this.quest['承接0'+i],
        trace
      };
      this.steps.push(step);
    }
    console.log('steps', this.steps);
  }

  clickItem(event: MouseEvent, info: any) {
    if (event.view?.getSelection()?.type !== 'Caret') return;
    this.router.navigate(['/item/' + info['目標編號']]);
  }

}
