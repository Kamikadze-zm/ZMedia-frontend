import { Component, Input, Output, ViewChild, EventEmitter, NgZone, forwardRef, AfterViewInit, ElementRef, ContentChild, OnDestroy } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { CkEditorUploadComponent } from './upload/ckeditor-upload.component';

declare var CKEDITOR: any;

@Component({
    selector: 'ckeditor',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => CkEditorComponent),
            multi: true,
        },
    ],
    template: `<textarea #ck></textarea>
    <ckeditor-upload></ckeditor-upload>`,
})
export class CkEditorComponent implements AfterViewInit, OnDestroy {

    @ViewChild('ck') ck: ElementRef;
    @ViewChild(CkEditorUploadComponent) uploadComponent: CkEditorUploadComponent;

    @Input() config: any;
    @Input() debounce: string;

    @Output() change = new EventEmitter();
    @Output() editorChange = new EventEmitter();
    @Output() ready = new EventEmitter();
    @Output() blur = new EventEmitter();
    @Output() focus = new EventEmitter();
    @Output() contentDom = new EventEmitter();
    @Output() paste = new EventEmitter();
    @Output() drop = new EventEmitter();
    _value = '';
    instance: any;
    debounceTimeout: any;

    constructor(private zone: NgZone) { }

    get value(): any {
        return this._value;
    }
    @Input()
    set value(v) {
        if (v !== this._value) {
            this._value = v;
            this.onChange(v);
        }
    }

    ngOnDestroy() {
        if (this.instance) {
            this.instance.removeAllListeners();
            this.instance.destroy();
            this.instance = null;
        }
    }

    ngAfterViewInit() {
        this.ckeditorInit(this.config || {});
        if (this.instance) {
            this.uploadComponent.editor = this.instance;
            this.instance.addCommand('openImageUploader', {
                exec: (evt: any) => {
                    this.uploadComponent.show();
                },
            });
            this.instance.ui.addButton('imageUploader', {
                label: 'Загрузить файл на сервер',
                command: 'openImageUploader',
                toolbar: 'insert,1',
                icon: './upload/upload-file.png',
            });
        }
    }

    ngAfterViewChecked() {
        this.ckeditorInit(this.config || {});
    }

    updateValue(value: any) {
        this.zone.run(() => {
            this.value = value;

            this.onChange(value);

            this.onTouched();
            this.change.emit(value);
        });
    }

    ckeditorInit(config: any) {
        if (typeof CKEDITOR === 'undefined') {
            console.warn('CKEditor is missing');
        } else {
            if (this.instance || !this.documentContains(this.ck.nativeElement)) {
                return;
            }

            this.instance = CKEDITOR.replace(this.ck.nativeElement, config);

            this.instance.setData(this.value);

            this.instance.on('instanceReady', (evt: any) => {
                if (this.instance.getData() !== this.value) {
                    this.instance.setData(this.value);
                }
                this.ready.emit(evt);
            });

            this.instance.on('change', (evt: any) => {
                this.onTouched();
                let value = this.instance.getData();

                if (this.value !== value) {
                    if (this.debounce) {
                        if (this.debounceTimeout) clearTimeout(this.debounceTimeout);
                        this.debounceTimeout = setTimeout(() => {
                            this.updateValue(value);
                            this.debounceTimeout = null;
                        }, parseInt(this.debounce));
                    } else {
                        this.updateValue(value);
                    }
                }
                this.editorChange.emit(evt);
            });

            this.instance.on('blur', (evt: any) => {
                this.blur.emit(evt);
            });

            this.instance.on('focus', (evt: any) => {
                this.focus.emit(evt);
            });

            this.instance.on('contentDom', (evt: any) => {
                this.contentDom.emit(evt);
            });

            this.instance.on('paste', (evt: any) => {
                this.paste.emit(evt);
            });

            this.instance.on('drop', (evt: any) => {
                this.drop.emit(evt);
            });

            //<ckbutton[name]="'imageExplorer'"[command] = "'openImageExplorer'"(click) = "openImageExplorer($event)"[icon] = "'./upload/upload-file.png'"
            //[label] = "'Загрузить файл на сервер'"[toolbar] = "'insert,1'" >
            //</ckbutton>
        }
    }
    writeValue(value: any) {
        this._value = value;
        if (this.instance) this.instance.setData(value);
    }

    onChange(_: any) { }

    onTouched() { }

    registerOnChange(fn: any) {
        this.onChange = fn;
    }

    registerOnTouched(fn: any) {
        this.onTouched = fn;
    }

    private documentContains(node: Node) {
        return document.contains ? document.contains(node) : document.body.contains(node);
    }
}
