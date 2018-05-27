import { NgModule } from '@angular/core';

import {
  MatButtonModule,
  MatMenuModule,
  MatToolbarModule,
  MatIconModule,
  MatCardModule,
  MatFormFieldModule,
  MatInputModule,
  MatOptionModule,
  MatSelectModule,
  MatTableModule,
  MatNativeDateModule,
  MatDatepickerModule,
  MatDividerModule,
  MatListItem,
  MatListModule,
  MatSidenavModule,
  MatTooltipModule,
  MatExpansionModule
} from '@angular/material';

@NgModule({
  imports: [
    MatButtonModule,
    MatMenuModule,
    MatToolbarModule,
    MatIconModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatOptionModule,
    MatSelectModule,
    MatTableModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatDividerModule,
    MatListModule,
    MatSidenavModule,
    MatTooltipModule,
    MatExpansionModule
  ],
  exports: [
    MatButtonModule,
    MatMenuModule,
    MatToolbarModule,
    MatIconModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatOptionModule,
    MatSelectModule,
    MatTableModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatDividerModule,
    MatListModule,
    MatSidenavModule,
    MatTooltipModule,
    MatExpansionModule
  ]
})
export class MaterialModule {}