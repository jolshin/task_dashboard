export function addDashButton() {
    return `<div class="add-dashboard add-btn">Add dashboard</div>`
}

export function addTaskButton() {
    return `<div class="add-task btn">+ Add task</div>`
}

export function expandTasksStyle(marginTop) {
    return `
        margin-top: ${marginTop};
        transition: 500ms;
    `
}

export function expandDashboardsMarkup(heightEl) {
    return `
        <div class="occupy" style="height: ${heightEl};"></div>
        `
}

export function taskMarkUp(content) {
    return `
        <div class="task movable">
            <span class="close btn">&times;</span>
            <span class="edit btn">&hellip;</span>
            <div class="task-card">${content}</div>
        </div>
        `

}

export function dashboardMarkUp(content) {
    return `
        <div class="dashboard movable">
            <span class="close btn">×</span>
            <span class="edit btn">&hellip;</span>
            <div class="dashboard-title">
                <h3>${content}</h3>
            </div>
            <div class="add-task btn">+ Add task</div>
        </div>
        `
}

export function editTask() {
    return `
        <div class="task-edit task">
            <span class="close btn">&times;</span>
            <span class="edit btn" style="display: none;">&hellip;</span>
            <div class="task-card text-input" contenteditable data-placeholder="Enter a title for this task..."></div>
        </div>
        `
}

export function editDashboard() {
    return `
        <div class="dashboard-edit dashboard">
            <span class="close btn">&times;</span>
            <span class="edit btn" style="display: none;">&hellip;</span>
            <div class="dashboard-title"><h3 class="text-input" contenteditable data-placeholder="Enter a title for this dashboard..."></h3></div>
        </div>
        `
}