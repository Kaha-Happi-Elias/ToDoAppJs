/*const notesWrapper = document.getElementById("notes-wrapper");
const title = document.getElementById("title");
const content = document.getElementById("content");
const error = document.getElementById("form-error");

let notesData = JSON.parse(localStorage.getItem("notesData")) || []; // Load from localStorage


const createNote = (uid, title, text, date, completed) => {
    if (!notesWrapper) { //Check if notesWrapper exists
        console.error("notesWrapper element not found!");
        return;
    }

    const completeCheckbox = document.createElement('input');
    completeCheckbox.type = 'checkbox';
    completeCheckbox.id = `complete-${uid}`; // Unique ID for each checkbox
    completeCheckbox.addEventListener('change', () => toggleComplete(uid)); // Add event listener

    const note = document.createElement("div");
    note.className = 'note';
    note.id = uid;
    note.innerHTML =`
    <div class="note-complete">
        <label for="complete-${uid}">Complete</label>
        <input type="checkbox" id="complete-${uid}">
    </div>

    <div class="note-title">${title}</div>
    <div class="note-controls">
        <button class="note-edit" onclick="editNote('${uid}')"> Edit </button>
        <button class="note-save" style="display:none" onclick="saveNote('${uid}')"> Save </button>
        <button class="note-delete" onclick="deleteNote('${uid}')"> Delete </button>
    </div>
    <div class="note-text"> ${text} </div>    
     <div class="note-date"> ${date} </div>  
    `;
    notesWrapper.insertBefore(note, notesWrapper.firstChild);
    completeCheckbox.checked = completed; // Set initial checkbox state
    toggleComplete(uid); //Apply strikethrough initially if completed
    attachCheckboxListener(uid);
};

const toggleComplete = (uid) => {
    const note = document.getElementById(uid);
    const checkbox = document.getElementById(`complete-${uid}`);
    const noteText = note.querySelector(".note-text");

    const index = notesData.findIndex((noteObj) => noteObj.uid === uid);
    if (index !== -1) {
        notesData[index].completed = checkbox.checked;
        localStorage.setItem("notesData", JSON.stringify(notesData));
        noteText.style.textDecoration = checkbox.checked ? 'line-through' : 'none';
    }
};

const addNote = () => {
    if(title.value.trim().length === 0 && content.value.trim().length === 0){
        error.innerHTML = "Note Can't be Empty";
        return;
    }

    const uid = new Date().getTime().toString();

    const noteObj = {
        uid: uid,
        title: title.value,
        text: content.value,
        date: new Date().toLocaleDateString(),
        completed: false // Add completed property, initially false
    };
    notesData.push(noteObj);
    localStorage.setItem("notesData", JSON.stringify(notesData));

    createNote(noteObj.uid, noteObj.title, noteObj.text, noteObj.date, noteObj.completed);

    error.innerText = "";
    content.value = "";
    title.value = "";
};


const editNote = (uid) => {
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

const saveNote = (uid) => {
    const note = document.getElementById(uid);
    const noteTitle = note.querySelector(".note-title");
    const noteText = note.querySelector(".note-text");
    const noteSave = note.querySelector(".note-save");
    const noteEdit = note.querySelector(".note-edit");

    if(noteTitle.innerText.trim().length === 0 && noteText.innerText.trim().length === 0){
        error.innerHTML = "Note can't be empty";
        return;
    }

    const index = notesData.findIndex((note) => note.uid === uid);
    if (index !== -1) {
        notesData[index].title = noteTitle.innerText;
        notesData[index].text = noteText.innerText;
    }

    localStorage.setItem("notesData", JSON.stringify(notesData));

    noteTitle.contentEditable = 'false';
    noteText.contentEditable = 'false';
    noteEdit.style.display = 'block';
    noteSave.style.display = 'none';
    error.innerText = '';

};

// ... (createNote, toggleComplete, addNote, editNote functions remain the same) ...

const deleteNote = (uid) => {
    let confirmDelete = confirm("Are you sure you want to delete this?");
    if (!confirmDelete) {
        return;
    }

    const note = document.getElementById(uid);
    if (note) {
        note.parentNode.removeChild(note);
    }
    notesData = notesData.filter((note) => note.uid !== uid);
    localStorage.setItem("notesData", JSON.stringify(notesData));
};

// Load notes on page load
window.addEventListener("load", () => {
    notesData = JSON.parse(localStorage.getItem("notesData")) || []; //Improved handling of null localStorage

    notesData.forEach((note) => {
        createNote(note.uid, note.title, note.text, note.date, note.completed);
    });
});


//Attach event listener only once (after createNote)
function attachCheckboxListener(uid) {
    const checkbox = document.getElementById(`complete-${uid}`);
    if (checkbox) { //check if checkbox element exists
        checkbox.addEventListener('change', () => {
            toggleComplete(uid); //Use the toggleComplete function for consistency
        });
    } else {
        console.warn(`Checkbox with ID complete-${uid} not found.`);
    }
}



/*const deleteNote = (uid) =>{
    let confirmDelete = confirm("Are you sure you want to delete this?");
    if(!confirmDelete){
        return;
    }

    const note = document.getElementById(uid);
    if(note){
        note.parentNode.removeChild(note);
    }
    //note.parentNode.removeChild(note);
    notesData = notesData.filter((note) => note.uid !== uid);
    localStorage.setItem("notesData", JSON.stringify(notesData));
};

// Load notes on page load
window.addEventListener("load", () => {
    notesData = localStorage.getItem("notesData") ? JSON.parse(localStorage.getItem("notesData")) : [];

    notesData.forEach((note) => {
        createNote(note.uid, note.title, note.text, note.date, note.completed);

        //Set initial state of checkbox
        const checkbox = document.getElementById(`complete-${note.uid}`);
        
        checkbox.addEventListener('change', ($event) =>{
            if($event.target.checked){
                const noteText = document.getElementById(note.uid).querySelector(".note-text");
                noteText.style.backgroundColor = 'red';
                localStorage.setItem("notesData", JSON.stringify(notesData));
            } else {
                const noteText = document.getElementById(note.uid).querySelector(".note-text");
               noteText.style.backgroundColor = 'white';
            }
        });
    });
});*/




