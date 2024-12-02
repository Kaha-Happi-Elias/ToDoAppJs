const nam = document.getElementById("taskIn");
const Tasks = document.getElementById("tasks");

let tasksData = JSON.parse(localStorage.getItem("tasksData")) || [];

const createNote = (uip, uid, title, text, date, completed) => {
    const notesWrapper = document.getElementById(`notes-wrapper-${uip}`);
    if (!notesWrapper) {
        console.error("notesWrapper element not found!");
        return;
    }

    const note = document.createElement("div");
    note.className = 'note';
    note.id = uid;
    note.innerHTML = `
        <div class="note-complete">
            <label for="complete-${uid}">Complete</label>
            <input type="checkbox" id="complete-${uid}" ${completed ? 'checked' : ''}>
        </div>
        <div class="note-title" contenteditable="false">${title}</div>
        <div class="note-controls">
            <button class="note-edit" data-uip="${uip}" data-uid="${uid}">Edit</button>
            <button class="note-save" style="display:none" data-uip="${uip}" data-uid="${uid}">Save</button>
            <button class="note-delete" data-uip="${uip}" data-uid="${uid}">Delete</button>
        </div>
        <div class="note-text" contenteditable="false">${text}</div>
        <div class="note-date">${date}</div>
    `;

    notesWrapper.insertBefore(note, notesWrapper.firstChild);// To insert the note at the first position to the notesWrapper
    //notesWrapper.appendChild(note); // Append the notes to the noteswrapper(at the last position of the list) 
    const checkbox = note.querySelector(`#complete-${uid}`);
    checkbox.addEventListener('change', () => toggleComplete(uip, uid));

    const editButton = note.querySelector('.note-edit');
    editButton.addEventListener('click', () => editNote(uip, uid));
    const saveButton = note.querySelector('.note-save');
    saveButton.addEventListener('click', () => saveNote(uip, uid));
    const deleteButton = note.querySelector('.note-delete');
    deleteButton.addEventListener('click', () => deleteNote(uip, uid));

    toggleComplete(uip, uid); // Initial toggle
};

const addNote = (uip) => {
    const title = document.getElementById(`title-${uip}`).value;
    const content = document.getElementById(`content-${uip}`).value;
    const error = document.getElementById(`form-error-${uip}`);
    error.style.color = '#b33030';
    error.style.position = 'absolute';
    error.style.bottom = '-45px';
    error.style.left = '0';

    if (title.trim().length === 0 || content.trim().length === 0) {
        error.innerHTML = `Note Can't be Empty<br>
        verify that the Title and Text input is being fill`;
        return;
    }

    const uid = new Date().getTime().toString();
    const noteObj = { uid, title, text: content, date: new Date().toLocaleDateString(), completed: false };
    // Add the note to the notesData array
    const taskIndex = tasksData.findIndex(task => task.uip === uip);
    if (taskIndex !== -1) {
        if (!tasksData[taskIndex].notes) {
            tasksData[taskIndex].notes = [];
        }
        tasksData[taskIndex].notes.push(noteObj);
        localStorage.setItem("tasksData", JSON.stringify(tasksData));
    }

    createNote(uip, noteObj.uid, noteObj.title, noteObj.text, noteObj.date, noteObj.completed);
    error.innerText = "";
    document.getElementById(`title-${uip}`).value = "";
    document.getElementById(`content-${uip}`).value = "";
};

const createTask = (uip, nam, date) => {
    if (!Tasks) {
        console.error("tasks element not found!");
        return;
    }
    const container = document.createElement("div");
    container.className = 'container';
    container.id = uip;
    container.innerHTML = `
        <div class="task-controls">
            <button class="task-edit" data-uip="${uip}">Edit</button>
            <button class="task-save" style="display:none" data-uip="${uip}">Save</button>
            <button class="task-delete" data-uip="${uip}">Delete</button>
        </div>
        <h2 class="task-title" contenteditable="false">${nam}</h2>
        <div class="new-note">
            <input type="text" name="title" id="title-${uip}" placeholder="Title">
            <textarea name="content" id="content-${uip}" placeholder="Write down the description of your title"></textarea>
            <div id="form-error-${uip}"></div>
        </div>
        <div class="button-container">
            <button class="add-btn" data-uip="${uip}">Add Note</button>
        </div>
        <div class="overflow">
            <div id="notes-wrapper-${uip}"></div>
        </div>
        <div class="task-date">${date}</div>
    `;

    Tasks.insertBefore(container, Tasks.firstChild);

    const editButton = container.querySelector('.task-edit');
    const saveButton = container.querySelector('.task-save');
    const deleteButton = container.querySelector('.task-delete');
    const addButton = container.querySelector('.add-btn');

    editButton.addEventListener('click', () => editTask(uip));
    saveButton.addEventListener('click', () => saveTask(uip));
    deleteButton.addEventListener('click', () => deleteTask(uip));
    addButton.addEventListener('click', () => addNote(uip));
};

const addTask = () => {
    const error = document.getElementById("form-error");

    if (nam.value.trim().length === 0) {
        error.innerHTML = "Task's name Can't be Empty";
        return;
    }

    const uip = new Date().getTime().toString();
    
    const taskObj = {
        uip: uip,
        nam: nam.value,
        date: new Date().toLocaleDateString(),
    };
    tasksData.push(taskObj);
    localStorage.setItem("tasksData", JSON.stringify(tasksData));

    createTask(taskObj.uip, taskObj.nam, taskObj.date);
    error.innerText = "";
    nam.value = "";
};

const editTask = (uip) => {
    const task = document.getElementById(uip);
    const taskNam = task.querySelector(".task-title");
    const taskSave = task.querySelector(".task-save");
    const taskEdit = task.querySelector(".task-edit");

    taskNam.contentEditable = "true";
    taskEdit.style.display = "none";
    taskSave.style.display = "block";
    taskNam.focus(); 
};

