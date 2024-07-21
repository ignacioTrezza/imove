import { Component } from '@angular/core';
@Component({
  selector: 'app-dashboard',    
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  username: string;

  constructor() {
    this.username = localStorage.getItem('userName') || 'User'; // Default to 'User' if not found
  }
}