const notesWrapper = document.getElementById("notes-wrapper");
const title = document.getElementById("title");
const content = document.getElementById("content");
const error = document.getElementById("form-error");

let notesData = JSON.parse(localStorage.getItem("notesData")) || []; // Load from localStorage, use || [] for null case

const createNote = (uid, title, text, date, completed) => {
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
            <button class="note-edit" onclick="editNote('${uid}')">Edit</button>
            <button class="note-save" style="display:none" onclick="saveNote('${uid}')">Save</button>
            <button class="note-delete" onclick="deleteNote('${uid}')">Delete</button>
        </div>
        <div class="note-text" contenteditable="false">${text}</div>
        <div class="note-date">${date}</div>
    `;

    notesWrapper.insertBefore(note, notesWrapper.firstChild);
    note.querySelector(`#complete-${uid}`).addEventListener('change', () => toggleComplete(uid)); // Add event listener here
    toggleComplete(uid); //Apply strikethrough initially if completed

};

const toggleComplete = (uid) => {
    const note = document.getElementById(uid);
    const checkbox = document.getElementById(`complete-${uid}`);
    const noteText = note.querySelector(".note-text");

    const noteTitle = note.querySelector(".note-title");
    const noteSave = note.querySelector(".note-save");
    const noteEdit = note.querySelector(".note-edit");

    const index = notesData.findIndex((noteObj) => noteObj.uid === uid);
    if (index !== -1) {
        notesData[index].completed = checkbox.checked;
        localStorage.setItem("notesData", JSON.stringify(notesData));
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
    }
};

const addNote = () => {
    if (title.value.trim().length === 0 && content.value.trim().length === 0) {
        error.innerHTML = "Note Can't be Empty";
        return;
    }

    const uid = new Date().getTime().toString();

    const noteObj = {
        uid: uid,
        title: title.value,
        text: content.value,
        date: new Date().toLocaleDateString(),
        completed: false // Add completed property, initially false
    };
    notesData.push(noteObj);
    localStorage.setItem("notesData", JSON.stringify(notesData));

    createNote(noteObj.uid, noteObj.title, noteObj.text, noteObj.date, noteObj.completed);

    error.innerText = "";
    content.value = "";
    title.value = "";
};


const editNote = (uid) => {
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

const saveNote = (uid) => {
    const note = document.getElementById(uid);
    const noteTitle = note.querySelector(".note-title");
    const noteText = note.querySelector(".note-text");
    const noteSave = note.querySelector(".note-save");
    const noteEdit = note.querySelector(".note-edit");

    if (noteTitle.innerText.trim().length === 0 && noteText.innerText.trim().length === 0) {
        error.innerHTML = "Note can't be empty";
        return;
    }

    const index = notesData.findIndex((note) => note.uid === uid);
    if (index !== -1) {
        notesData[index].title = noteTitle.innerText;
        notesData[index].text = noteText.innerText;
        localStorage.setItem("notesData", JSON.stringify(notesData));
        noteTitle.contentEditable = "false";
        noteText.contentEditable = "false";
        noteSave.style.display = "none";
        noteEdit.style.display = "block";
    }
};


// Add deleteNote function here (you'll need to implement this)
const deleteNote = (uid) => {
    let confirmDelete = confirm("Are you sure you want to delete this?");
    if(!confirmDelete){
        return;
    }

    const index = notesData.findIndex(note => note.uid === uid);
    if (index > -1) {
        notesData.splice(index, 1);
        localStorage.setItem("notesData", JSON.stringify(notesData));
        document.getElementById(uid).remove();
    }
};


//Initial Load of Notes from localStorage
window.addEventListener('load', () => {
    notesData.forEach(note => createNote(note.uid, note.title, note.text, note.date, note.completed));
});
