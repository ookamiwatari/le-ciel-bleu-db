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
  ) {
    document.getElementsByTagName('mat-sidenav-content')[0].scrollTo(0, 0);
  }

  ngOnInit () {
    const id = this.route.snapshot.paramMap.get('id');
    this.monster = monsterList.root.npc.find((item: any) => { return item['_編號'] === id; });
    if (!this.monster) return;
    const drop: any = dropList.root.drop.find((d: any) => {
      return d['_編號'] === this.monster['_編號'];
    });
    if( !drop || !id || +id > 4214) return;
    const drops = [];
    for (let i = 1; i <= 40; i++) {
      if (drop['_item'+i]) drops.push({ id: drop['_item'+i], count: drop['_count'+i]});
    }
    this.items = drops.map((d: any) => {
      let item = itemList.root['道具'].find((item) => item['_編號'] === d.id);
      if (item) {
        return { id: d.id, name: item['_基本名稱'], count: d.count, description: item['_說明定義'] };
      } else {
        if (d.id === '2224') return { name: '焼きカボチャの種', count: d.count, description: '未実装' }
        if (d.id === '2225') return { name: 'りんご飴', count: d.count, description: '未実装' }
        if (7000 < +d.id && +d.id < 7209) return { name: 'ペットスキルカード' + d.id, count: d.count, description: '未実装' }
        if (10701 < +d.id && +d.id < 10750) return { name: 'レヴェイエ' + d.id, count: d.count, description: '未実装' }
        if (31251 < +d.id && +d.id < 31287) return { name: '本国用アイテム' + d.id, count: d.count, description: '未実装' }
        if (d.id === '10857') return { name: 'アシストメダル', count: d.count, description: '未実装' }
        if (d.id === '20061') return { name: '翡翠魂魄', count: d.count, description: '未実装' }
        if (d.id === '20062') return { name: '淡紅魂魄', count: d.count, description: '未実装' }
        if (d.id === '20063') return { name: '青藍魂魄', count: d.count, description: '未実装' }
        if (d.id === '20064') return { name: '黄色魂魄', count: d.count, description: '未実装' }
        if (d.id === '20065') return { name: '紫烏魂魄', count: d.count, description: '未実装' }
        return {};
      }
    })
  }

}
