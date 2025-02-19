import DashboardState from "./DashboardSate";

import { getCoords } from "./get-offset";
import { addDashButton, addTaskButton, taskMarkUp, dashboardMarkUp, expandTasksStyle, expandDashboardsMarkup, editTask, editDashboard } from "./markups";

export default class Dashboard {
    constructor(parentEl) {
        this.parentEl = parentEl;
        this.onClick = this.onClick.bind(this);
        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
        this.onMouseOver = this.onMouseOver.bind(this);
        this.onEnter = this.onEnter.bind(this);
        this.onLeave = this.onLeave.bind(this);
        this.onEditItem = this.onEditItem.bind(this);
    }

    init() {

        this.parentEl.insertAdjacentHTML('afterbegin', addDashButton())

        const loadedElements = DashboardState.stateLoad()

        if (loadedElements){
            for (let el of loadedElements) {
                if (el[0] === 'H3') {
                    const addDashBtn = this.parentEl.querySelector('.add-dashboard');
                    addDashBtn.insertAdjacentHTML('beforebegin', dashboardMarkUp(el[1]));
                } else if (el[0] === 'DIV') {
                    const dashboards = document.body.querySelectorAll('.dashboard');
                    const addTaskBtn = dashboards[dashboards.length-1].querySelector('.add-task');
                    addTaskBtn.insertAdjacentHTML('beforebegin', taskMarkUp(el[1]))
                }
            }
        }
    }

    bindToDOM() {    
        this.init();
        this.reassignListeners()

        this.clickEvent = document.addEventListener('click', this.onClick);
    }

    onEnter(e) {
        const el = e.target;
        el.querySelector('.close').style.visibility = "visible";
        if (!el.classList.contains('task-edit') && !el.classList.contains('dashboard-edit')){
            if (el.querySelector('.edit')){
                el.querySelector('.edit').style.visibility = "visible";
            }
        }
    }

    onLeave(e) {
        const el = e.target;
        el.querySelector('.close').removeAttribute("style");
        if (!el.classList.contains('task-edit') && !el.classList.contains('dashboard-edit')){
            if (el.querySelector('.edit')){
                el.querySelector('.edit').removeAttribute("style");
            }
        }
    }

    onMouseDown(e) {
        e.preventDefault();

        this.movable = e.target.closest('.movable');
        const stopList = ['add-btn', 'add-task', 'btn', 'task-edit', 'dashboard-edit', 'text-input', 'edit']
        const elClassList = e.target.classList
        
        if (stopList.filter(element => elClassList.contains(element)).length === 0 && this.movable) {

            this.editAndClose()

            const movablePosiiton = getCoords(this.movable, e)

            this.movableX = movablePosiiton.dx;
            this.movableY = movablePosiiton.dy;

            this.movable.style.width = movablePosiiton.width;
            this.movable.style.height = movablePosiiton.height;

            if (this.movable.classList.contains('task')){
                this.movable.classList.remove('task');
                this.movable.classList.add('dragged-task');
            } else if(this.movable.classList.contains('dashboard')) {
                this.movable.classList.remove('dashboard');
                this.movable.classList.add('dragged-dashboard');
                
                this.movable.insertAdjacentHTML('beforebegin', expandDashboardsMarkup(this.movable.style.height));
            }

            document.documentElement.addEventListener('mouseup', this.onMouseUp);
            document.documentElement.addEventListener('mouseover', this.onMouseOver);
        }
    }

    onMouseUp() {
        if (this.movable.classList.contains('dragged-task')){
            if (this.activeTask) {
                this.activeTask.insertAdjacentElement('beforebegin', this.movable);
            }

            if (this.movable.classList.contains('dragged-task')) {
                this.movable.classList.remove('dragged-task');
                this.movable.classList.add('task');
            }

            this.movable.removeAttribute('style');
            this.movable = undefined;
            this.activeTask = undefined;

            const expanded = document.body.querySelectorAll('.task, .dashboard, .add-task');

            for (let el of expanded) {
                el.removeAttribute('style');
            }

        } else if (this.movable.classList.contains('dragged-dashboard')) {

            if (this.activeDashboard) {
                this.activeDashboard.insertAdjacentElement('beforebegin', this.movable);
            }

            if(this.movable.classList.contains('dragged-dashboard')) {
                this.movable.classList.remove('dragged-dashboard');
                this.movable.classList.add('dashboard');
            }

            this.movable.removeAttribute('style');
            this.movable = undefined;
            this.activeDashboard = undefined;
            
            if (document.body.querySelector('.occupy')){
                this.closeElement(document.body.querySelector('.occupy'))
            }

            
        }

        document.documentElement.removeEventListener('mouseup', this.onMouseUp);
        document.documentElement.removeEventListener('mouseover', this.onMouseOver);

        DashboardState.stateSave();
    }

