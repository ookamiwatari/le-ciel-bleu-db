import { OnInit, Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import itemList from '../../assets/json/item.json';
import dropList from '../../assets/json/drop.json';
import servDropList from '../../assets/json/serv_drop.json';
import questList from '../../assets/json/quest.json';


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
  selector: 'drop',
  styleUrls: ['drop.component.css'],
  templateUrl: 'drop.component.html',
})
export class DropComponent implements OnInit {

  id: any;
  items: any = [];
  prob!: number;
  adv_items: any = [];
  drop: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {
    document.getElementsByTagName('mat-sidenav-content')[0].scrollTo(0, 0);
  }

  ngOnInit () {
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.isMatchServeDrop(this.id)) {
      this.drop = servDropList.root.drop.find((drop: any) => drop['_編號'] === this.id);
    } else {
      this.drop = dropList.root.drop.find((drop: any) => drop['_編號'] === this.id);
    }
    const factor = +this.drop['_factor'];
    const adv_factor = +this.drop['_adv_factor'];
    let sum_prob = 0;
    for (let i = 1; i <= 20; i++) {
      const id = this.drop['_item'+i];
      if (!id) continue;
      const item = itemList.root['道具'].find((item: any) => { return item['_編號'] === id; });
      const count = this.drop['_count'+i];
      const prob = +this.drop['_prob'+i];
      sum_prob += prob;
      if (item) {
        this.items.push({ id: item['_編號'], name: item['_基本名稱'], count: count, description: item['_說明定義'], prob: factor && prob ? prob * 100 / factor : undefined });
      } else {
        if (id === '2224') this.items.push({ name: '焼きカボチャの種', count: count, description: '未実装', prob: factor && prob ? prob * 100 / factor : undefined});
        if (id === '2225') this.items.push({ name: 'りんご飴', count: count, description: '未実装', prob: factor && prob ? prob * 100 / factor : undefined});
        if (7000 < +id && +id < 7209) this.items.push({ name: 'ペットスキルカード', count: count, description: '未実装', prob: factor && prob ? prob * 100 / factor : undefined});
        if (10701 < +id && +id < 10750) this.items.push({ name: 'レヴェイエ', count: count, description: '未実装', prob: factor && prob ? prob * 100 / factor : undefined});
        if (31251 < +id && +id < 31287) this.items.push({ name: '本国用アイテム', count: count, description: '未実装', prob: factor && prob ? prob * 100 / factor : undefined});
        if (id === '10857') this.items.push({ name: 'アシストメダル', count: count, description: '未実装', prob: factor && prob ? prob * 100 / factor : undefined});
        if (id === '20061') this.items.push({ name: '翡翠魂魄', count: count, description: '未実装', prob: factor && prob ? prob * 100 / factor : undefined});
        if (id === '20062') this.items.push({ name: '淡紅魂魄', count: count, description: '未実装', prob: factor && prob ? prob * 100 / factor : undefined});
        if (id === '20063') this.items.push({ name: '青藍魂魄', count: count, description: '未実装', prob: factor && prob ? prob * 100 / factor : undefined});
        if (id === '20064') this.items.push({ name: '黄色魂魄', count: count, description: '未実装', prob: factor && prob ? prob * 100 / factor : undefined});
        if (id === '20065') this.items.push({ name: '紫烏魂魄', count: count, description: '未実装', prob: factor && prob ? prob * 100 / factor : undefined});
      }
    }
    this.prob = sum_prob * 100 / factor;
    for (let i = 21; i <= 40; i++) {
      const id = this.drop['_item'+i];
      if (!id) continue;
      const item = itemList.root['道具'].find((item: any) => { return item['_編號'] === id; });
      const quest = questList.root['任務'].find((quest: any) => { return quest['_編號'] === this.drop['_quest'+(i-20)] })
      const count = this.drop['_count'+i];
      const prob = +this.drop['_prob'+i];
      if (item) {
        this.adv_items.push({ id: item['_編號'], name: item['_基本名稱'], count: count, description: item['_說明定義'], prob: adv_factor && prob ? prob * 100 / adv_factor : undefined, quest: quest['_任務名稱'] });
      } else {
        if (id === '2224') this.adv_items.push({ name: '焼きカボチャの種', count: count, description: '未実装', prob: adv_factor && prob ? prob * 100 / adv_factor : undefined, quest: quest['_任務名稱'] });
        if (id === '2225') this.adv_items.push({ name: 'りんご飴', count: count, description: '未実装', prob: adv_factor && prob ? prob * 100 / adv_factor : undefined, quest: quest['_任務名稱'] });
        if (7000 < +id && +id < 7209) this.adv_items.push({ name: 'ペットスキルカード', count: count, description: '未実装', prob: adv_factor && prob ? prob * 100 / adv_factor : undefined, quest: quest['_任務名稱'] });
        if (10701 < +id && +id < 10750) this.adv_items.push({ name: 'レヴェイエ', count: count, description: '未実装', prob: adv_factor && prob ? prob * 100 / adv_factor : undefined, quest: quest['_任務名稱'] });
        if (31251 < +id && +id < 31287) this.adv_items.push({ name: '本国用アイテム', count: count, description: '未実装', prob: adv_factor && prob ? prob * 100 / adv_factor : undefined, quest: quest['_任務名稱'] });
        if (id === '10857') this.adv_items.push({ name: 'アシストメダル', count: count, description: '未実装', prob: adv_factor && prob ? prob * 100 / adv_factor : undefined, quest: quest['_任務名稱'] });
        if (id === '20061') this.adv_items.push({ name: '翡翠魂魄', count: count, description: '未実装', prob: adv_factor && prob ? prob * 100 / adv_factor : undefined, quest: quest['_任務名稱'] });
        if (id === '20062') this.adv_items.push({ name: '淡紅魂魄', count: count, description: '未実装', prob: adv_factor && prob ? prob * 100 / adv_factor : undefined, quest: quest['_任務名稱'] });
        if (id === '20063') this.adv_items.push({ name: '青藍魂魄', count: count, description: '未実装', prob: adv_factor && prob ? prob * 100 / adv_factor : undefined, quest: quest['_任務名稱'] });
        if (id === '20064') this.adv_items.push({ name: '黄色魂魄', count: count, description: '未実装', prob: adv_factor && prob ? prob * 100 / adv_factor : undefined, quest: quest['_任務名稱'] });
        if (id === '20065') this.adv_items.push({ name: '紫烏魂魄', count: count, description: '未実装', prob: adv_factor && prob ? prob * 100 / adv_factor : undefined, quest: quest['_任務名稱'] });
      }
    }
    console.log('items', this.items);
  }

  isMatchServeDrop (id: number) {
    const drop = dropList.root.drop.find((drop: any) => drop['_編號'] === id);
    const serv_drop = servDropList.root.drop.find((drop: any) => drop['_編號'] === id);
    if (!drop || !serv_drop) return false;
    for (let i = 1; i <= 40; i++) {
      if (drop['_item'+i] !== serv_drop['_item'+i]) return false;
      if (drop['_count'+i] !== serv_drop['_count'+i]) return false;
    }
    return true;
  }

  private clickItem(event: MouseEvent, item: any) {
    if (event.view?.getSelection()?.type !== 'Caret') return;
    this.router.navigate(['/item/' + item.id]);
  }
}
