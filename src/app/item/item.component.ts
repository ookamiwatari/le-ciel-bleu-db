import { OnInit, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import itemList from '../../assets/json/item.json';
import dropList from '../../assets/json/drop.json';
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
  selector: 'item',
  styleUrls: ['item.component.css'],
  templateUrl: 'item.component.html',
})
export class ItemComponent implements OnInit {

  id: any;
  item: any;
  drops: any;

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
    console.log('drops', this.drops);
  }

}
