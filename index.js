let dropdowns = document.querySelectorAll('.dropdown')
let checkBoxs = document.querySelectorAll('#checkBox')
let rightIcons = document.querySelector('.right')
let ul = document.querySelector('.ul')
let ul2 = document.querySelector('.ul2')
let inputTask = document.getElementById('inputTask')
let empty = document.getElementById('empty')
let addbtn = document.getElementById('addTaskBtn')
let addSound = new Audio("/images/add.wav")
let doneSound = new Audio("/images/done.wav")
const Tasks = JSON.parse(localStorage.getItem("task") || "[]");

function selectParentElement(elem, toSelect) {
  let l = elem.parentElement.parentElement

  return l.querySelector(toSelect)
}


checkBoxs.forEach(checkBox => {
  checkBox.addEventListener('click', handleCompleted)
})



function selectAllDropDowns() {
  return document.querySelectorAll('.dropdown')
}



inputTask.addEventListener('input', () => {

  if (inputTask.value) {
    addbtn.classList.add("enable")
  } else {
    addbtn.classList.remove("enable")

  }
})

document.addEventListener("click", function(event) {
  const dropdownButtons = document.querySelectorAll("#vert");
  dropdownButtons.forEach(button => {
    const dropdownContent = selectParentElement(button, ".dropdown");
    if (event.target === button) {
      dropdownContent.classList.toggle("show");
    } else if (!dropdownContent.contains(event.target)) {
      dropdownContent.classList.remove("show");
    }
  });
});


function handleCompleted(e) {
  let elem = selectParentElement(e.target, "span")
  elem.classList.toggle('complited')
}

function setEmpty(isEmpty) {
  isEmpty ? empty.style.display = "none" : empty.style.display = "block"
}


function displayTasks() {
  (!Tasks.length > 0) ? setEmpty(false) : setEmpty(true)
  document.querySelectorAll("li").forEach((li) => li.remove());
  Tasks.forEach((task, id) => {

    let li = `
  <li class ="${task.completed ? "completed" : ""}${task.editing ? " editing" : ""}" id ="task">
  <div class="left">
    <div class="custome_checkbox">

    <input id="checkbox${id}" type="checkbox" ${task.completed ? 'checked' : ''} />
      <label onclick="markLable(this,${id})" for="checkbox${id}"></label>
    </div>
  </div>
${task.editing ?
        `<form onsubmit = "saveEdit(event,this,${id})" action="#" class="editForm">
    <input autocomplete="off" value="${task.item}" id="inputedit" type="text" />
    <button type="submit">
      <i class="material-icons">check</i>
    </button>
  </form>`
        :
        `<span id="tasktext" class="${task.completed ? 'completed' : ''}">${task.item}</span>`
      }
 
  <div class="right">
  
  <div class="starbox">

  <input id="starCheck${id}" type="checkbox" ${task.starred ? 'checked' : ''} />
    <label onclick="addStar(${id})" for="starCheck${id}"></label>
  </div>



    <i id="vert" class="material-icons"
      >more_vert</i
    >
  </div>

  <div class="dropdown">
    <div  onclick = "editTask(${id})" >
      <i class="material-icons">edit</i>
      <p>Edit Task</p>
    </div>
    <div onclick="dropMarkStar(${id})">
      <i class="material-icons">${task.starred ? "star" : "star_border"}</i>
      <p>${task.starred ? "Remove importance" : "Mark as important"}</p>
    </div>
    <div onclick = "dropMarkComplete(this,${id})">
      <i class="material-icons">${task.completed ? "schedule" : "check_circle"}</i>
      <p>${task.completed ? "Mark as  Incompleted" : "Mark as completed"}</p>
    </div>
    <div onclick ="shareThis(this)">
      <i class="material-icons">share</i>
      <p>Share Task</p>
    </div>
    <div onclick="deleteTask(${id})">
      <i  class="material-icons">delete</i>
      <p>Delete</p>
    </div>
  </div>
</li>
  
  `
    if (task.starred) {
      ul2.insertAdjacentHTML("beforeend", li);
    } else {
      ul.insertAdjacentHTML("beforeend", li);

    }

    checkUl2HasLi(ul2)
    setTimeout(() => {
      let inputTask = document.querySelectorAll('#inputedit')[0]
      if (inputTask) {
        const currentValue = inputTask.value;
        inputTask.focus();
        inputTask.setSelectionRange(currentValue.length, currentValue.length);
      }
    }, 500)
  })
}


function checkUl2HasLi(ul2) {
  if (ul2.querySelectorAll('li').length) {
    ul2.style.display = "flex"
  } else {
    ul2.style.display = "none"
  }
}


displayTasks()

function addTask() {
  addSound.play()
  let item = inputTask.value
  let completed = false
  let starred = false
  let editing = false
  let newTask = { item, completed, starred, editing }

  Tasks.push(newTask)

  localStorage.setItem("task", JSON.stringify(Tasks));
  displayTasks()
  addbtn.classList.remove("enable")
  inputTask.value = null
}

function markLable(e, id) {
  let l = e.parentElement.parentElement.parentElement
  let span = l.querySelector('span')
  l.classList.toggle('completed')
  span.classList.toggle('completed')
  let isChecked = changeMind(Tasks[id].completed)
  let newComp = isChecked
  Tasks[id].completed = newComp
  localStorage.setItem("task", JSON.stringify(Tasks));
  displayTasks()
  if (isChecked) {
    doneSound.currentTime = 0
    doneSound.play()
  }
}



function deleteTask(id) {
  Tasks.splice(id, 1)
  localStorage.setItem("task", JSON.stringify(Tasks));
  displayTasks()

}



function editTask(id) {
  Tasks[id].editing = true
  localStorage.setItem("task", JSON.stringify(Tasks));
  displayTasks()
}

function saveEdit(e, form, id) {
  e.preventDefault()
  let input = form.querySelector('input').value
  if (!input) return
  Tasks[id].item = input
  Tasks[id].editing = false

  localStorage.setItem("task", JSON.stringify(Tasks));
  displayTasks()


}


function changeMind(turn) {
  return turn === true ? false : true;
}


function dropMarkStar(id) {
  addStar(id)
}
function dropMarkComplete(e, id) {
  markLable(e, id)
}

function addStar(id) {
  let isChecked = changeMind(Tasks[id].starred)
  let newComp = isChecked
  Tasks[id].starred = newComp
  localStorage.setItem("task", JSON.stringify(Tasks));
  displayTasks()

}

document.querySelector('#form').addEventListener('submit', (e) => {
  e.preventDefault()
  addTask()
})


function shareThis(e) {
  let title = selectParentElement(e, "span").innerText
  const shareData = {
    title: title,
    url: window.location.href,
  };


  navigator
    .share(shareData)
    .then(() => {
      selectParentElement(e, ".dropdown").classList.toggle('show')
      console.log("Shared successfully");
    })
    .catch((error) => {
      console.error("Error sharing:", error);
    });
}