export class Pagination {

    // сколько ссылок отображается начиная с самой первой (не может быть установлено в 0)
    readonly nPagesFirst: number;
    // сколько ссылок отображается слева от текущей (может быть установлено в 0)
    readonly nPagesPrev: number;
    // сколько ссылок отображается справа от текущей (может быть установлено в 0)
    readonly nPagesNext: number;
    // сколько ссылок отображается в конце списка страниц (не может быть установлено в 0)
    readonly nPagesLast: number;
    // показывать ли полностью все ссылки на страницы слева от текущей, или вставить многоточие
    readonly showAllPrev: boolean;
    // показывать ли полностью все ссылки на страницы справа от текущей, или вставить многоточие
    readonly showAllNext: boolean;

    readonly allPrevPages: Array<number>;
    readonly firstPages: Array<number>;
    readonly prevPages: Array<number>;
    readonly allNextPages: Array<number>;
    readonly nextPages: Array<number>;
    readonly lastPages: Array<number>;

    constructor(readonly currentPage: number, readonly pages: number) {
        this.nPagesFirst = 3;
        this.nPagesPrev = 2;
        this.nPagesNext = 2;
        this.nPagesLast = 3;
        this.showAllPrev = this.currentPage - this.nPagesPrev <= 1 + this.nPagesFirst;
        this.showAllNext = this.currentPage + this.nPagesNext >= this.pages - this.nPagesLast;

        this.allPrevPages = this.getAllPrevPages();
        this.firstPages = this.getFirstPages();
        this.prevPages = this.getPrevPages();
        this.allNextPages = this.getAllNextPages();
        this.nextPages = this.getNextPages();
        this.lastPages = this.getLastPages();
    }

    public isShowPrev(): boolean {
        return this.currentPage > 1;
    }

    public isShowAllPrev(): boolean {
        return this.showAllPrev && this.currentPage > 1;
    }

    public isShowFirstAndPrev(): boolean {
        return !this.showAllPrev;
    }

    public isShowAllNext(): boolean {
        return this.showAllNext && this.currentPage < this.pages;
    }

    public isShowNextAndLast(): boolean {
        return !this.showAllNext;
    }

    public isShowNext(): boolean {
        return this.currentPage + 1 <= this.pages;
    }

    public getAllPrevPages(): Array<number> {
        return this.getArray(1, this.currentPage);
    }

    public getFirstPages(): Array<number> {
        return this.getArray(1, this.nPagesFirst + 1);
    }

    public getPrevPages(): Array<number> {
        return this.getArray(this.currentPage - this.nPagesPrev, this.currentPage);
    }

    public getAllNextPages(): Array<number> {
        return this.getArray(this.currentPage + 1, this.pages + 1);
    }

    public getNextPages(): Array<number> {
        return this.getArray(this.currentPage + 1, this.currentPage + 1 + this.nPagesNext);
    }

    public getLastPages(): Array<number> {
        return this.getArray(this.pages - (this.nPagesLast - 1), this.pages + 1);
    }

    private getArray(start: number, end: number): Array<number> {
        let array: Array<number> = new Array<number>();
        if (end < start) {
            return array;
        }
        for (let i: number = start; i < end; i++) {
            array.push(i);
        }
        return array;
    }
}