$(() => {

  window['lastTask'] = null;

  // Escape function to prevent XSS injection
  const escape = (str) => {
    let div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  };

  // Render HTML for a list item
  const createListItem = function (task, isActive) {
    const $taskName = escape(task.name).toLowerCase();
    const $taskId = escape(task.id);
    const $taskCatId = escape(task.category_id);
    const checkboxElement = isActive ? `<input type="checkbox" onclick="completeTask(${$taskId}, ${$taskCatId})">` : '';

    const listItemHtml = `
      <div class="tr taskdata-${$taskCatId}" id="task-${$taskId}">

        <div class="td td-checkbox group-a" id="item${$taskId}">
          ${checkboxElement}
        </div>

        <div class="td td-task group-a" id="${$taskId}">
          <span>${$taskName}</span>
        </div>

        <div class="td td-urgency group-c" id="rating${$taskId}">
          <div class="rating-stars">
            <input type="radio" id="${$taskId}-star-5" name="${$taskId}rate" value="5" onclick = "setTaskRating(${$taskId},5)" />
              <label for="${$taskId}-star-5" title="text">5 stars</label>
              <input type="radio" id="${$taskId}-star-4" name="${$taskId}rate" value="4" onclick = "setTaskRating(${$taskId},4)" />
              <label for="${$taskId}-star-4" title="text">4 stars</label>
              <input type="radio" id="${$taskId}-star-3" name="${$taskId}rate" value="3" onclick = "setTaskRating(${$taskId},3)" />
              <label for="${$taskId}-star-3" title="text">3 stars</label>
              <input type="radio" id="${$taskId}-star-2" name="${$taskId}rate" value="2" onclick = "setTaskRating(${$taskId},2)" />
              <label for="${$taskId}-star-2" title="text">2 stars</label>
              <input type="radio" id="${$taskId}-star-1" name="${$taskId}rate" value="1" onclick = "setTaskRating(${$taskId},1)" />
              <label for="${$taskId}-star-1" title="text">1 star</label>
          </div>
        </div>

        <div class="td td-move group-b" id="move${$taskId}">
          <form class="move-button" name="move" onsubmit="return false">
            <input type='submit' class='button move' value="move" onclick="moveTaskMenu(${$taskId})"></input>
          </form>
          <span id="move-menu${$taskId}" style="display:none;">
            <button onclick="moveTask(${$taskId}, ${$taskCatId}, 1)">watch</button>
            <button onclick="moveTask(${$taskId}, ${$taskCatId}, 2)">read</button>
            <button onclick="moveTask(${$taskId}, ${$taskCatId}, 3)">eat</button>
            <button onclick="moveTask(${$taskId}, ${$taskCatId}, 4)">buy</button>
          </span>
        </div>

        <div class="td td-delete group-b" id=delete"${$taskId}">
          <form name="delete" onsubmit="return false">
            <input type='submit' class='button delete-btn' value="delete" onclick="openDeletePrompt(${$taskId}, ${$taskCatId})">
            </input>
          </form>
        </div>

      </div>
    `
    $(`#${$taskCatId}-table`).append(listItemHtml)

    // Sets the created task to a draggable object

    $(`#task-${$taskId}`).draggable(
      {
        axis: "y",
        cursor: "move",
        revert: "invalid"
      });

    /**
     * Sets all tables to accept draggable objects.
     * Changes table style on hover to show user that the table will accept the drop
     * Calls moveTask when the draggable object is dropped on a droppable table which updates the category and re-renders the category list
     */

    $(`.table`).droppable(
      {
        over: function(event, ui) {
          $(this).addClass('drag-hover');
        },
        out: function() {
          $(this).removeClass('drag-hover');
        },
        drop: function(ev, ui) {
          const dropped = ui.draggable.attr("id");
          const oldCat = ui.draggable.attr("class");
          const taskId = dropped.substring(dropped.indexOf('-') + 1);

          $(this).removeClass('drag-hover');

          switch($(this).attr("id")) {
            case "4-table":
              moveTask(taskId, oldCat[12], 4);
              break;
            case "3-table":
              moveTask(taskId, oldCat[12], 3);
              break;
            case "2-table":
              moveTask(taskId, oldCat[12], 2);
              break;
            case "1-table":
              moveTask(taskId, oldCat[12], 1);
              break;
          }
        }
      }
    );

    if (!isActive) {
      $(".td-urgency").hide()
      return $(".td-move").hide()
    }
  }

  window.createListItem = createListItem;
})



