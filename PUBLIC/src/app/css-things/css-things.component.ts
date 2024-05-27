import { Component } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-css-things',
  standalone: false,
  templateUrl: './css-things.component.html',
  styleUrl: './css-things.component.scss'
})
export class CssThingsComponent {
  constructor(private router: Router) { }

  
}