    onMouseOver(e) {

        if (this.movable.classList.contains('dragged-task')){
            this.movable.style.top = e.pageY - this.movableY + 'px';
            this.movable.style.left = e.pageX - this.movableX  + 'px';

            if (e.target.closest('.task')) {
                this.activeTask = e.target.closest('.task'); 
                this.moveTask()
                
            } else if (e.target.classList.contains('add-task')){
                this.activeTask = e.target;
                this.moveTask()
            }

        } else if (this.movable.classList.contains('dragged-dashboard')) {
            this.movable.style.top = e.pageY - this.movableY + 'px';
            this.movable.style.left = e.pageX - this.movableX + 'px';

            if (e.target.closest('.dashboard')) {
                this.activeDashboard = e.target.closest('.dashboard'); 
                this.moveDashboard();
                
            } else if (e.target.classList.contains('add-dashboard')){
                this.activeDashboard = e.target;
                this.moveDashboard();
            } 
        }
    }

    moveTask() {
        this.remmoveStyleAttribute('.task, .dashboard, .add-task')

        this.activeTask.style.cssText = expandTasksStyle(this.movable.style.height);
    }

    moveDashboard() {
        const expanded = document.body.querySelector('.occupy');

        if (expanded){
            this.closeElement(expanded)
        }
        
        this.activeDashboard.insertAdjacentHTML('beforebegin', expandDashboardsMarkup(this.movable.style.height));

    }

    onClick(e) {
        e.preventDefault();


        const activeElement = e.target;

        if (!activeElement.classList.contains('text-input')) {
            this.editAndClose()

        if (activeElement.classList.contains('add-dashboard')) {
            activeElement.insertAdjacentHTML('beforebegin', editDashboard());
            document.body.querySelector('.add-dashboard').style.display = "none";
            this.activeParent = activeElement.parentElement;
            this.activeParent.querySelector('.text-input').focus();
        } else if (activeElement.classList.contains('add-task')) {
            activeElement.insertAdjacentHTML('beforebegin', editTask());
            activeElement.style.display = "none";
            this.activeParent = activeElement.parentElement;
            this.activeParent.querySelector('.text-input').focus();
        } else if (activeElement.classList.contains('close')) {
            this.closeElement(activeElement.parentElement);
        } 

        this.reassignListeners()

        DashboardState.stateSave();
    }
        
    }


    reassignListeners() {

        const movable = this.parentEl.querySelectorAll('.movable');
        const dashboards = document.body.querySelectorAll('.dashboard');
        const tasks = document.body.querySelectorAll('.task');
        const editItem = document.body.querySelectorAll('.edit');


        for (let el of movable) {
            el.addEventListener('mousedown', this.onMouseDown)
        }

        for (let el of dashboards) {
            el.addEventListener('mouseenter', this.onEnter);
            el.addEventListener('mouseleave', this.onLeave)
        }

        for (let el of tasks) {
            el.addEventListener('mouseenter', this.onEnter);
            el.addEventListener('mouseleave', this.onLeave)
        }

        for (let el of editItem) {
            el.addEventListener('click', this.onEditItem);
        }


    }

    closeElement(el) {
        el.remove();
    }


    onEditItem(e) {
        // const el = e.target.parentElement;
        // console.log(`let's edit ${el}`)

        // if (el.classList.contains('dashboard')) {
        //     // el.
        //     // this.activeParent = el.parentElement;
        //     // this.activeParent.querySelector('.text-input').focus();
        // } else if (el.classList.contains('task')) {
        //     el.insertAdjacentHTML('afterend', editTask());
        //     el.parentElement.querySelector('.text-input').focus();
        //     this.closeElement(el);
        // }
    }

    editAndClose() {

        const dashEditActive = document.body.querySelector('.dashboard-edit');
        const taskEditActive = document.body.querySelector('.task-edit');
        const textInputActive = document.body.querySelector('.text-input');

        if(taskEditActive){

            if(!textInputActive.textContent) {
                this.closeElement(taskEditActive);
            } else {

                taskEditActive.classList.remove('task-edit');
                taskEditActive.classList.add('movable');

                textInputActive.classList.remove('text-input');
                textInputActive.removeAttribute('contenteditable');
                textInputActive.removeAttribute('data-placeholder');
                }

            this.remmoveStyleAttribute('.add-task')
        }

        if(dashEditActive) {
            if(!textInputActive.textContent) {
                this.closeElement(dashEditActive);
            } else {

                dashEditActive.classList.remove('dashboard-edit');
                dashEditActive.classList.add('movable');
                dashEditActive.insertAdjacentHTML('beforeend', addTaskButton())

                textInputActive.classList.remove('text-input');
                textInputActive.removeAttribute('contenteditable');
                textInputActive.removeAttribute('data-placeholder');

            }

            this.remmoveStyleAttribute('.add-dashboard')
        }
    }

    remmoveStyleAttribute(selector) {
        console.log(`removed ${selector}`)
        const elements = document.body.querySelectorAll(selector);

        for (let el of elements) {
            el.removeAttribute('style')
        }
    }
}