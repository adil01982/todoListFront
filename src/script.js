// Call fetchData function when the page loads
fetchData();

async function fetchData() {
  const apiKey = "adil123++";

  try {
    const response = await fetch("https://todolistfunc.azurewebsites.net/api/myfunc", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-functions-key": apiKey,
      },
    });

    const data = await response.text();

    document.getElementById("responseContainer").innerHTML = data;

    // Create close buttons after adding the list items
    createCloseButtons();
    // Add click event listener to handle "checked" state
    addClickEventListener();
  } catch (error) {
    console.error("Error fetching data:", error);
    document.getElementById("responseContainer").innerHTML =
      "<p>Error fetching data</p>";
  }
}

async function addTask() {
  const taskName = document.getElementById("myInput").value;
  const apiKey = "adil123++";

  if (taskName.trim() !== "") {
    try {
      await fetch("https://todolistfunc.azurewebsites.net/api/myfunc", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-functions-key": apiKey,
        },
        body: JSON.stringify({ operation: "add", task_name: taskName }),
      });

      // Refresh the task list after adding a new task
      fetchData();
    } catch (error) {
      console.error("Error adding task:", error);
    }
    document.getElementById("myInput").value = "";
  }
}

function createCloseButtons() {
  // Create a "close" button and append it to each list item
  var myNodelist = document.getElementsByTagName("li");
  var i;
  for (i = 0; i < myNodelist.length; i++) {
    var span = document.createElement("SPAN");
    var txt = document.createTextNode("\u00D7");
    span.className = "close";
    span.appendChild(txt);
    myNodelist[i].appendChild(span);

    // Retrieve the row key from the data attribute
    var rowKey = myNodelist[i].getAttribute("data-row-key");

    // Add event listener for close buttons
    span.addEventListener(
      "click",
      (function (key, taskNameElement) {
        return function () {
          // Now, 'key' will be the correct value
          displayDeleteConfirmationModal(taskNameElement.textContent, key);
        };
      })(rowKey, myNodelist[i])
    );
  }
}


function displayDeleteConfirmationModal(taskName, rowKey) {
  // Remove the last letter from the task name
  var truncatedTaskName = taskName.slice(0, -1);

  document.getElementById("taskNameToDelete").textContent = truncatedTaskName;
  $("#confirmDeleteModal").modal("show");

  document.getElementById("confirmDeleteButton").addEventListener("click", function () {
    $("#confirmDeleteModal").modal("hide");
    deleteTask(rowKey);
  });
}


async function deleteTask(rowKey) {
  const apiKey = "adil123++";

  try {
    await fetch("https://todolistfunc.azurewebsites.net/api/myfunc", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-functions-key": apiKey,
      },
      body: JSON.stringify({ operation: "delete", row_key: rowKey }),
    });

    fetchData();
  } catch (error) {
    console.error("Error deleting task:", error);
  }
}


function addClickEventListener() {
  // Add a "checked" symbol when clicking on a list item
  var list = document.querySelector("ul");
  list.addEventListener(
    "click",
    function (ev) {
      if (ev.target.tagName === "LI") {
        // Get the row key from the data attribute
        var rowKey = ev.target.getAttribute("data-row-key");

        // Update the task to toggle the "done" state
        updateTask(rowKey);
      }
    },
    false
  );
}

async function updateTask(rowKey) {
  const apiKey = "adil123++";

  try {
    await fetch("https://todolistfunc.azurewebsites.net/api/myfunc", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-functions-key": apiKey,
      },
      body: JSON.stringify({ operation: "update", row_key: rowKey }),
    });

    // Refresh the task list after updating a task
    fetchData();
  } catch (error) {
    console.error("Error updating task:", error);
  }
}
