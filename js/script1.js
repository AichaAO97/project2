let data_value = 0;

/// check wether we use a mobile or a laptop
const checkTouchDevice = () => {
  try {
    //We try to create TouchEvent (it would fail for desktops and throw error)
    document.createEvent('TouchEvent');
    return true;
  } catch (e) {
    return false;
  }
};

let currentElement;

//Drag and drop functions
function dragStart(e) {
  initialX = checkTouchDevice() ? e.touches[0].clientX : e.clientX;
  initialY = checkTouchDevice() ? e.touches[0].clientY : e.clientY;
  //Set current Element
  currentElement = e.target;
}
function dragOver(e) {
  e.preventDefault();
}

//Returns element index with given value
const getPosition = (value) => {
  let elementIndex;
  let taskItems = document.getElementsByClassName('task');
  Array.from(taskItems).forEach((element, index) => {
    let elementValue = element.getAttribute('data-value');
    if (value == elementValue) {
      elementIndex = index;
    }
  });
  return elementIndex;
};

const drop = (e) => {
  e.preventDefault();
  // let targetEl = e.target;

  let newX = checkTouchDevice() ? e.touches[0].clientX : e.clientX;
  let newY = checkTouchDevice() ? e.touches[0].clientY : e.clientY;

  //Set targetElement(where we drop the picked element).It is based on mouse position
  let targetElement = document.elementFromPoint(newX, newY);

  let currentValue = currentElement.getAttribute('data-value');
  let targetValue = targetElement.getAttribute('data-value');

  let parentColumn = targetElement.parentNode;

  //get index of current and target based on value
  let [currentPosition, targetPosition] = [
    getPosition(currentValue),
    getPosition(targetValue),
  ];
  initialX = newX;
  initialY = newY;

  try {
    //'afterend' inserts the element after the target element and 'beforebegin' inserts before the target element
    if (currentPosition < targetPosition) {
      targetElement.insertAdjacentElement('afterend', currentElement);
      // parentColumn.insertBefore(targetElement, currentElement);
    } else {
      targetElement.insertAdjacentElement('beforebegin', currentElement);
      // parentColumn.insertBefore(currentElement, targetElement);
    }
  } catch (err) {}

  addToLocalStorage();
};

// Add drag event listeners to all the divs inside the columns

let taskItems = document.getElementsByClassName('task');
Array.from(taskItems).forEach((taskItem) => {
  taskItem.setAttribute('draggable', 'true');
  taskItem.addEventListener('dragstart', dragStart);
  taskItem.addEventListener('dragover', dragOver);
  taskItem.addEventListener('drop', drop);
  taskItem.setAttribute('data-value', data_value++);
});

//////////////////////////////////////////// Add Buttons //////////////////////////////

let addButtons = document.querySelectorAll('.add-button');

function makeDraggabale(task) {
  task.setAttribute('draggable', 'true');
  task.addEventListener('dragstart', dragStart);
  task.addEventListener('dragover', dragOver);
  task.addEventListener('drop', drop);
}

//load Tasks
function loadTasks() {
  // Retrieve the div content from local storage
  const gotObjectsJSON = localStorage.getItem('objectsJSON');
  // Convert the JSON string back to an object
  const gotObjects = JSON.parse(gotObjectsJSON);

  // Get the content from the object and add it to the page
  for (let i = 1; i <= 3; i++) {
    let columnParent = document.getElementById(i);
    let button = columnParent.querySelector('button');

    gotObjects[i.toString()].forEach((obj) => {
      let arrayOfClasses = Object.values(obj.taskClassList);
      if (!arrayOfClasses.includes('empty')) {
        // let emptyDiv = document.createElement('div');
        // emptyDiv.className = 'task empty';
        // columnParent.insertBefore(emptyDiv, button);
        textContent = obj.paragraph;
        createTask(columnParent, textContent, button);
      }
    });
  }
}

let objects = {};
let objectsJSON;

function addToLocalStorage() {
  objects[1] = [];
  objects[2] = [];
  objects[3] = [];
  let taskItems = document.getElementsByClassName('task');
  Array.from(taskItems).forEach((taskItem) => {
    // let paragraph = taskItem.querySelector('p');
    let taskClassList = taskItem.classList;
    let paragraph = taskItem.innerText;
    let ParentColumn = taskItem.parentNode;
    let ParentColumnId = taskItem.parentNode.id;

    // Create an object to store the div content
    let obj = { taskClassList: taskClassList, paragraph: paragraph };

    objects[ParentColumnId].push(obj);
  });

  // const divContent = divElement.innerHTML;

  // Convert the object to a JSON string
  objectsJSON = JSON.stringify(objects);

  // Store the JSON string in local storage
  localStorage.setItem('objectsJSON', objectsJSON);
}

function createTask(column, text, button) {
  let newTask = document.createElement('div');
  newTask.className = 'task';
  newTask.setAttribute('data-value', data_value++);
  let contentText = document.createElement('p');
  contentText.className = 'content-task';
  const textNode = document.createTextNode(text);
  contentText.appendChild(textNode); // Add the text node to the new <p> element
  newTask.appendChild(contentText);

  contentText.addEventListener('blur', () => {
    contentText.contentEditable = false;
    console.log('Nooo focus');
  });

  newTask.insertAdjacentHTML(
    'beforeend',
    '<ion-icon class="edit-icon" name="create"></ion-icon> <ion-icon class="delete-icon" name="trash"></ion-icon>'
  );

  let editButton = newTask.querySelector('.edit-icon');
  editButton.addEventListener('click', function () {
    editFunction(editButton);
  });
  let deleteButton = newTask.querySelector('.delete-icon');
  deleteButton.addEventListener('click', function () {
    deleteFunction(deleteButton);
  });
  // Append the new task div to the parent column
  makeDraggabale(newTask);

  column.insertBefore(newTask, button);
}

addButtons.forEach(function (button) {
  button.addEventListener('click', function () {
    // Get the parent column
    let column = button.parentNode;

    // const textNode = document.createTextNode(); // Create a text node
    createTask(column, 'click to edit!', button);

    addToLocalStorage();
  });
});

////////////////////////////////////// Editing icon /////////////////////

function editFunction(editButton) {
  let targetDiv = editButton.parentNode;
  let targetTask = targetDiv.querySelector('.content-task');
  targetTask.contentEditable = true;
  targetTask.focus();
}

let editIcons = document.getElementsByClassName('edit-icon');
Array.from(editIcons).forEach(function (editIcon) {
  editIcon.addEventListener('click', function () {
    editFunction(editButton);
  });
});

////////////////////////////////////// Deleting icon /////////////////////

function deleteFunction(deleteButton) {
  let targetDiv = deleteButton.parentNode;
  let targetColumn = targetDiv.parentNode;
  targetColumn.removeChild(targetDiv);
  addToLocalStorage();
}

let deleteIcons = document.getElementsByClassName('delete-icon');

Array.from(deleteIcons).forEach(function (deleteIcon) {
  deleteIcon.addEventListener('click', function () {
    deleteFunction(deleteIcon);
  });
});

///////////////////////////////////////////////////////////////////

window.addEventListener('beforeunload', function () {
  addToLocalStorage();
});

window.onload = async () => {
  loadTasks();
};
