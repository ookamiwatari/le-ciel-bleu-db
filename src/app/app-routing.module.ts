import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { ItemListComponent } from './item-list/item-list.component';
import { ItemComponent } from './item/item.component';
import { DropListComponent } from './drop-list/drop-list.component';
import { DropComponent } from './drop/drop.component';
import { MonsterListComponent } from './monster-list/monster-list.component';
import { MonsterComponent } from './monster/monster.component';
import { MagicListComponent } from './magic-list/magic-list.component';
import { MagicComponent } from './magic/magic.component';
import { QuestListComponent } from './quest-list/quest-list.component';

const routes: Routes = [
  { path: 'item', component: ItemListComponent },
  { path: 'item/:id', component: ItemComponent },
  { path: 'drop', component: DropListComponent },
  { path: 'drop/:id', component: DropComponent },
  { path: 'monster', component: MonsterListComponent },
  { path: 'monster/:id', component: MonsterComponent },
  { path: 'magic', component: MagicListComponent },
  { path: 'magic/:id', component: MagicComponent },
  { path: 'quest', component: QuestListComponent },
  { path: 'home', component: HomeComponent },
  { path: '', component: HomeComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'enabled',
    useHash: true
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
