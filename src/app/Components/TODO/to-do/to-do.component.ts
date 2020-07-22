import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from "@angular/forms";
import { Router } from "@angular/router";
import { ProfilesService } from 'src/app/Services/profiles.service';
import { ItemService } from 'src/app/Services/item.service';
import { FileUploadService } from 'src/app/Services/file-upload.service';

@Component({
  selector: 'app-to-do',
  templateUrl: './to-do.component.html',
  styleUrls: ['./to-do.component.css']
})
export class ToDoComponent implements OnInit {

  fileToUpload: File = null;
  fName:any;


  formlabel: string;
  formbtn: string;

  id: any = "";
  addForm: FormGroup;
  btnvisibility: boolean;

  constructor(private router: ActivatedRoute, private itemService: ItemService, private navRoter: Router,private fileUploadService:FileUploadService) {
    this.btnvisibility = true;
    this.formlabel = "Add ToDo Item";
    this.formbtn = "Save";
    this.id = this.router.snapshot.params['id'];

    this.addForm = new FormGroup({
      text: new FormControl('', [Validators.required]),
      createdDate: new FormControl('', [Validators.required]),
      picturesUrl: new FormControl('', []),
      userId: new FormControl('', []),

    });
  }
  ngOnInit() {
    let item = localStorage.getItem('userId');
    this.addForm.controls['userId'].setValue(item);

    if (this.router.snapshot.params['id']) {

      if (this.id != "") {

        this.itemService.getSpecificItem(this.id, false).then(res => {
          this.addForm.patchValue(res);
        }).catch(error => {
        });

        this.btnvisibility = false;
        this.formlabel = 'Edit ToDo Item';
        this.formbtn = 'Update';
      }

    }

  }


  onSelectFile(fileInput: any) {
    this.fileToUpload = <File>fileInput.target.files[0];
    let newGuidValue = this.itemService.newGuid();
    this.fName = newGuidValue+"."+this.fileToUpload.name.split('.').pop();
  }

  back() {
    this.navRoter.navigate(['/home']);
  }

  onSubmit() {
    console.log('Create fire');
    if(this.fileToUpload != null){
      // this.addForm.addControl('picturesUrl', new FormControl(this.fName)); 
      this.addForm.controls['picturesUrl'].setValue(this.fName);
      this.fileUploadService.uploadFile(this.fName,this.fileToUpload);

    }

    this.itemService.addItem(this.addForm.value, false).then(res => {
      this.navRoter.navigate(['/home']);
    }).catch(error => {
      alert(error);
    });
  }
  onUpdate() {
    console.log('Update fire');
    if(this.fileToUpload != null){
      // this.addForm.addControl('picturesUrl', new FormControl(this.fName));
      this.addForm.controls['picturesUrl'].setValue(this.fName);
      this.fileUploadService.uploadFile(this.fName,this.fileToUpload);
    }

    this.itemService.editItem(this.id, this.addForm.value, false).then(res => {
      this.navRoter.navigate(['/home']);
    }).catch(error => {
      alert(error);
    });
  }

}
