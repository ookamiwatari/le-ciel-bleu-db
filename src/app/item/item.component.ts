import { OnInit, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import itemList from '../../assets/json/item.json';
import dropList from '../../assets/json/drop.json';
import monsterList from '../../assets/json/monster.json';
import questList from '../../assets/json/quest.json';
import questSteplistList from '../../assets/json/quest_steplist.json';
import questStepinfoList from '../../assets/json/quest_stepinfo.json';


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
  selector: 'item',
  styleUrls: ['item.component.css'],
  templateUrl: 'item.component.html',
})
export class ItemComponent implements OnInit {

  id: any;
  item: any;
  drops: any;
  infos: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
  ) {
    document.getElementsByTagName('mat-sidenav-content')[0].scrollTo(0, 0);
  }

  ngOnInit () {
    this.id = this.route.snapshot.paramMap.get('id');
    this.item = itemList.root['道具'].find((item: any) => { return item['_編號'] === this.id; });
    this.drops = dropList.root.drop.filter((drop: any) => {
      for (let i = 1; i <= 40; i++) {
        const d = drop['_item'+i];
        if (d && d === this.id) return true;
      }
      return false;
    }).map((drop: any) => {
      const monster = monsterList.root.npc.find((monster: any) => { return monster['_編號'] === drop['_編號']});
      if (!monster || +drop['_編號'] > 4213 ) return { type: 'drop', data: drop }
      return { type: 'monster', data: monster };
    });

    console.log('itemname', this.item['_基本名稱']);

    this.infos = questStepinfoList.root.info.filter((info: any) => {
      return info['_位置查表'] === '物品' && info['_目標編號'] === this.item['_編號'];
    }).map((info: any) => {
      return {
        steps: questSteplistList.root['列表'].filter((steplist: any) => {
          if (steplist['_item1'] && steplist['_item1'] === info['_編號']) return true;
          if (steplist['_item2'] && steplist['_item2'] === info['_編號']) return true;
          if (steplist['_item3'] && steplist['_item3'] === info['_編號']) return true;
          if (steplist['_item4'] && steplist['_item4'] === info['_編號']) return true;
          if (steplist['_item5'] && steplist['_item5'] === info['_編號']) return true;
          return false;
        }).map((steplist: any) => {
          return questList.root['任務'].filter((quest) => {
            if (quest['_導引00'] && quest['_導引00'] === steplist['_編號']) return true;
            if (quest['_導引01'] && quest['_導引01'] === steplist['_編號']) return true;
            if (quest['_導引02'] && quest['_導引02'] === steplist['_編號']) return true;
            if (quest['_導引03'] && quest['_導引03'] === steplist['_編號']) return true;
            if (quest['_導引04'] && quest['_導引04'] === steplist['_編號']) return true;
            if (quest['_導引05'] && quest['_導引05'] === steplist['_編號']) return true;
            if (quest['_導引06'] && quest['_導引06'] === steplist['_編號']) return true;
            if (quest['_導引07'] && quest['_導引07'] === steplist['_編號']) return true;
            if (quest['_導引08'] && quest['_導引08'] === steplist['_編號']) return true;
            return false;
          });
        }),
        count: info['_需求數量']
      };
    });

    console.log('infos', this.infos);

    console.log('drops', this.drops);
  }

}
