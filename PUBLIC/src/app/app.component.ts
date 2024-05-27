import { Component} from '@angular/core';


declare global {
  interface Window { electronAPI: any; }
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: false,
})
export class AppComponent {
  title = 'Imove';

}