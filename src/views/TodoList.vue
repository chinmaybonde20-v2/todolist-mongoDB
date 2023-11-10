<template>
  <div>
    <div class="container mt-4">
      <div class="d-flex justify-content-between align-items-center">
        <h2 class="display-6">Task List:</h2>
        <div class="d-flex justify-content-between align-items-center">
          <!-- Search box -->
          <div class="input-group">
            <span class="input-group-text"><i class="fas fa-search"></i></span>
            <input
              type="text"
              v-model="searchQuery"
              class="form-control"
              placeholder="Search Task"
            />
          </div>
          <!-- Sorting Dropdown -->
          <div class="input-group sort">
            <label for="sortDropdown" class="input-group-text">Sort By:</label>
            <select
              id="sortDropdown"
              v-model="sortCriteria"
              class="form-select"
            >
              <option value="name">Name</option>
              <option value="dateAdded">Date Added</option>
              <option value="status">Status</option>
            </select>
          </div>
        </div>
        <!-- Add Task -->
        <button class="add-btn btn btn-primary" @click="showAddForm">
          Add Task
        </button>
      </div>
      <hr />
      <div class="content-wrapper">
        <div class="content">
          <!-- Form -->
          <div v-if="showForm" class="overlay">
            <div class="form-container">
              <form class="form" @submit.prevent="submitForm">
                <button @click="closeForm" class="close-button">
                  <i class="fa fa-times" aria-hidden="true"></i>
                </button>
                <!--  -->
                <div class="mb-3">
                  <label for="taskName" class="form-label">Task Name:</label>
                  <input
                    type="text"
                    id="taskName"
                    v-model="taskName"
                    class="form-control"
                    @input="updateTaskNameError"
                  />
                  <div class="text-danger">{{ taskNameError }}</div>
                </div>

                <div class="mb-3">
                  <label for="taskDescription" class="form-label"
                    >Task Description:</label
                  >
                  <textarea
                    id="taskDescription"
                    v-model="taskDescription"
                    class="form-control"
                    @input="updateTaskDescriptionError"
                  ></textarea>
                  <div class="text-danger">{{ taskDescriptionError }}</div>
                </div>
                <!--  -->

                <button type="submit" class="btn btn-primary">
                  {{ editingTodo ? "Update Task" : "Add Task" }}
                </button>
              </form>
            </div>
          </div>

          <!-- Show Tasklist -->
          <div class="row mt-4">
            <div
              class="col-md-4"
              v-for="todo in paginatedTodos"
              :key="todo._id"
            >
              <div class="card mb-3">
                <div class="card-body">
                  <div
                    class="d-flex justify-content-between align-items-center"
                  >
                    <div class="d-flex align-items-center">
                      <h5 class="card-title mb-0 ml-2">{{ todo.text }}</h5>
                    </div>
                    <div class="d-flex align-items-center">
                      <button class="btn" @click="editTodo(todo)">
                        <i class="fas fa-edit text-primary"></i>
                      </button>
                      <button class="btn" @click="deleteTodo(todo._id)">
                        <i class="fas fa-trash-alt text-danger"></i>
                      </button>
                      <div class="checkbox-div">
                        <label class="form-check">
                          <input
                            type="checkbox"
                            class="form-check-input"
                            v-model="todo.done"
                          />
                          <span class="form-check-label"></span>
                        </label>
                      </div>
                    </div>
                  </div>
                  <p class="card-text">Description: {{ todo.description }}</p>
                  <p class="card-text">
                    Status: {{ todo.done ? "Done" : "Not Done" }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Pagination -->
          <div
            class="pagination pagination-div d-flex justify-content-between align-items-center p-2"
          >
            <div>
              <button
                @click="goToFirstPage"
                :disabled="currentPage === 1"
                class="btn btn-link"
              >
                <i class="fas fa-angle-double-left"></i> First
              </button>
              <button
                @click="prevPage"
                :disabled="currentPage === 1"
                class="btn btn-link"
              >
                <i class="fas fa-angle-left"></i> Prev
              </button>
            </div>
            <span class="page-of m-0" style="margin: 0 10px">
              {{ `Page ${currentPage} of ${totalPages}` }}
            </span>
            <div>
              <button
                @click="nextPage"
                :disabled="currentPage === totalPages"
                class="btn btn-link"
              >
                Next <i class="fas fa-angle-right"></i>
              </button>
              <button
                @click="goToLastPage"
                :disabled="currentPage === totalPages"
                class="btn btn-link"
              >
                Last <i class="fas fa-angle-double-right"></i>
              </button>
            </div>
            <!-- Jump to Page -->
            <div class="jump-to-page d-flex align-items-center">
              <button @click="jumpToPage" class="btn jump-btn">
                Go To Page:
              </button>
              <input
                v-model="jumpPage"
                type="number"
                min="1"
                :max="totalPages"
                class="form-control jump-input"
              />
            </div>
            <!-- Items per Page -->
            <div class="items-per-page">
              <span>Show items per page:</span>
              <div class="btn-group" role="group">
                <button
                  v-for="item in pageItems"
                  :key="item"
                  @click="setTasksPerPage(item)"
                  :class="[
                    'btn',
                    'btn-link',
                    { active: tasksPerPage === item },
                  ]"
                >
                  {{ item }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, computed, watch } from "vue";
import { useStore } from "vuex";

const store = useStore();
const todos = ref([]);
const newTodo = ref({ text: "", description: "", done: false });
const editedTodo = ref(null);
const editingTodo = ref(false);
const showForm = ref(false);
// Pagination
const searchQuery = ref("");
const currentPage = ref(1);
const tasksPerPage = ref(4);
const jumpPage = ref(currentPage.value);
const pageItems = [3, 6, 10, 14];
const sortCriteria = ref("name");
const taskNameError = ref("");
const taskDescriptionError = ref("");

