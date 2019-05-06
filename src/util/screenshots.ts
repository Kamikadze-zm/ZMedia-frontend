export function processScreenshots(): void {
    let spoiler: HTMLElement = <HTMLElement>document.getElementsByClassName('spoiler-content')[0];
    if (spoiler && spoiler.id != 'links') {
        spoiler.style.textAlign = 'center';
        let links = spoiler.getElementsByTagName('a');
        for (let i = 0; i < links.length; i++) {
            links[i].setAttribute('data-lightbox', 'screens');
            links[i].setAttribute('href', links[i].getAttribute('href').replace('th_', ''));
        }
        let imgs = spoiler.getElementsByTagName('img');
        for (let i = 0; i < imgs.length; i++) {
            let src: string = imgs[i].getAttribute('src');
            let nameStartIndex: number = src.lastIndexOf('/') + 1;
            let name: string = src.substring(nameStartIndex);
            if (name.startsWith('th_')) {
                imgs[i].removeAttribute('style');
                imgs[i].style.width = '300px';
                imgs[i].style.height = 'auto';
            }
        }
    }
}
