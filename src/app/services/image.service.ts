import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Constants } from "../util/constants";
import { Observable } from "rxjs";

@Injectable()
export class ImageService {

    private url: string = Constants.HOST + "/api/files/";

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