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
    this.item = itemList.root['道具'].find((item: any) => { return item['編號'] === this.id; });
    this.drops = dropList.root.drop.filter((drop: any) => {
      for (let i = 1; i <= 40; i++) {
        const d = drop['item'+i];
        if (d && d === this.id) return true;
      }
      return false;
    }).map((drop: any) => {
      const monster = monsterList.root.npc.find((monster: any) => { return monster['編號'] === drop['編號']});
      if (!monster || +drop['編號'] > 4213 ) return { type: 'drop', data: drop }
      return { type: 'monster', data: monster };
    });

    console.log('itemname', this.item['基本名稱']);

    this.infos = questStepinfoList.root.info.filter((info: any) => {
      return info['位置查表'] === '物品' && info['目標編號'] === this.item['編號'];
    }).map((info: any) => {
      return {
        steps: questSteplistList.root['列表'].filter((steplist: any) => {
          if (steplist['item1'] && steplist['item1'] === info['編號']) return true;
          if (steplist['item2'] && steplist['item2'] === info['編號']) return true;
          if (steplist['item3'] && steplist['item3'] === info['編號']) return true;
          if (steplist['item4'] && steplist['item4'] === info['編號']) return true;
          if (steplist['item5'] && steplist['item5'] === info['編號']) return true;
          return false;
        }).map((steplist: any) => {
          return questList.root['任務'].filter((quest: any) => {
            if (quest['導引00'] && quest['導引00'] === steplist['編號']) return true;
            if (quest['導引01'] && quest['導引01'] === steplist['編號']) return true;
            if (quest['導引02'] && quest['導引02'] === steplist['編號']) return true;
            if (quest['導引03'] && quest['導引03'] === steplist['編號']) return true;
            if (quest['導引04'] && quest['導引04'] === steplist['編號']) return true;
            if (quest['導引05'] && quest['導引05'] === steplist['編號']) return true;
            if (quest['導引06'] && quest['導引06'] === steplist['編號']) return true;
            if (quest['導引07'] && quest['導引07'] === steplist['編號']) return true;
            if (quest['導引08'] && quest['導引08'] === steplist['編號']) return true;
            return false;
          });
        }),
        count: info['需求數量']
      };
    });

    console.log('infos', this.infos);

    console.log('drops', this.drops);
  }

}
