import { AfterViewInit, OnInit, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';


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
  selector: 'monster',
  styleUrls: ['monster.component.css'],
  templateUrl: 'monster.component.html',
})
export class MonsterComponent implements OnInit {

  items: any;
  monster: any;

  constructor(
    private route: ActivatedRoute
  ) { }

  ngOnInit () {
    const id = this.route.snapshot.paramMap.get('id');
    this.monster = monsterList.root.npc.find((item: any) => { return item['_編號'] === id; });
    if (!this.monster) return;
    const drop: any = dropList.root.drop.find((d: any) => {
      return d['_編號'] === this.monster['_編號'];
    });
    if( !id || +id > 4214) return;
    const drops = [];
    for (let i = 1; i <= 40; i++) {
      if (drop['_item'+i]) drops.push({ id: drop['_item'+i], count: drop['_count'+i]});
    }
    this.items = drops.map((d: any) => {
      const item = itemList.root['道具'].find((item) => item['_編號'] === d.id);
      return {
        id: d.id,
        name: item['_基本名稱'],
        count: d.count,
        description:item['_說明定義']
      };
    })
  }

}
