declare var $: any;

export function initSpoiler(): void {
    $(function () {
        $('div.spoiler-title').click(function () {
            $(this)
                .children()
                .first()
                .toggleClass('show-icon')
                .toggleClass('hide-icon');
            $(this)
                .parent().children().last().toggle();
        });
    });
}