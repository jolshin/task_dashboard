import Dashboard from "./Dashboard";

const parentEl = document.body.querySelector('.wrapper');

const dashboard = new Dashboard(parentEl);

dashboard.bindToDOM();