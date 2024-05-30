import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-z-index-1',
  standalone: false,
  templateUrl: './z-index-1.component.html',
  styleUrl: './z-index-1.component.scss'
})
export class ZIndex1Component {
  constructor(private router: Router) { }

  navigateToZIndex1() {
    this.router.navigateByUrl('/css-things');
  }

}
