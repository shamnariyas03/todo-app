document.addEventListener('DOMContentLoaded', () =>{
    const taskInput=document.getElementById("task-input");

    const addTaskBtn=document.getElementById("add-task-btn");

    const taskList=document.getElementById("task-list");

    const emptyImage=document.querySelector(".empty-image");

    const todosContainer=document.querySelector(".todos-container");

    const progressBar=document.getElementById("progress");

    const progressNumbers=document.getElementById("numbers");

    const saveTasks = () => {
        const tasks = [];
    
        taskList.querySelectorAll("li").forEach(li => {
            tasks.push({
                text: li.querySelector("span").textContent,
                completed: li.querySelector(".checkbox").checked
            });
        });
    
        localStorage.setItem("tasks", JSON.stringify(tasks));
    };
    
    const loadTasks = () => {
        const storedTasks = JSON.parse(localStorage.getItem("tasks"));
    
        if (storedTasks) {
            storedTasks.forEach(task => {
                addTask(task.text, task.completed, false);
            });
        }
    };
    

    const toggleEmptyState =() =>{
        emptyImage.style.display=taskList.children.length===0 ? 'block':'none';
        todosContainer.style.width=taskList.children.length===0 ? '100%' : '50%';
    }


    const updateProgress=(checkCompletion = true) =>{
        const totalTasks =taskList.children.length;
        const completedTasks =taskList.querySelectorAll('.checkbox:checked').length;

        progressBar.style.width=totalTasks ? `${(completedTasks / totalTasks) * 100}%` : '0%';
        progressNumbers.textContent=`${completedTasks} / ${totalTasks}`;

        if(checkCompletion && totalTasks > 0 && completedTasks === totalTasks){
            Confetti();
        }

    };
        

    const addTask=(text,completed = false,checkCompletion=true ) =>{
        const taskText=text || taskInput.value.trim();
        if(!taskText){
            return;
        }
        const li=document.createElement("li");
        li.innerHTML=`
        <input type='checkbox' class='checkbox' ${completed ? 'checked' : ''}/>
        <span>${taskText}</span>
        <div class="task-buttons">
            <button class="edit-btn"><i class="fa-solid fa-pen"></i></button>
            <button class="delete-btn"><i class="fa-solid fa-trash"></i></button>
        </div>
        `;

        const checkbox=li.querySelector('.checkbox');

        const editBtn=li.querySelector('.edit-btn');

        if(completed){
            li.classList.add('completed');
            editBtn.disabled=true;
            editBtn.style.opacity='0.5';
            editBtn.style.pointerEvents='none';
        }

        checkbox.addEventListener('change',() =>{
            const isChecked=checkbox.checked;
            li.classList.toggle('completed',isChecked);
            editBtn.disabled=isChecked;
            editBtn.style.opacity=isChecked ?'0.5':'1';
            editBtn.style.pointerEvents=isChecked ?'none':'auto';
            updateProgress();
            saveTasks();
            

        });

        editBtn.addEventListener('click',() =>{
            if(!checkbox.checked){
                taskInput.value=li.querySelector('span').textContent;
                li.remove();
                toggleEmptyState();
                updateProgress(false);
                saveTasks();
            }
        });


        li.querySelector('.delete-btn').addEventListener('click', () => {
            li.remove();
            toggleEmptyState();
            updateProgress();
            saveTasks();
        });

        taskList.appendChild(li);
        taskInput.value="";
        toggleEmptyState();
        updateProgress(checkCompletion);
        saveTasks();
    
    };

   addTaskBtn.addEventListener("click",() => addTask());
   const form = document.querySelector('.input-area');
   if (form) {
       form.addEventListener('submit', (e) => {
           e.preventDefault();
           addTask();
       });
   }
   taskInput.addEventListener("keypress",(e) =>{
        if(e.key ==="Enter"){
            addTask();
        }

   });

   loadTasks();
   toggleEmptyState();
   updateProgress(false);
});


const Confetti = () => {
    const defaults = {
        spread: 360,
        ticks: 100,
        gravity: 0,
        decay: 0.94,
        startVelocity: 30,
        shapes: ["heart"],
        colors: ["FFC0CB", "FF69B4", "FF1493", "C71585"],
      };
      
      confetti({
        ...defaults,
        particleCount: 50,
        scalar: 2,
      });
      
      confetti({
        ...defaults,
        particleCount: 25,
        scalar: 3,
      });
      
      confetti({
        ...defaults,
        particleCount: 10,
        scalar: 4,
      });
}