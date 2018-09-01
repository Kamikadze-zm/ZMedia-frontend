import { Component, Output, EventEmitter, Input, OnChanges, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormGroup, FormArray, FormControl, AbstractControl } from '@angular/forms';
import { ImageService, ImageType } from '../../../services/image.service';
import { TvSeriesService } from '../../../services/tv-series.service';
import { TvSeriesViewDTO, TvSeriesForm } from '../../../model/tv-series';
import { Genre, Quality } from '../../../model/publication';
import { Constants } from '../../../util/constants';
import { isValidationError, ValidationError } from '../../../model/error';
import { CustomValidators } from '../../../validators/custom-validators';
import { DownloadLinkForm } from '../../../model/download-link';
import '../../../ckeditor/ckeditor.loader';
import 'ckeditor'


@Component({
  selector: 'tv-series-form',
  templateUrl: './tv-series-form.component.html',
  providers: [TvSeriesService, ImageService]
})
export class TvSeriesFormComponent implements OnInit, OnChanges {

  @Input("tvSeries") tvSeries: TvSeriesViewDTO
  @Output("onSubmit") onSubmitEvent: EventEmitter<FormGroup> = new EventEmitter<FormGroup>();

  tvSeriesForm: FormGroup;
  tvSeriesGenres: Genre[];
  tvSeriesQualities: Quality[]

  fs: FormControl;
  fsMU: FormControl;

  coverLink: string = "";

  ckeditorConfig: any = Constants.CKEDITOR_CONFIG;

  previewTvSeries: TvSeriesViewDTO = null;
  isDisablePreview: boolean = true;

  constructor(private tvSeriesService: TvSeriesService, private imageService: ImageService, private location: Location) { }

  get downloadLinks(): AbstractControl[] {
    const formArray: FormArray = this.tvSeriesForm.get('downloadLinks') as FormArray;
    if (!formArray) {
      return [];
    }
    return formArray.controls;
  }

  ngOnInit() {
    this.tvSeriesService.getGenres().subscribe((genres: Genre[]) => {
      this.tvSeriesGenres = genres;
    });
    this.tvSeriesService.getQualities().subscribe((qualities: Quality[]) => {
      this.tvSeriesQualities = qualities;
    });
    this.tvSeriesForm = TvSeriesForm.create();
    ((this.tvSeriesForm.controls['downloadLinks'] as FormArray).controls[0] as FormGroup).controls['description'].setValue('Серия 1');
    this.fs = new FormControl();
    this.fsMU = new FormControl("g");
  }

  ngOnChanges() {
    if (this.tvSeries) {
      TvSeriesForm.update(this.tvSeriesForm, this.tvSeries);
      this.coverLink = this.tvSeriesForm.controls['coverLink'].value;
      const fileSize = this.tvSeriesForm.controls['fileSize'].value;
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
    this.onSubmitEvent.emit(this.tvSeriesForm);
  }

  uploadImage(files: FileList) {
    if (!files[0]) {
      return;
    }
    const c = this.tvSeriesForm.controls["coverLink"];
    c.markAsTouched();
    this.imageService.uploadImage(files[0], ImageType.COVER).subscribe(
      (imagePath: string) => {
        this.tvSeriesForm.controls['coverLink'].setValue(imagePath);
        this.coverLink = imagePath;
      },
      (err) => {
        if (isValidationError(err)) {
          const ve: ValidationError = err.error as ValidationError;
          CustomValidators.addError(c, "server", ve.fieldErrors[0].message);
        } else {
          CustomValidators.addError(c, "server", "Произошла ошибка, повторите попытку");
        }
      });
  }

  onChangeCheckbox(checked: boolean, id: string) {
    const cbs: FormArray = <FormArray>this.tvSeriesForm.controls["genres"];
    if (checked) {
      cbs.push(new FormControl(id));
    } else {
      let index = cbs.controls.findIndex(cb => cb.value == id);
      cbs.removeAt(index);
    }
  }

  isSelectedGenre(id: string): boolean {
    const selected: string[] = (<FormArray>this.tvSeriesForm.controls["genres"]).value;
    return selected.includes(id);
  }

  setFileSize() {
    const size: number = this.fs.value;
    const mu: string = this.fsMU.value;
    const control = this.tvSeriesForm.controls['fileSize'];
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
    const dls: FormArray = <FormArray>this.tvSeriesForm.controls['downloadLinks'];
    const number: number = dls.length + 1;
    dls.push(DownloadLinkForm.create(`Серия ${number}`, null));
  }

  deleteLink(index: number): void {
    const dls: FormArray = <FormArray>this.tvSeriesForm.controls['downloadLinks'];
    dls.removeAt(index);
  }

  isInvalid(path: string | (string | number)[]): boolean {
    let control = this.tvSeriesForm.get(path);
    if (!control) {
      return false;
    }
    return control.touched && control.invalid;
  }

  isValid(path: string | (string | number)[]): boolean {
    let control = this.tvSeriesForm.get(path);
    if (!control) {
      return true;
    }
    return control.touched && !control.pending && control.valid;
  }

  getErrors(path: string | (string | number)[]): string[] {
    let control = this.tvSeriesForm.get(path);
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
    const c = this.tvSeriesForm.controls;
    this.previewTvSeries = new TvSeriesViewDTO(
      null,
      c['header'].value,
      c['note'].value,
      c['name'].value,
      c['originalName'].value,
      (c['genres'].value as Array<string>).map<Genre>(gid => this.tvSeriesGenres.find(g => g.id === gid)),
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
      c['seasonNumber'].value,
      this.tvSeriesQualities.find(q => q.id === c['quality'].value)
    );
  }

  hidePreview() {
    this.isDisablePreview = true;
  }

  back() {
    this.location.back();
  }
}