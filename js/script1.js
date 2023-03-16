let data_value = 0;

const checkTouchDevice = () => {
  try {
    //We try to create TouchEvent (it would fail for desktops and throw error)
    document.createEvent('TouchEvent');
    return true;
  } catch (e) {
    return false;
  }
};

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

// Get all the columns

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
  // let newX = checkTouchDevice() ? e.touches[0].clientX : e.clientX;
  // let newY = checkTouchDevice() ? e.touches[0].clientY : e.clientY;

  // console.log('x     ', newX);
  // console.log('y    ', newY);
  // let targetElement = document.elementFromPoint(newX, newY);
  // console.log('target  Column  ', targetElement);
}

const drop = (e) => {
  e.preventDefault();
  // let targetEl = e.target;

  let newX = checkTouchDevice() ? e.touches[0].clientX : e.clientX;
  let newY = checkTouchDevice() ? e.touches[0].clientY : e.clientY;

  //Set targetElement(where we drop the picked element).It is based on mouse position
  let targetElement = document.elementFromPoint(newX, newY);

  let currentValue = currentElement.getAttribute('data-value');
  let targetValue = targetElement.getAttribute('data-value');

  // console.log('targetValue   on drop ......', targetValue);

  //get index of current and target based on value
  let [currentPosition, targetPosition] = [
    getPosition(currentValue),
    getPosition(targetValue),
  ];
  initialX = newX;
  initialY = newY;

  // console.log('currentValue:   ', currentValue);
  // console.log('targetValue:   ', targetValue);

  try {
    //'afterend' inserts the element after the target element and 'beforebegin' inserts before the target element
    if (currentPosition < targetPosition) {
      targetElement.insertAdjacentElement('afterend', currentElement);
    } else {
      targetElement.insertAdjacentElement('beforebegin', currentElement);
    }
  } catch (err) {}
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

addButtons.forEach(function (button) {
  button.addEventListener('click', function () {
    // Get the parent column
    let column = button.parentNode;

    // Create a new task div
    let newTask = document.createElement('div');
    newTask.className = 'task';
    newTask.setAttribute('data-value', data_value++);
    let contentText = document.createElement('p');
    contentText.className = 'content-task';
    contentText.contentEditable = true;

    const textNode = document.createTextNode('This is some new content!'); // Create a text node
    contentText.appendChild(textNode); // Add the text node to the new <p> element

    // contentText.addEventListener('focus', function () {
    //   newTask.draggable = false;
    // });

    // // Re-enable draggable when editing is complete
    // contentText.addEventListener('blur', function () {
    //   newTask.draggable = true;
    // });

    newTask.appendChild(contentText);
    newTask.insertAdjacentHTML(
      'beforeend',
      '<ion-icon class="edit-icon" name="create"></ion-icon> <ion-icon class="delete-icon" name="trash"></ion-icon>'
    );

    let editButton = newTask.querySelector('.edit-icon');
    editButton.addEventListener('click', function (event) {
      // let clickedIcon = event.target;
      let editIcon = event.target;
      console.log(editIcon);
      let targetDiv = editIcon.parentNode;
      let targetTask = targetDiv.querySelector('.content-task');
      console.log(targetTask);
      targetTask.contentEditable = true;
    });
    let deleteButton = newTask.querySelector('.delete-icon');
    deleteButton.addEventListener('click', function (event) {
      let deleteIcon = event.target;
      let targetDiv = deleteIcon.parentNode;
      let targetColumn = targetDiv.parentNode;
      targetColumn.removeChild(targetDiv);
    });
    // Append the new task div to the parent column
    makeDraggabale(newTask);

    column.insertBefore(newTask, button);
  });
});

////////////////////////////////////// Editing icon /////////////////////

let editIcons = document.getElementsByClassName('edit-icon');
console.log(editIcons);
Array.from(editIcons).forEach(function (editIcon) {
  editIcon.addEventListener('click', function () {
    // let clickedIcon = event.target;
    console.log(editIcon);
    let targetDiv = editIcon.parentNode;
    let targetTask = targetDiv.querySelector('.content-task');
    targetTask.contentEditable = true;
  });
});

////////////////////////////////////// Deleting icon /////////////////////

let deleteIcons = document.getElementsByClassName('delete-icon');
console.log(deleteIcons);

Array.from(deleteIcons).forEach(function (deleteIcon) {
  deleteIcon.addEventListener('click', function () {
    let targetDiv = deleteIcon.parentNode;
    let targetColumn = targetDiv.parentNode;
    targetColumn.removeChild(targetDiv);
  });
});

/*

function drop(event) {
  event.preventDefault();
  var targetDiv = event.target;

  // Make sure we're not dropping onto the same div or onto a button
  if (draggedDiv !== targetDiv && !targetDiv.matches('button')) {
    // Get the parent columns of the dragged and target divs
    var draggedColumn = draggedDiv.parentNode;
    var targetColumn = targetDiv.parentNode;

    // Move the dragged div to the target column
    targetColumn.appendChild(draggedDiv);

    // If the dragged column is now empty, add a placeholder div
    if (draggedColumn.childElementCount === 0) {
      var placeholderDiv = document.createElement('div');
      placeholderDiv.classList.add('placeholder');
      draggedColumn.appendChild(placeholderDiv);
    }
  }
}

*/
