export default class DashboardState {
    static stateSave() {
        const elements = document.body.querySelectorAll('h3, div.task-card');

        let elementsList = [];

        for (let el of elements) {
            if (!el.classList.contains('text-input')){
                elementsList.push([el.tagName, el.textContent]);
            }
        }

        localStorage.setItem('Dashboard', JSON.stringify(elementsList));
    }

    static stateLoad() {
        return JSON.parse(localStorage.getItem('Dashboard'));
    }
}