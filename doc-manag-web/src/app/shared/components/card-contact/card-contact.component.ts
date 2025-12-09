import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-card-contact',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './card-contact.component.html',
  styleUrl: './card-contact.component.scss'
})
export class CardContactComponent {
  @Input() initials!: string;
  @Input() name!: string;
  @Input() resident!: string;
  @Input() state!: string;
  @Input() entryDate!: string;
  @Input() active!: boolean;

  constructor(private router: Router) {}

  viewQRCode() {
    this.router.navigate(['/security_access/view-pass']);
  }
}
