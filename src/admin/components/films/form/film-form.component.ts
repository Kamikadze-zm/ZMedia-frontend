import { Component, Output, EventEmitter, Input, OnChanges, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormGroup, FormArray, FormControl, AbstractControl } from '@angular/forms';

import { ReactiveFormComponent, addError } from 'src/core/components/reactive-form-component';
import { isValidationError, ValidationError } from 'src/core/model/error';
import { Genre, Quality } from 'src/publication/publication';
import { FilmViewDTO } from 'src/films/film';
import 'src/admin/ckeditor/ckeditor.loader';
import 'ckeditor';
import { CKEDITOR_CONFIG } from 'src/admin/ckeditor/ckeditor.config';
import { ImageService, ImageType } from 'src/admin/services/image.service';
import { AdminFilmService } from 'src/admin/services/admin-film.service';
import { FilmForm } from 'src/admin/model/film-form';
import { DownloadLinkForm } from 'src/admin/model/download-link-form';

@Component({
  selector: 'film-form',
  templateUrl: './film-form.component.html',
  providers: [ImageService]
})
export class FilmFormComponent implements OnInit, OnChanges, ReactiveFormComponent {

  @Input("film") film: FilmViewDTO
  @Output("onSubmit") onSubmitEvent: EventEmitter<FormGroup> = new EventEmitter<FormGroup>();

  filmForm: FormGroup;
  filmGenres: Genre[];
  filmQualities: Quality[]

  fs: FormControl;
  fsMU: FormControl;

  coverLink: string = "";

  ckeditorConfig: any = CKEDITOR_CONFIG;

  previewFilm: FilmViewDTO = null;
  isDisablePreview: boolean = true;

  constructor(private adminFilmService: AdminFilmService,
    private imageService: ImageService,
    private location: Location) { }

  get downloadLinks(): AbstractControl[] {
    const formArray: FormArray = this.filmForm.get('downloadLinks') as FormArray;
    if (!formArray) {
      return [];
    }
    return formArray.controls;
  }

  ngOnInit() {
    this.adminFilmService.getGenres().subscribe((genres: Genre[]) => {
      this.filmGenres = genres;
    });
    this.adminFilmService.getQualities().subscribe((qualities: Quality[]) => {
      this.filmQualities = qualities;
    });
    this.filmForm = FilmForm.create();
    this.fs = new FormControl();
    this.fsMU = new FormControl("g");
  }

  ngOnChanges() {
    if (this.film) {
      FilmForm.update(this.filmForm, this.film);
      this.coverLink = this.filmForm.controls['coverLink'].value;
      const fileSize = this.filmForm.controls['fileSize'].value;
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
    this.onSubmitEvent.emit(this.filmForm);
  }

  uploadImage(files: FileList) {
    if (!files[0]) {
      return;
    }
    const c = this.filmForm.controls["coverLink"];
    c.markAsTouched();
    this.imageService.uploadImage(files[0], ImageType.COVER).subscribe(
      (imagePath: string) => {
        this.filmForm.controls['coverLink'].setValue(imagePath);
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
    const cbs: FormArray = <FormArray>this.filmForm.controls["genres"];
    if (checked) {
      cbs.push(new FormControl(id));
    } else {
      let index = cbs.controls.findIndex(cb => cb.value == id);
      cbs.removeAt(index);
    }
  }

  isSelectedGenre(id: string): boolean {
    const selected: string[] = (<FormArray>this.filmForm.controls["genres"]).value;
    return selected.includes(id);
  }

  setFileSize() {
    const size: number = this.fs.value;
    const mu: string = this.fsMU.value;
    const control = this.filmForm.controls['fileSize'];
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
    const dls: FormArray = <FormArray>this.filmForm.controls['downloadLinks'];
    dls.push(DownloadLinkForm.create(null, null));
  }

  deleteLink(index: number): void {
    const dls: FormArray = <FormArray>this.filmForm.controls['downloadLinks'];
    dls.removeAt(index);
  }

  isInvalid(path: string | (string | number)[]): boolean {
    let control = this.filmForm.get(path);
    if (!control) {
      return false;
    }
    return control.touched && control.invalid;
  }

  isValid(path: string | (string | number)[]): boolean {
    let control = this.filmForm.get(path);
    if (!control) {
      return true;
    }
    return control.touched && !control.pending && control.valid;
  }

  getErrors(path: string | (string | number)[]): string[] {
    let control = this.filmForm.get(path);
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
    const c = this.filmForm.controls;
    this.previewFilm = new FilmViewDTO(
      null,
      c['header'].value,
      c['note'].value,
      c['name'].value,
      c['originalName'].value,
      (c['genres'].value as Array<string>).map<Genre>(gid => this.filmGenres.find(g => g.id === gid)),
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
      c['downloadLinks'].value,
      this.filmQualities.find(q => q.id === c['quality'].value)
    );
  }

  hidePreview() {
    this.isDisablePreview = true;
  }

  back() {
    this.location.back();
  }
}