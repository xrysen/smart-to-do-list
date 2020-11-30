$(document).ready(function () {

 /*  const isUserActive = function() {
    $.ajax()
  } */

  const createListElements = function (task) {
    const $task = task['name'];
    const $listElements = {
      items: $(`
      <li>
        <input type="checkbox">
        <label>${$task}</label>
      </li>
    `),

      ratings: $(`
      <li>
        <div class="rating">
          <span>☆</span><span>☆</span><span>☆</span><span>☆</span><span>☆</span>
        </div>
      </li>
    `),

      delete: $(`
      <li><button class='button'>Delete</button></li>
    `),

      move: $(`
      <li><button class='button move'>Move</button></li>
    `),

    };
    return $listElements;
  };

  const loadListItems = function (initial, category, isActive) {
    $.ajax(`/api/tasks/${category}`, { method: "GET" })
      .then((res) => {
        if (initial) {
          renderListElements(res, category, isActive);
        }
        if (!initial) {
          renderSingleListElement(res['tasks'].pop(), category);
        }
      });
  };

  const renderListElements = function (listItems, category, isActive) {
    const tasks = listItems['tasks'];
    for (const task in tasks) {
      if (tasks[task]['is_active'] === isActive) {
        const $items = createListElements(tasks[task]);
        $(`#${category}-items`).append($items.items);
        $(`#${category}-ratings`).append($items.ratings);
        $(`#${category}-delete`).append($items.delete);
        $(`#${category}-move`).append($items.move);
      }
    }
  };

  const renderSingleListElement = function (listItem, category) {
    const $items = createListElements(listItem);
    $(`#${category}-items`).append($items.items);
    $(`#${category}-ratings`).append($items.ratings);
    $(`#${category}-delete`).append($items.delete);
    $(`#${category}-move`).append($items.move);
};

  $('#form').submit((event) => { // form completion handler, sends user inputs to database
    event.preventDefault();
    let error = false;
    const $input = $('#todo-text');
    if (error === false) {
      $.ajax(`/api/tasks`, {method: "POST", data: $input.serialize()}) // ajax post request to database,
        .then(() => { // clears text box
          $input.val('');
        })
        .then(() => {
          $.ajax(`/api/tasks/`, { method: "GET" }) // Refactor to use response from POST
            .then((res) => {
              const task = res['tasks'].pop();
              return task['category_id']
            })
            .then((id) => loadListItems(false, id));
        }) // CHANGE WATCH loads new list item HERE is a good point to add JQUERY to make addition really noticable
        .fail((err) => console.log(err));
    }
  });

/*
  $('#archived').on('click', () => {
    active = false;
    location.reload();
  })

  $('#current').on('click', () => {
    active = true;
    location.reload();
  })

  if(active === true) {
    loadListItems(true, 1, true);
    loadListItems(true, 2, true);
    loadListItems(true, 3, true);
    loadListItems(true, 4, true);
  }

  if (active === false) {
    loadListItems(true, 1, false);
    loadListItems(true, 2, false);
    loadListItems(true, 3, false);
    loadListItems(true, 4, false);
  } */

  loadListItems(true, 1, true);
    loadListItems(true, 2, true);
    loadListItems(true, 3, true);
    loadListItems(true, 4, true);
});



