export default class Tooltip {
    constructor(parentEl) {
        this.parentEl = parentEl;
        this.onClick = this.onClick.bind(this);
    }

    static formMarkup() {
        return `
        <div class="wrapper">
            <form class="btn-form">
                <button class="submit" title="Popover title" data-content="And here's some amazing content. It's very engaging. Right?">
                    Click to toggle popover
                </button>
            </form>
        </div>
        `
    }

    static tooltipMarkup(headerContent, bodyContent) {
        return `
        <div class="btn-tooltip arrow">
            <h3 class="tooltip-header">${headerContent}</h3>
            <div class="tooltip-body">${bodyContent}</div>
        </div>
        `
    }

    showTooltipMessage() {
        const headerContent = this.parentEl.querySelector('.submit').getAttribute('title');
        const bodyContent = this.parentEl.querySelector('.submit').getAttribute('data-content');
        const tooltipElement = Tooltip.tooltipMarkup(headerContent, bodyContent);

        document.body.querySelector('.wrapper').insertAdjacentHTML('afterbegin', tooltipElement);

    }

    removeTooltipMessage() {
        const tooltipElement = this.parentEl.querySelector('.btn-tooltip');
        this.parentEl.querySelector('.wrapper').removeChild(tooltipElement);
    }

    bindToDOM() {
        this.parentEl.insertAdjacentHTML('afterbegin', Tooltip.formMarkup());
        this.divEl = this.parentEl.querySelector('.wrapper');
        this.divEl.addEventListener('submit', this.onClick);

    }

    onClick(e) {
        e.preventDefault();

        if (!this.isTooltipOn) {
            this.showTooltipMessage();
            this.isTooltipOn = 'yes'
        } else {
            this.removeTooltipMessage();
            this.isTooltipOn = null;
        }
    }
 }