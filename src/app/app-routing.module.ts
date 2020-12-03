import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ItemListComponent } from './item-list/item-list.component';
import { ItemComponent } from './item/item.component';
import { DropListComponent } from './drop-list/drop-list.component';

const routes: Routes = [
  { path: 'item', component: ItemListComponent },
  { path: 'item/:id', component: ItemComponent },
  { path: 'drop', component: DropListComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
