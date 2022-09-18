import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup,ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ServiceService } from '../service.service';

@Component({
  selector: 'app-records',
  templateUrl: './records.component.html',
  styleUrls: ['./records.component.css']
})
export class RecordsComponent implements OnInit {

  AddStudentForm !: FormGroup;
  actionBtn : string = "Save";

  constructor(private matdialog : MatDialogRef<RecordsComponent>,private service: ServiceService, @Inject(MAT_DIALOG_DATA) public editdata : any) { 
    this.AddStudentForm = new FormGroup({
      firstName : new FormControl(),
      lastName : new FormControl(),
      dob : new FormControl(),
      std : new FormControl(),
      gender : new FormControl(),
      contact : new FormControl(),
      address : new FormControl(),
    })
  }

  ngOnInit(): void {
    if(this.editdata){
      this.actionBtn = "Update"
      this.AddStudentForm.controls['firstName'].setValue (this.editdata.firstName);
      this.AddStudentForm.controls['lastName'].setValue (this.editdata.lastName);
      this.AddStudentForm.controls['dob'].setValue( this.editdata.dob);
      this.AddStudentForm.controls['std'].setValue (this.editdata.std);
      this.AddStudentForm.controls['gender'].setValue (this.editdata.gender);
      this.AddStudentForm.controls['contact'].setValue (this.editdata.contact);
      this.AddStudentForm.controls['address'].setValue (this.editdata.address);
    } 
  }

  onSubmit(){
    if(!this.editdata){
      console.log(this.AddStudentForm.value)
      let response = this.service.httppost(this.AddStudentForm.value)
      response.subscribe({
      next: (nxt) => {
        console.log(nxt)
        alert("successfull")
        this.matdialog.close('Save');
      },
      error: (err) => {
        console.log(err)
      }
    })
    }
    else{
      let response = this.service.httpput(this.AddStudentForm.value, this.editdata.id)
      response.subscribe({
        next : (nxt) => {
          console.log(nxt)
          alert("succesfull edit")
          this.matdialog.close('Update')
        },
        error: (err) => {
          console.log(err)
        }
      })
    }
  }

}
