import { AfterViewInit, OnInit, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import itemList from '../../assets/json/item.json';

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

  item: any;

  constructor(
    private route: ActivatedRoute
  ) { }

  ngOnInit () {
    const id = this.route.snapshot.paramMap.get('id');
    this.item = itemList.root['道具'].find((item: any) => { return item['_編號'] === id; })
    console.log('item', this.item);
  }

}
