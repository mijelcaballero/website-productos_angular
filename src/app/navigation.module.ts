// navigation.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavigationBarComponent } from './navigation-bar/navigation-bar.component';

@NgModule({
  declarations: [NavigationBarComponent],
  imports: [CommonModule, RouterModule],
  exports: [NavigationBarComponent]
})

export class NavigationModule {}
