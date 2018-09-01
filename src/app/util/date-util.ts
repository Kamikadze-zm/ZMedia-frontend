const MONTHS: string[] = ["янв.", "февр.", "мар.", "апр.", "мая", "июн.", "июл.", "авг.", "сент.", "окт.", "нояб.", "дек."];

export function formatDate(ms: number): string {
    if (!ms) {
        return "";
    }
    let d: Date = new Date(ms);
    //"d MMM yyyy в HH:mm"
    let formattedDate: string =
        `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()} в ${padStart(d.getHours(), 2)}:${padStart(d.getMinutes(), 2)}`;

    return formattedDate;
}

export function padStart(number: number, targetLength: number): string {
    let string: string = number.toString();
    for (let i = string.length; i < targetLength; i++) {
        string = '0' + string;
    }
    return string;
}