import { Component, Output, EventEmitter, Input, OnChanges, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormGroup, FormArray, FormControl, AbstractControl } from '@angular/forms';

import { ReactiveFormComponent, addError } from 'src/core/components/reactive-form-component';
import { isValidationError, ValidationError } from 'src/core/model/error';
import { Genre } from 'src/publication/publication';
import { GameViewDTO } from 'src/games/game';
import 'src/admin/ckeditor/ckeditor.loader';
import 'ckeditor';
import { CKEDITOR_CONFIG } from 'src/admin/ckeditor/ckeditor.config';
import { ImageService, ImageType } from 'src/admin/services/image.service';
import { AdminGameService } from 'src/admin/services/admin-game.service';
import { GameForm } from 'src/admin/model/game-form';
import { DownloadLinkForm } from 'src/admin/model/download-link-form';

@Component({
  selector: 'game-form',
  templateUrl: './game-form.component.html',
  providers: [ImageService]
})
export class GameFormComponent implements OnInit, OnChanges, ReactiveFormComponent {

  @Input("game") game: GameViewDTO;
  @Output("onSubmit") onSubmitEvent: EventEmitter<FormGroup> = new EventEmitter<FormGroup>();

  gameForm: FormGroup;
  gameGenres: Genre[];

  fs: FormControl;
  fsMU: FormControl;

  coverLink: string = "";

  ckeditorConfig: any = CKEDITOR_CONFIG;

  previewGame: GameViewDTO = null;
  isDisablePreview: boolean = true;

  constructor(private adminGameService: AdminGameService,
    private imageService: ImageService,
    private location: Location) { }

  get downloadLinks(): AbstractControl[] {
    const formArray: FormArray = this.gameForm.get('downloadLinks') as FormArray;
    if (!formArray) {
      return [];
    }
    return formArray.controls;
  }

  ngOnInit() {
    this.adminGameService.getGenres().subscribe((genres: Genre[]) => {
      this.gameGenres = genres;
    });
    this.gameForm = GameForm.create();
    this.fs = new FormControl();
    this.fsMU = new FormControl("g");
  }

  ngOnChanges() {
    if (this.game) {
      GameForm.update(this.gameForm, this.game);
      this.coverLink = this.gameForm.controls['coverLink'].value;
      const fileSize = this.gameForm.controls['fileSize'].value;
      if (fileSize > 1024) {
        this.fs.setValue((fileSize / 1024.0).toFixed(2));
        this.fsMU.setValue("g");
      } else {
        this.fs.setValue(fileSize);
        this.fsMU.setValue("m");
      }
    }
  }

  onSubmit(): void {
    this.onSubmitEvent.emit(this.gameForm);
  }

  uploadImage(files: FileList) {
    if (!files[0]) {
      return;
    }
    const c = this.gameForm.controls["coverLink"];
    c.markAsTouched();
    this.imageService.uploadImage(files[0], ImageType.COVER).subscribe(
      (imagePath: string) => {
        this.gameForm.controls['coverLink'].setValue(imagePath);
        this.coverLink = imagePath;
      },
      (err) => {
        if (isValidationError(err)) {
          const ve: ValidationError = err.error as ValidationError;
          addError(c, "server", ve.fieldErrors[0].message);
        } else {
          addError(c, "server", "Произошла ошибка, повторите попытку");
        }
      });
  }

  onChangeCheckbox(checked: boolean, id: string) {
    const cbs: FormArray = <FormArray>this.gameForm.controls["genres"];
    if (checked) {
      cbs.push(new FormControl(id));
    } else {
      let index = cbs.controls.findIndex(cb => cb.value == id);
      cbs.removeAt(index);
    }
  }

  isSelectedGenre(id: string): boolean {
    const selected: string[] = (<FormArray>this.gameForm.controls["genres"]).value;
    return selected.includes(id);
  }

  setFileSize() {
    const size: number = this.fs.value;
    const mu: string = this.fsMU.value;
    const control = this.gameForm.controls['fileSize'];
    control.markAsTouched();
    if (!size || !mu) {
      return;
    }
    let sizeMB = size;
    if (mu == "g") {
      sizeMB = Math.round(size * 1024);
    }
    control.setValue(sizeMB);
  }

  addLink(): void {
    const dls: FormArray = <FormArray>this.gameForm.controls['downloadLinks'];
    dls.push(DownloadLinkForm.create(null, null));
  }

  deleteLink(index: number): void {
    const dls: FormArray = <FormArray>this.gameForm.controls['downloadLinks'];
    dls.removeAt(index);
  }

  isInvalid(path: string | (string | number)[]): boolean {
    let control = this.gameForm.get(path);
    if (!control) {
      return false;
    }
    return control.touched && control.invalid;
  }

  isValid(path: string | (string | number)[]): boolean {
    let control = this.gameForm.get(path);
    if (!control) {
      return true;
    }
    return control.touched && !control.pending && control.valid;
  }

  getErrors(path: string | (string | number)[]): string[] {
    let control = this.gameForm.get(path);
    if (!control) {
      return null;
    }
    let errors: string[] = [];
    if (control.errors) {
      for (let k in control.errors) {
        errors.push(control.errors[k]);
      }
    }
    return errors;
  }

  preview() {
    this.updatePreview();
    this.isDisablePreview = false;
    window.scrollTo(0, 0);
  }

  updatePreview() {
    const c = this.gameForm.controls;
    this.previewGame = new GameViewDTO(
      null,
      c['header'].value,
      c['note'].value,
      c['name'].value,
      c['originalName'].value,
      (c['genres'].value as Array<string>).map<Genre>(gid => this.gameGenres.find(g => g.id === gid)),
      c['releaseYear'].value,
      c['coverLink'].value,
      c['fileSize'].value,
      c['description'].value,
      c['additionalInfo'].value,
      null,
      null,
      null,
      null,
      c['details'].value,
      c['downloadLinks'].value
    );
  }

  hidePreview() {
    this.isDisablePreview = true;
  }

  back() {
    this.location.back();
  }
}