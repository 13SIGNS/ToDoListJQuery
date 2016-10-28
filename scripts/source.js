var Tasks;
$('document').ready(function () {
    loadData();
    printAllTasks();
    onSubmit();
    addNewTaskLS();
    setTaskLabelLS();
    removeTaskLS();
    setTaskDoneLS();
    updateTaskContentLS();
});

function loadData() {
    var localTasks = JSON.parse(localStorage.getItem("LuzzedroToDoListTasks"));
    Tasks = localTasks === null ? [] : localTasks;
}

function synchronizeData() {
    localStorage.setItem("LuzzedroToDoListTasks", JSON.stringify(Tasks));
}

function printAllTasks() {
    for (i = 0; i < Tasks.length; ++i) {
        printTask(Tasks[i]);
    }
    toggleLeadInfo();
}

function addNewTaskLS() {
    $('.addNewTaskLS').on('click', function () {
        addNewTask();
    });
}

function onSubmit() {
    $('form').on('submit', function () {
        addNewTask();
    });
}

function addNewTask() {
    removeErrorInfo();
    if (isTaskEmpty()) {
        addErrorInfo();
    } else {
        var Task = {
            content: $('#task').val(),
            label: 'default',
            status: 'undone'
        };
        Tasks.push(Task);
        printTask(Task);
    }
    toggleLeadInfo();
    clearTaskInput();
};

function clearTaskInput(){
    $('#task').val('');
}

function removeErrorInfo() {
    if ($('.task-error').length > 0) {
        $('.task-error').remove();
    }
}

function toggleLeadInfo() {
    if (Tasks.length > 0) {
        $('#lead-info').hide();
    } else {
        $('#lead-info').show();
    }
}

function addErrorInfo() {
    $('#task-group').after('<div class="form-group task-error"><div class="alert alert-danger">This field is required</div></div>');
}

function isTaskEmpty() {
    return $('#task').length > 0 ? false : true;
}

function printTask(Task) {
    var taskMockup = $('#task-mockup').clone().attr('id', Tasks.indexOf(Task));
    taskMockup.find('.task-content').val(Task.content);
    taskMockup.find('.task-content, .set-task-done, .set-task-label, .remove-task, .set-task-label-button').attr('data-target-id', Tasks.indexOf(Task));
    var taskBox = $('#tasks-box');
    taskMockup.find('.task-content').addClass('alert-' + Task.label);
    taskBox.prepend(taskMockup);
    synchronizeData();
}

function setTaskLabelLS() {
    $('#tasks-box').on('click', '.setTaskLabelLS', function () {
        var el = $(this);
        var taskId = el.attr('data-target-id');
        var label = el.attr('data-label');
        Tasks[taskId].label = label;
        $('.task-content[data-target-id="' + taskId + '"]')
            .removeClass('alert-danger')
            .removeClass('alert-success')
            .removeClass('alert-info')
            .removeClass('alert-warning')
            .removeClass('alert-primary')
            .removeClass('alert-default')
            .addClass('alert-' + label);
        synchronizeData();
    });
}

function removeTaskLS() {
    $('#tasks-box').on('click', '.removeTaskLS', function () {
        var taskId = $(this).attr('data-target-id');
        Tasks.splice(taskId, 1);
        $('#' + taskId).remove();
        synchronizeData();
        toggleLeadInfo();
    });
}
function setTaskDoneLS() {
    $('#tasks-box').on('click', '.setTaskDoneLS', function () {
        var el = $(this);
        var taskId = el.attr('data-target-id');
        el.parent().remove();
        el.remove();
        $('.set-task-label-button[data-target-id="' + taskId + '"]').remove();
        $('.task-content[data-target-id="' + taskId + '"]')
            .css('text-decoration', 'line-through')
            .prop('disabled', true);
        Tasks[taskId].status = 'done';
        synchronizeData();
    });
}

function updateTaskContentLS() {
    $('#tasks-box').on('keyup', '.updateTaskContentLS', function () {
        var el = $(this);
        var taskId = el.attr('data-target-id');
        Tasks[taskId].content = el.val();
        synchronizeData();
    });
}