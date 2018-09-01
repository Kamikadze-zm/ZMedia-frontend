import { Component, ViewChild, ElementRef } from '@angular/core';
import { ImageService, ImageType } from '../../services/image.service';
import { isValidationError, ValidationError } from '../../model/error';

@Component({
  selector: 'ckeditor-upload',
  templateUrl: './ckeditor-upload.component.html'
})
export class CkEditorUploadComponent {

  @ViewChild("modal") modal: ElementRef;
  @ViewChild("fileInput") fileInput: ElementRef;
  error: string;

  private _editor;

  constructor(private imageService: ImageService) { }

  set editor(editor: any) {
    this._editor = editor;
  }

  show() {
    this.modal.nativeElement.className = 'modal fade in';
    this.modal.nativeElement.style.display = 'block';
  }

  hide() {
    this.modal.nativeElement.className = 'modal fade';
    this.modal.nativeElement.style.display = 'none';
  }

  upload(): void {
    const input = this.fileInput.nativeElement;
    if (input.files && input.files[0]) {
      this.imageService.uploadImage(input.files[0], ImageType.SCREENSHOT).subscribe(
        (imagePath: string) => {
          let link = this._editor.document.createElement("a");
          link.setAttribute("href", imagePath);
          console.log(link);
          let img = this._editor.document.createElement("img");
          let nameStartIndex: number = imagePath.lastIndexOf("/") + 1;
          let name: string = imagePath.substring(nameStartIndex);
          img.setAttribute("src", imagePath.substring(0, nameStartIndex) + "scr_" + name);
          link.append(img);
          this._editor.insertElement(link);
          input.value = null;
          this.error = null;
          this.hide();
        },
        (e) => {
          if (isValidationError(e)) {
            const ve: ValidationError = e.error as ValidationError;
            this.error = ve.fieldErrors[0].message;
          } else if (e.message) {
            this.error = e.message;
          } else {
            this.error = "Произошла ошибка, повторите попытку";
          }
        });
    }
  }

  onChange() {
    this.error = null;
  }
}