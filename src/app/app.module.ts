import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MaterialModule } from './material.module';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

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
import { QuestComponent } from './quest/quest.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ItemListComponent,
    ItemComponent,
    DropListComponent,
    DropComponent,
    MonsterListComponent,
    MonsterComponent,
    MagicListComponent,
    MagicComponent,
    QuestListComponent,
    QuestComponent,
  ],
  imports: [
    FormsModule,
    BrowserModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
