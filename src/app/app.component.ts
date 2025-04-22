import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavigationBarComponent } from './navigation-bar/navigation-bar.component';
import { FooterModule } from './footer.module';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, NavigationBarComponent, FooterModule], 
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'my-angular-app';
}
