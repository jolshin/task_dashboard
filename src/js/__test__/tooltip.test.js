import Tooltip from "../Tooltip";


const parentEl = document.body;
const tooltipFactory = new Tooltip(parentEl);

tooltipFactory.bindToDOM();

test('button JSDOM test' , () => {

    expect(parentEl.innerHTML).toEqual(Tooltip.formMarkup())

});


test('tooltip JSDOM test' , () => {

    const headerContent = "Popover title";
    const bodyContent = "And here's some amazing content. It's very engaging. Right?";
    tooltipFactory.showTooltipMessage()

    expect(parentEl.querySelector('.btn-tooltip').innerHTML).toEqual(Tooltip.tooltipMarkup(headerContent, bodyContent))

})
    