const saveTask = (uip) => {
    const task = document.getElementById(uip);
    const taskNam = task.querySelector(".task-title");
    const taskSave = task.querySelector(".task-save");
    const taskEdit = task.querySelector(".task-edit");

    if (taskNam.innerText.trim().length === 0) {
        error.innerHTML = "Task can't be empty";
        return;
    }

    const index = tasksData.findIndex((task) => task.uip === uip);
    if (index !== -1) {
        tasksData[index].nam = taskNam.innerText;
        localStorage.setItem("tasksData", JSON.stringify(tasksData));
        taskNam.contentEditable = "false";
        taskSave.style.display = "none";
        taskEdit.style.display = "block";
    }
};

const deleteTask = (uip) => {
    if (confirm("Are you sure you want to delete this task?")) {
        const index = tasksData.findIndex(task => task.uip === uip);
        if (index > -1) {
            tasksData.splice(index, 1);
            localStorage.setItem("tasksData", JSON.stringify(tasksData));
            document.getElementById(uip).remove();
        }
    }
};

const toggleComplete = (uip, uid) => {
    const note = document.getElementById(uid);
    const checkbox = note.querySelector(`#complete-${uid}`);
    const noteText = note.querySelector(".note-text");

    const noteTitle = note.querySelector(".note-title");
    const noteSave = note.querySelector(".note-save");
    const noteEdit = note.querySelector(".note-edit");

    if (!note || !checkbox) {
        console.error("Note or checkbox not found!");
        return;
    }

    const taskIndex = tasksData.findIndex(task => task.uip === uip);
    if (taskIndex === -1) {
        console.error("Task not found!");
        return;
    }
    
    const noteIndex = tasksData[taskIndex].notes.findIndex(note => note.uid === uid);
    if (noteIndex === -1) {
        console.error("Note not found!");
        return;
    }

    tasksData[taskIndex].notes[noteIndex].completed = checkbox.checked;
    localStorage.setItem("tasksData", JSON.stringify(tasksData));
    //noteText.style.textDecoration = checkbox.checked ? 'line-through' : 'none';
    if(checkbox.checked){
        noteText.style.color = 'black';
        noteTitle.style.color = 'black';
        noteText.style.textDecoration = 'line-through';
        noteEdit.style.display = "none";
        noteSave.style.display = "none";
    } else {
        noteText.style.color = 'black';
        noteTitle.style.color = 'black';
        noteText.style.textDecoration = 'none';
        noteTitle.contentEditable = "true";
        noteText.contentEditable = "true";
        noteEdit.style.display = "block";
        noteSave.style.display = "none";
    }
    /*tasksData.forEach(task => {
        if (task.notes) {
            tasksData[taskIndex].notes.sort((a, b) => b.completed - a.completed);
        }
    });*/
    tasksData[taskIndex].notes.sort((a, b) => b.completed - a.completed);
};

const editNote = (uip, uid) => {
    const note = document.getElementById(uid);
    const noteTitle = note.querySelector(".note-title");
    const noteText = note.querySelector(".note-text");
    const noteSave = note.querySelector(".note-save");
    const noteEdit = note.querySelector(".note-edit");

    noteTitle.contentEditable = "true";
    noteText.contentEditable = "true";
    noteEdit.style.display = "none";
    noteSave.style.display = "block";
    noteText.focus();
};

const saveNote = (uip, uid) => {
    const note = document.getElementById(uid);
    const noteTitle = note.querySelector(".note-title");
    const noteText = note.querySelector(".note-text");
    const noteSave = note.querySelector(".note-save");
    const noteEdit = note.querySelector(".note-edit");

    if (noteTitle.innerText.trim().length === 0 && noteText.innerText.trim().length === 0) {
        error.innerHTML = "Note can't be empty";
        return;
    }

    const taskIndex = tasksData.findIndex(task => task.uip === uip);
    if (taskIndex !== -1) {
        const noteIndex = tasksData[taskIndex].notes.findIndex(n => n.uid === uid);
        if (noteIndex !== -1) {
            tasksData[taskIndex].notes[noteIndex].title = noteTitle.innerText;
            tasksData[taskIndex].notes[noteIndex].text = noteText.innerText;
            localStorage.setItem("tasksData", JSON.stringify(tasksData));
            noteTitle.contentEditable = "false";
            noteText.contentEditable = "false";
            noteSave.style.display = "none";
            noteEdit.style.display = "block";
            error.innerText = ""; //Clear any error message
        } else {
            console.error("Note not found in tasksData");
            error.innerText = "Error saving note."; //Show an error
        }
    } else {
        console.error("Task not found in tasksData");
        error.innerText = "Error saving note."; //Show an error
    }
};
const deleteNote = (uip, uid) => {
    if (!confirm("Are you sure you want to delete this note?")) {
        return;
    }

    const taskIndex = tasksData.findIndex(task => task.uip === uip);
    if (taskIndex === -1) {
        console.error("Task not found!");
        return;
    }

    const noteIndex = tasksData[taskIndex].notes.findIndex(note => note.uid === uid);
    if (noteIndex === -1) {
        console.error("Note not found!");
        return;
    }

    tasksData[taskIndex].notes.splice(noteIndex, 1);
    localStorage.setItem("tasksData", JSON.stringify(tasksData));
    document.getElementById(uid).remove();
};

window.addEventListener('load', () => {
    tasksData.forEach(task => {
        createTask(task.uip, task.nam, task.date);
        if (task.notes) {
            task.notes.forEach(note => createNote(task.uip, note.uid, note.title, note.text, note.date, note.completed));
        }
    });
});