import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
    imports: [
        CommonModule, ReactiveFormsModule,
    ],
    providers: [],
    exports: [CommonModule, ReactiveFormsModule],
})
export class SharedModule { }