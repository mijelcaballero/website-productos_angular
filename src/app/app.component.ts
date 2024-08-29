import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavigationModule } from './navigation.module';
import { FooterModule } from './footer.module';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, NavigationModule, FooterModule], // Importar RouterModule aquí junto con la barra de navegacion
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'my-angular-app';
}
