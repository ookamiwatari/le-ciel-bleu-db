import { OnInit, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import itemList from '../../assets/json/item.json';
import monsterList from '../../assets/json/monster.json';
import magicList from '../../assets/json/magic.json';

export interface ItemData {
  id: number;
  name: string;
  type: string
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
  selector: 'magic',
  styleUrls: ['magic.component.css'],
  templateUrl: 'magic.component.html',
})
export class MagicComponent implements OnInit {

  id: any;
  magic: any;
  items: any;
  monsters: any;
  class!: string;

  constructor(
    private route: ActivatedRoute,
  ) {
    document.getElementsByTagName('mat-sidenav-content')[0].scrollTo(0, 0);
  }

  ngOnInit () {
    this.id = this.route.snapshot.paramMap.get('id');
    this.magic = magicList.root.heromagic.find((magic: any) => { return magic['編號'] === this.id });
    this.items = itemList.root['道具'].filter((item: any) => { return item['常駐法術'] === this.id; });
    this.monsters = monsterList.root.npc.filter((monster: any) => { return monster['攻擊法術1'] == this.id || monster['攻擊法術2'] == this.id ||monster['攻擊法術3'] == this.id ||monster['攻擊法術4'] == this.id })
    if (this.magic['可學職業1'] && classes[this.magic['可學職業1']]) this.class = classes[this.magic['可學職業1']];
    if (this.magic['可學職業2'] && classes[this.magic['可學職業2']]) this.class += '・' + classes[this.magic['可學職業2']];
  }

}
