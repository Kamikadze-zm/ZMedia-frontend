import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

import { API_PATH } from "src/host-settings";

@Injectable()
export class ImageService {

    private url: string = API_PATH + "files/";

    constructor(private http: HttpClient) { }

    uploadImage(image: File, imageType: ImageType): Observable<string> {
        const formData: FormData = new FormData();
        formData.append("upload", image);
        formData.append("type", imageType);
        return this.http.post<string>(this.url, formData);
    }
}

export enum ImageType {
    AVATAR = "AVATAR",
    COVER = "COVER",
    SCREENSHOT = "SCREENSHOT"
}