// Validation

const updateTaskNameError = () => {
  taskNameError.value =
    taskName.value.trim() === "" ? "Task Name is required." : "";
};

const updateTaskDescriptionError = () => {
  taskDescriptionError.value =
    taskDescription.value.trim() === "" ? "Task Description is required." : "";
};

const submitForm = () => {
  updateTaskNameError();
  updateTaskDescriptionError();
  if (taskNameError.value === "" && taskDescriptionError.value === "") {
    if (editingTodo.value) {
      updateTodo();
    } else {
      addTodo();
    }
  }
};

// v-model for task description
const taskName = computed({
  get: () => (editingTodo.value ? editedTodo.value.text : newTodo.value.text),
  set: (value) => {
    if (editingTodo.value) {
      editedTodo.value.text = value;
    } else {
      newTodo.value.text = value;
    }
  },
});

const taskDescription = computed({
  get: () =>
    editingTodo.value
      ? editedTodo.value.description
      : newTodo.value.description,
  set: (value) => {
    if (editingTodo.value) {
      editedTodo.value.description = value;
    } else {
      newTodo.value.description = value;
    }
  },
});

// Header
const token = computed(() => store.state.token);

const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${token.value}`,
};

const showAddForm = () => {
  showForm.value = true;
};

const closeForm = () => {
  showForm.value = false;
  editedTodo.value = { text: "", description: "", done: false };
};

// CRUD

const addTodo = async () => {
  try {
    const response = await fetch("http://localhost:3000/todos", {
      method: "POST",
      headers: headers,
      body: JSON.stringify(newTodo.value),
    });
    if (response.ok) {
      const data = await response.json();
      todos.value.push(data);
      newTodo.value = { text: "", description: "", done: false };
      showForm.value = false;
    } else {
      console.error("Error creating a new todo:", response.statusText);
    }
  } catch (error) {
    console.error("Error creating a new todo:", error);
  }
};

const editTodo = (todo) => {
  editingTodo.value = true;
  showForm.value = true;
  editedTodo.value = { ...todo };
};

const updateTodo = async () => {
  if (editedTodo.value) {
    try {
      const response = await fetch(
        `http://localhost:3000/todos/${editedTodo.value._id}`,
        {
          method: "PUT",
          headers: headers,
          body: JSON.stringify(editedTodo.value),
        }
      );
      if (response.ok) {
        const updatedData = await response.json();
        const index = todos.value.findIndex((t) => t._id === updatedData._id);
        if (index !== -1) {
          todos.value[index] = updatedData;
        }
        showForm.value = false;
        editingTodo.value = false;
        editedTodo.value = null;
      } else {
        console.error("Error updating the todo:", response.statusText);
      }
    } catch (error) {
      console.error("Error updating the todo:", error);
    }
  }
};

const deleteTodo = async (todoId) => {
  try {
    const response = await fetch(`http://localhost:3000/todos/${todoId}`, {
      method: "DELETE",
      headers: headers,
    });
    if (response.ok) {
      const index = todos.value.findIndex((todo) => todo._id === todoId);
      if (index !== -1) {
        todos.value.splice(index, 1);
      }
    } else {
      console.error("Error deleting todo:", response.statusText);
    }
  } catch (error) {
    console.error("Error deleting todo:", error);
  }
};

// Search
const filteredTodos = computed(() => {
  if (searchQuery.value.trim() === "") {
    return todos.value;
  }
  const query = searchQuery.value.toLowerCase();
  return todos.value.filter((todo) => todo.text.toLowerCase().includes(query));
});

// Pagination
const paginatedTodos = computed(() => {
  const sortedTodos = sortTodos();
  const startIndex = (currentPage.value - 1) * tasksPerPage.value;
  const endIndex = startIndex + tasksPerPage.value;
  return sortedTodos.slice(startIndex, endIndex);
});

const totalPages = computed(() =>
  Math.ceil(filteredTodos.value.length / tasksPerPage.value)
);

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

const goToFirstPage = () => {
  currentPage.value = 1;
};

const goToLastPage = () => {
  currentPage.value = totalPages.value;
};

const jumpToPage = () => {
  if (jumpPage.value >= 1 && jumpPage.value <= totalPages.value) {
    currentPage.value = jumpPage.value;
  }
};

const setTasksPerPage = (perPage) => {
  tasksPerPage.value = perPage;
  currentPage.value = 1;
};
//update paginated todo

// Sort
const sortTodos = () => {
  const sortedTodos = [...filteredTodos.value];
  switch (sortCriteria.value) {
    case "name":
      sortedTodos.sort((a, b) => a.text.localeCompare(b.text));
      break;
    case "dateAdded":
      sortedTodos.sort((a, b) => new Date(a.dateAdded) - new Date(b.dateAdded));
      break;
    case "status":
      sortedTodos.sort((a, b) => (a.done === b.done ? 0 : a.done ? 1 : -1));
      break;
    default:
      break;
  }
  return sortedTodos;
};

watch(sortCriteria, () => {
  currentPage.value = 1;
});

onMounted(async () => {
  try {
    const response = await fetch("http://localhost:3000/todos", {
      headers: headers,
    });
    const data = await response.json();
    todos.value = data;
  } catch (error) {
    console.error("Error fetching todos:", error);
  }
});
</script>

<style scoped>
@import "@/assets/styles/style.scss";
</style>
