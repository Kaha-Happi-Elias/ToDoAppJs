$(document).ready(function() {
    let tasks1Data = JSON.parse(localStorage.getItem("tasks1Data")) || [];

    const addNote = (uit) => {
        const title = $(`#title-${uit}`).val();
        const content = $(`#content-${uit}`).val();
        const error = $(`#form-error-${uit}`);

        error.css({ color: '#b33030'});

        if (title.trim().length === 0 || content.trim().length === 0) {
            error.html(`Note Can't be Empty<br>verify that the Title and Text input is being filled`);
            return;
        } else {
            error.css({display: 'none'});
        }

        const uid = new Date().getTime().toString();
        const noteObj = { uid, title, text: content, date: new Date().toLocaleDateString(), completed: false };

        const taskIndex = tasks1Data.findIndex(task => task.uit === uit);
        if (taskIndex !== -1) {
            tasks1Data[taskIndex].notes = tasks1Data[taskIndex].notes || []; 
            tasks1Data[taskIndex].notes.push(noteObj);
            localStorage.setItem("tasks1Data", JSON.stringify(tasks1Data));
        }

        createNote(uit, noteObj.uid, noteObj.title, noteObj.text, noteObj.date, noteObj.completed);
        $(`#title-${uit}`).val(""); 
        $(`#content-${uit}`).val(""); 
        
    };

    const createNote = (uit, uid, title, text, date, completed) => {
        const notesWrapper = $(`#notes-wrapper-${uit}`);
        if (notesWrapper.length === 0) {
            console.error("notesWrapper element not found!");
            return;
        }

        const note = $(`
            <div class="note overflow-hidden rounded position-relative d-flex justify-content-evenly align-self-center p-3 bg-light" id="${uid}">
                <div class="note-complete m-1">
                    <label for="complete-${uid}">Complete</label>
                    <input type="checkbox" id="complete-${uid}" ${completed ? 'checked' : ''}>
                </div>
                <div class="note-title fs-3 mb-2 w-100 text-start" contenteditable="false">${title}</div>
                <div class="note-controls d-flex fs-6 p-1 column-gap-3 position-absolute top-0 end-0">
                    <button class="btn note-edit text-success" data-uit="${uit}" data-uid="${uid}">Edit</button>
                    <button class="btn note-save text-primary" style="display:none" data-uit="${uit}" data-uid="${uid}">Save</button>
                    <button class="btn note-delete text-danger" data-uit="${uit}" data-uid="${uid}">Delete</button>
                </div>
                <div class="note-text mb-4 w-100 text-start" contenteditable="false">${text}</div>
                <div class="note-date position-absolute bottom-0 end-0 fs-6 w-100 mb-2">${date}</div>
            </div>
        `);

        notesWrapper.prepend(note);

        note.find(`#complete-${uid}`).change(function() { toggleComplete(uit, uid); });
        note.find('.note-edit').click(function() { editNote(uit, uid); });
        note.find('.note-save').click(function() { saveNote(uit, uid); });
        note.find('.note-delete').click(function() { deleteNote(uit, uid); });

        note.find('.note-save').hide(); //Hide save button initially
        toggleComplete(uit, uid); // Initial toggle
    };

    const toggleComplete = (uit, uid) => {
        const checkbox = $(`#complete-${uid}`);
        const $note = $(`#${uid}`);
        const noteText = $note.find('.note-text');
        const noteTitle = $note.find('.note-title');
        const noteSave = $note.find(".note-save");
        const noteEdit = $note.find('.note-edit');

        if (!checkbox.length || !$note.length) { //Check lengths of jQuery objects
            console.error("Note or checkbox not found!");
            return;
        }

        const taskIndex = tasks1Data.findIndex(task => task.uit === uit);
        if (taskIndex === -1) {
          console.error("Task not found!");
          return;
        }
    
        const noteIndex = tasks1Data[taskIndex].notes.findIndex(note => note.uid === uid);
        if (noteIndex === -1) {
          console.error("Note not found!");
          return;
        }
    
        tasks1Data[taskIndex].notes[noteIndex].completed = checkbox[0].checked;
        localStorage.setItem("tasks1Data", JSON.stringify(tasks1Data));
    
        if (checkbox.checked) {
          noteText.css({color: 'black', textDecoration: 'line-through'});
          noteTitle.css({color: 'black'});
          noteEdit.hide();
          noteSave.hide();
        } else {
            noteText.css({color: 'black', textDecoration: 'none'});
            noteTitle.css({color: 'black'});
            noteTitle.attr('contenteditable', true);
            noteText.attr('contenteditable', true);
            noteEdit.show();
            noteSave.hide();
        }
        tasks1Data[taskIndex].notes.sort((a, b) => b.completed - a.completed);
    };

    const editNote = (uit, uid) => {
        const $note = $(`#${uid}`);
        const $noteTitle = $note.find(".note-title");
        const $noteText = $note.find(".note-text");
        const $noteSave = $note.find(".note-save");
        const $noteEdit = $note.find(".note-edit");
    
        $noteTitle.attr("contenteditable", "true");
        $noteText.attr("contenteditable", "true");
        $noteEdit.hide();
        $noteSave.show();
        $noteText.focus();
    };
    
    const saveNote = (uit, uid) => {
        const $note = $(`#${uid}`);
        const $noteTitle = $note.find(".note-title");
        const $noteText = $note.find(".note-text");
        const $noteSave = $note.find(".note-save");
        const $noteEdit = $note.find(".note-edit");
        const error = $(`#form-error-${uit}`);
        //const errorElement = $note.find(".note-error"); //Display error near the note
    
        const title = $noteTitle.text().trim();
        const text = $noteText.text().trim();
    
        if (title.length === 0 || text.length === 0) {
            error.html(`Note Can't be Empty<br>verify that the Title and Text input is being filled`);
            return;
        } else {
            error.html("");
        }
    
        const taskIndex = tasks1Data.findIndex(task => task.uit === uit);
        if (taskIndex === -1) {
            showError(errorElement, "Error saving note: Task not found.");
            return;
        }
    
        const noteIndex = tasks1Data[taskIndex].notes.findIndex(n => n.uid === uid);
        if (noteIndex === -1) {
            showError(errorElement, "Error saving note: Note not found.");
            return;
        }
    
        tasks1Data[taskIndex].notes[noteIndex].title = title;
        tasks1Data[taskIndex].notes[noteIndex].text = text;
        localStorage.setItem("tasks1Data", JSON.stringify(tasks1Data));
        $noteTitle.attr("contenteditable", "false");
        $noteText.attr("contenteditable", "false");
        $noteSave.hide();
        $noteEdit.show();
        showSuccess(errorElement, "Note saved!"); //Show success message near the note
    };
    
    const deleteNote = (uit, uid) => {
        if (!confirm("Are you sure you want to delete this note?")) return;
    
        const taskIndex = tasks1Data.findIndex(task => task.uit === uit);
        if (taskIndex === -1) {
            showError($(`#${uid}`).find(".note-error"), "Error deleting note: Task not found."); //Show near the note
            return;
        }
    
        const noteIndex = tasks1Data[taskIndex].notes.findIndex(note => note.uid === uid);
        if (noteIndex === -1) {
            showError($(`#${uid}`).find(".note-error"), "Error deleting note: Note not found."); //Show near the note
            return;
        }
    
        tasks1Data[taskIndex].notes.splice(noteIndex, 1);
        localStorage.setItem("tasks1Data", JSON.stringify(tasks1Data));
        $(`#${uid}`).remove();
    };

    function showError(element, message) {
        element.text(message).addClass("text-danger").show();
        setTimeout(() => element.hide().removeClass("text-danger"), 3000); //Hide after 3 seconds
    }
    
    //Helper function to display success messages near the note
    function showSuccess(element, message) {
        element.text(message).addClass("text-success").show();
        setTimeout(() => element.hide().removeClass("text-success"), 3000); //Hide after 3 seconds
    }

    const createTask = (uit, nam, date) => {
        if ($('#tasks').length === 0) {
            console.error("tasks element not found!");
            return;
        }

        const $taskContainer = $(`<div class="col-md-4 mb-4" id="${uit}">`)
            .html(`<div class="container position-relative rounded p-1">
                <div class="container position-relative rounded p-3 mb-1">
                    <div class="task-controls d-flex fs-6 position-absolute top-0 end-0">
                        <button class="btn task-edit text-success" data-uit="${uit}">Edit</button>
                        <button class="btn task-save text-primary" style="display:none" data-uit="${uit}">Save</button>
                        <button class="btn task-delete text-danger" data-uit="${uit}">Delete</button>
                    </div>
                    <h2 class="text-light task-title fw-bold mt-4 mb-4">${nam}</h2>
                    <div class="new-note">
                        <input type="text" class="d-block p-3 border border-0 fs-2 w-100 rounded-top fw-bold" name="title1" id="title-${uit}" placeholder="Title">
                        <textarea name="content1" class="d-block p-3 border border-top-0 w-100 rounded-bottom" id="content-${uit}" placeholder="Write down the description of your title"></textarea>
                        <div id="form-error-${uit}" class="text-danger"></div>
                    </div>
                    <div class="button-container mt-4">
                        <button class="add-btn btn btn-success mb-2" data-uit="${uit}">Submit</button>
                    </div>
                    <div class="overflow-y-auto rounded mt-2">
                        <div id="notes-wrapper-${uit}"></div>
                    </div>
                    <div class="task-date text-light p-2 position-absolute bottom-0 end-0">${date}</div>
                </div>
            </div>`);
        $('#tasks').prepend($taskContainer);

        $taskContainer.find('.task-edit').click(function() { editTask(uit); }); //Corrected
        $taskContainer.find('.task-save').click(function() { saveTask(uit); }); //Corrected
        $taskContainer.find('.task-delete').click(function() { deleteTask(uit); }); //Corrected
        $taskContainer.find('.add-btn').click(function() { addNote(uit); }); //Corrected
    };

    const addTask = () => {
        const nam = $("#taskIn");
        const error = $("#form-error-1");

        if (nam.val().trim().length === 0) {
            error.text("Task name can't be empty");
            return;
        }

        const uit = new Date().getTime().toString(); // Use UUID for unique IDs
        const taskObj = { uit, nam: nam.val(), date: new Date().toLocaleDateString(), notes: [] };
        tasks1Data.push(taskObj);
        localStorage.setItem("tasks1Data", JSON.stringify(tasks1Data));
        createTask(taskObj.uit, taskObj.nam, taskObj.date);
        error.text("");
        nam.val("");
    };

    $("#taskBtn").click(addTask);

    const editTask = (uit) => {
        const $task = $(`#${uit}`);
        const $taskNam = $task.find(".task-title");
        const $taskSave = $task.find(".task-save");
        const $taskEdit = $task.find(".task-edit");

        $taskNam.attr("contenteditable", "true").focus();
        $taskEdit.hide();
        $taskSave.show();
    };

    const saveTask = (uit) => {
        const $task = $(`#${uit}`);
        const $taskNam = $task.find(".task-title");
        const $taskSave = $task.find(".task-save");
        const $taskEdit = $task.find(".task-edit");
        const error = $("#form-error-1");

        if ($taskNam.text().trim().length === 0) {
            error.text("Task can't be empty");
            return;
        }

        const index = tasks1Data.findIndex((task) => task.uit === uit);
        if (index !== -1) {
            tasks1Data[index].nam = $taskNam.text();
            localStorage.setItem("tasks1Data", JSON.stringify(tasks1Data));
            $taskNam.attr("contenteditable", "false");
            $taskSave.hide();
            $taskEdit.show();
            error.text("");
        }
    };

    const deleteTask = (uit) => {
        if (confirm("Are you sure you want to delete this task?")) {
            const index = tasks1Data.findIndex(task => task.uit === uit);
            if (index > -1) {
                tasks1Data.splice(index, 1);
                localStorage.setItem("tasks1Data", JSON.stringify(tasks1Data));
                $(`#${uit}`).remove();
            }
        }
    };

    tasks1Data.forEach(task => {
        createTask(task.uit, task.nam, task.date);
        if (task.notes) {
            task.notes.forEach(note => createNote(task.uit, note.uid, note.title, note.text, note.date, note.completed));
        }
    });

    $('.add-btn').on('click', function() { addNote($(this).data('uit')); });

});

