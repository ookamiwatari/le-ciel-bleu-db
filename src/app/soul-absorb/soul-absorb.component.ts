import { OnInit, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormControl } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';

import petList from '../../assets/json/pet.json';
import petAttribList from '../../assets/json/petattrib.json';

/**
 * @title Data table with sorting, pagination, and filtering.
 */
@Component({
  selector: 'soul-absorb',
  styleUrls: ['soul-absorb.component.css'],
  templateUrl: 'soul-absorb.component.html',
})
export class SoulAbsorbComponent implements OnInit {

  myControl = new FormControl();
  filteredOption = this.myControl.valueChanges.pipe(startWith(''), map((value: any) => this._filter(value)));

  pet: any;
  level = 140;
  result: any = {
    status: { atk: 0, def: 0, mat: 0, mdf: 0, avo: 0, hit: 0 },
    highAbsorb: { str: 0, vit: 0, int: 0, fai: 0, agi: 0, dex: 0 },
    lowAbsorb: { str: 0, vit: 0, int: 0, fai: 0, agi: 0, dex: 0 }
  };

  LOW_STATE_TABLE = [0, 0, 0, 1, 1, 1, 2, 2, 2, 3, 3, 3, 4, 4, 5, 5, 5, 6, 6, 6, 7, 7, 7, 8, 8, 9, 9, 9, 10, 10, 10, 11, 11, 12, 12, 12, 13, 13, 13, 14, 14];

  constructor(
  ) {
  }

  ngOnInit () {
  }

  private _filter(value: string) {
    return petList.root.pet
      .filter((pet: any) => { return pet['名稱'] && pet['名稱'].indexOf(value) != -1})
      .map((pet: any) => { console.log('pet', pet); return { id: pet['編號'], name: pet['名稱'], type: pet['寵物類型'] }; })
      .reverse()
      .slice(0, 100);
  }

  public displayFn (option: any): string {
    if (!option) return '';
    return option.name;
  }

  public itemSelected(option: any) {
    console.log('option', option.value);
    this.pet = option.value;
    this.update();
  }

  public clearTarget () {
    this.pet = null;
    this.myControl.setValue('');
    this.update();
  }

  public update () {

    if (!this.pet) {
      this.result.status = { atk: 0, def: 0, mat: 0, mdf: 0, avo: 0, hit: 0 };
      this.result.highAbsorb =  { str: 0, vit: 0, int: 0, fai: 0, agi: 0, dex: 0 };
      this.result.lowAbsorb = { str: 0, vit: 0, int: 0, fai: 0, agi: 0, dex: 0 };
      return;
    }

    const attrib: any = petAttribList.root.petattrib.find((attr: any) => {
      return +attr['寵物類型'] === +this.pet.type && +attr['等級'] === +this.level;
    });

    console.log('status', attrib);

    this.result.status = {
      atk: Math.floor(attrib['攻擊']),
      def: Math.floor(attrib['防禦']),
      mat: Math.floor(attrib['魔攻']),
      mdf: Math.floor(attrib['魔防']),
      avo: Math.floor(attrib['閃躲']),
      hit: Math.floor(attrib['命中'])
    };
    this.result.highAbsorb = {
      str: Math.floor(this.level < 100 ? this.level / 20 : 5 + (this.level - 100) / 10 ) + Math.floor(this.result.status.atk < 2000 ? this.result.status.atk / 100 : 20 ) + 5,
      vit: Math.floor(this.level < 100 ? this.level / 20 : 5 + (this.level - 100) / 10 ) + Math.floor(this.result.status.def < 1500 ? this.result.status.def / 75 : 20 ) + 5,
      int: Math.floor(this.level < 100 ? this.level / 20 : 5 + (this.level - 100) / 10 ) + Math.floor(this.result.status.mat < 2000 ? this.result.status.mat / 100 : 20 ) + 5,
      fai: Math.floor(this.level < 100 ? this.level / 20 : 5 + (this.level - 100) / 10 ) + Math.floor(this.result.status.mdf < 1500 ? this.result.status.mdf / 75 : 20 ) + 5,
      agi: Math.floor(this.level < 100 ? this.level / 20 : 5 + (this.level - 100) / 10 ) + Math.floor(this.result.status.avo < 1000 ? this.result.status.avo / 50 : 20 ) + 5,
      dex: Math.floor(this.level < 100 ? this.level / 20 : 5 + (this.level - 100) / 10 ) + Math.floor(this.result.status.hit < 1000 ? this.result.status.hit / 50 : 20 ) + 5
    };
    this.result.lowAbsorb = {
      str: this.result.highAbsorb.str < this.LOW_STATE_TABLE.length ? this.LOW_STATE_TABLE[this.result.highAbsorb.str] : -1,
      vit: this.result.highAbsorb.vit < this.LOW_STATE_TABLE.length ? this.LOW_STATE_TABLE[this.result.highAbsorb.vit] : -1,
      int: this.result.highAbsorb.int < this.LOW_STATE_TABLE.length ? this.LOW_STATE_TABLE[this.result.highAbsorb.int] : -1,
      fai: this.result.highAbsorb.fai < this.LOW_STATE_TABLE.length ? this.LOW_STATE_TABLE[this.result.highAbsorb.fai] : -1,
      agi: this.result.highAbsorb.agi < this.LOW_STATE_TABLE.length ? this.LOW_STATE_TABLE[this.result.highAbsorb.agi] : -1,
      dex: this.result.highAbsorb.dex < this.LOW_STATE_TABLE.length ? this.LOW_STATE_TABLE[this.result.highAbsorb.dex] : -1,
    }

    console.log('result', this.result);
  }

}
