import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { ItemListComponent } from './item-list/item-list.component';
import { ItemComponent } from './item/item.component';
import { DropListComponent } from './drop-list/drop-list.component';
import { MonsterListComponent } from './monster-list/monster-list.component';
import { MonsterComponent } from './monster/monster.component';

const routes: Routes = [
  { path: 'item', component: ItemListComponent },
  { path: 'item/:id', component: ItemComponent },
  { path: 'drop', component: DropListComponent },
  { path: 'monster', component: MonsterListComponent },
  { path: 'monster/:id', component: MonsterComponent },
  { path: 'home', component: HomeComponent },
  { path: '', component: HomeComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
