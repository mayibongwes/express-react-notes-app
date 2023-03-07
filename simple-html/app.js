class App{
    constructor(){
        // Get controls
        this.$addNewItemInput = document.querySelector("input[name='todo-item'");
        this.$addNewItemForm = this.$addNewItemInput.closest("form")
        this.$submitBtn = this.$addNewItemForm.querySelector("button")
        this.$logoutBtn = document.querySelector(".logout");
        this.$todoList = document.querySelector(".todo-list");
        this.$footerText = document.querySelector(".footer").querySelector("p")
        console.log(this.$footerText);

        this.loadNotes();
        this.addEventListenders();
        this.render();
    }

    addEventListenders(){
        document.body.addEventListener("click",(Event) => {
            Event.preventDefault();
            switch (Event.target) {
                case this.$submitBtn:
                    this.createNote();
                    break;
                case this.$logoutBtn:
                    console.log("logout button pressed");
                    break;
                default:
                    // handle other buttons
                    break;
            }
            
        })

        this.$addNewItemForm.addEventListener("submit", (Event) => {
            Event.preventDefault();
            this.createNote();
        })
    }

    handleNoteAction(event){

        const form = event.target.closest(".list-item");
        const id = form.dataset.id;
        const isComplete = form.dataset.complete;
        const noteTitleElem = form.querySelector(".note-title");

        var fnString = "handle" + event.target.dataset.action;
        // function we want to run
        try {
            this.fn = this[fnString];
            this.fn({btn:event.target,id:id,complete:isComplete,note:noteTitleElem});
        } catch (error) {
            console.log("function", fnString, "does not exist", "\n",error);
        }
        
    }

    handleEdit({btn,note}){
        note.removeAttribute("disabled");
        btn.dataset.action = "Confirm";
        btn.classList.remove("fa-edit");
        btn.classList.add("fa-check");
        btn.style.color = "chartreuse";
        note.focus();
    }

    handleConfirm({id,note}){
        this.Notes = this.Notes.map(n => {
            return n.id == id ? {...n,title:note.value} : {...n};
        });

        this.saveNotes();
    }

    handleCheck({id}){
        this.Notes = this.Notes.map(note => {
            return note.id == id ? {...note,complete:!note.complete} : {...note};
        });
        this.saveNotes();
    }

    handleDelete({id}){
        this.Notes = this.Notes.filter(note => note.id != id);
        this.saveNotes();
    }

    initializeNotes(){
        this.Notes = [
            {
                id: 1,
                title: "Sample Incomplete Note",
                complete: false
            },
            {
                id: 2,
                title: "Sample Complete Note",
                complete: true
            }
        ];
        localStorage.setItem("Notes",JSON.stringify(this.Notes))
    }

    loadNotes(){
        this.Notes = JSON.parse(localStorage.getItem("Notes"))
        if(this.Notes == null || this.Notes == undefined){
            console.log("No notes in System, creating blank Notes");
            this.initializeNotes();
        }
    }

    saveNotes(){
        localStorage.setItem("Notes",JSON.stringify(this.Notes))
        this.render();
    }

    render(){
        let notesElem = "";
        let outCount = 0;

        this.Notes.forEach(({id,complete, title}) => {
            if (!complete)
                outCount += 1;

            notesElem += `<form data-id="${id}" data-complete="${complete}" class="list-item" action="">
                            <div class="check"><i data-action="Check" onclick="app.handleNoteAction(event)" class="fa-regular ${complete ? 'fa-square-check' : 'fa-square'}"></i></div>
                            <div class="desc">
                                <input class="note-title" type="text" value="${title}" name="item1" placeholder="item text here" disabled="true"/>
                                <span class="${complete ? 'strike':'active'}"></span>
                            </div>
                            <div class="actions">
                                <button class="edit"><span data-action="Edit" onclick="app.handleNoteAction(event)" class="fa-solid fa-edit fa-xl"></span></button>
                                <button class="delete"><span data-action="Delete" onclick="app.handleNoteAction(event)" class="fa-solid fa-trash fa-xl"></span></button>
                            </div>
                        </form>`;
        });
        this.$todoList.innerHTML = notesElem;
        this.$footerText.innerHTML = outCount + " Item(s) outstanding";
    }

    createNote(){
        const newNote = {
            "id": Date.now(),
            "title": this.$addNewItemInput.value,
            "complete": false
        }
        this.Notes.push(newNote);
        this.$addNewItemInput.value = "";
        this.saveNotes();
    }
    
}