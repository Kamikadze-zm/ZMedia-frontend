export class Constants {
    public static HOST: string = `${window.location.protocol}//zmedia.xyz`;

    public static EMIAL_CONFIRMATION_SENDED_MESSAGE: string = 'На почту выслано сообщение с ссылкой для подтверждения email адреса';
    public static INVALID_VERIFICATION_CODE_MESSAGE: string = 'Некорректная ссылка или истек срок действия';

    public static CKEDITOR_CONFIG: any = {
        removeButtons: '',
        extraPlugins: 'spoiler'
    }
}