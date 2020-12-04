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
    if( !drop || !id || +id > 4214) return;
    const drops = [];
    for (let i = 1; i <= 40; i++) {
      if (drop['_item'+i]) drops.push({ id: drop['_item'+i], count: drop['_count'+i]});
    }
    this.items = drops.map((d: any) => {
      let item = itemList.root['道具'].find((item) => item['_編號'] === d.id);
      if (!item) {
        if (d.id === '2224') item = { '_基本名稱': '焼きカボチャの種' , '_說明定義': '未実装' };
        if (d.id === '2225') item = { '_基本名稱': 'りんご飴' , '_說明定義': '未実装' };
        if (7000 < +d.id && +d.id < 7209) item = { '_基本名稱': 'ペットスキルカード' + d.id , '_說明定義': '未実装' };
        if (10701 < +d.id && +d.id < 10750) item = { '_基本名稱': 'レヴェイエ' + d.id , '_說明定義': '未実装' };
        if (31251 < +d.id && +d.id < 31287) item = { '_基本名稱': '本国用アイテム' + d.id , '_說明定義': '未実装' };
        if (d.id === '10857') item = { '_基本名稱': 'アシストメダル' , '_說明定義': '未実装' };
        if (d.id === '20061') item = { '_基本名稱': '翡翠魂魄' , '_說明定義': '未実装' };
        if (d.id === '20062') item = { '_基本名稱': '淡紅魂魄' , '_說明定義': '未実装' };
        if (d.id === '20063') item = { '_基本名稱': '青藍魂魄' , '_說明定義': '未実装' };
        if (d.id === '20064') item = { '_基本名稱': '黄色魂魄' , '_說明定義': '未実装' };
        if (d.id === '20065') item = { '_基本名稱': '紫烏魂魄' , '_說明定義': '未実装' };
      }
      return {
        id: d.id,
        name: item['_基本名稱'],
        count: d.count,
        description:item['_說明定義']
      };
    })
  }

}
