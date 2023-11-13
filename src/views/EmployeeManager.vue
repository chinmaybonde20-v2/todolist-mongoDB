<template>
  <div>
    <div class="container mt-4">
      <div class="d-flex justify-content-between align-items-center">
        <h4>Employee Management</h4>
        <!-- Add Employee -->
        <button class="add-btn btn btn-primary" @click="showAddForm">
          Add
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
                  <label for="employeeName" class="form-label"
                    >Employee Name:</label
                  >
                  <input
                    type="text"
                    id="employeeName"
                    v-model="employeeName"
                    class="form-control"
                    @input="updateEmployeeNameError"
                  />
                  <div class="text-danger">{{ employeeNameError }}</div>
                </div>

                <div class="mb-3">
                  <label for="employeeEmail" class="form-label"
                    >Employee Email:</label
                  >
                  <input
                    type="email"
                    id="employeeEmail"
                    v-model="employeeEmail"
                    class="form-control"
                    @input="updateEmployeeEmailError"
                  />
                  <div class="text-danger">{{ employeeEmailError }}</div>
                </div>

                <div class="mb-3">
                  <label for="employeeDOB" class="form-label"
                    >Date of Birth:</label
                  >
                  <input
                    type="date"
                    id="employeeDOB"
                    v-model="employeeDOB"
                    class="form-control"
                    @input="updateEmployeeDOBError"
                  />
                  <div class="text-danger">{{ employeeDOBError }}</div>
                </div>

                <div class="mb-3">
                  <label for="employeeDesignation" class="form-label"
                    >Designation:</label
                  >
                  <input
                    type="text"
                    id="employeeDesignation"
                    v-model="employeeDesignation"
                    class="form-control"
                    @input="updateEmployeeDesignationError"
                  />
                  <div class="text-danger">{{ employeeDesignationError }}</div>
                </div>

                <div class="mb-3">
                  <label for="employeeEducation" class="form-label"
                    >Education:</label
                  >
                  <input
                    type="text"
                    id="employeeEducation"
                    v-model="employeeEducation"
                    class="form-control"
                    @input="updateEmployeeEducationError"
                  />
                  <div class="text-danger">{{ employeeEducationError }}</div>
                </div>

                <button type="submit" class="btn btn-primary">
                  {{ editingEmployee ? "Update Employee" : "Add Employee" }}
                </button>
              </form>
            </div>
          </div>
          <!-- Vue Table -->
          <div>
            <vue-good-table
              :columns="tableColumns"
              :rows="employees"
              :search-options="{
                enabled: true,
                placeholder: 'Search Employee',
              }"
              :pagination-options="{ enabled: true }"
            >
              <template #table-row="props">
                <span v-if="props.column.field == 'action'"
                  ><button class="btn" @click="editEmployee(props.row)">
                    <i class="fas fa-edit text-primary"></i>
                  </button>
                  <button class="btn" @click="deleteEmployee(props.row._id)">
                    <i class="fas fa-trash-alt text-danger"></i>
                  </button>
                </span>
              </template>
            </vue-good-table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useStore } from "vuex";
import "vue-good-table-next/dist/vue-good-table-next.css";
import { VueGoodTable } from "vue-good-table-next";

const store = useStore();
const employees = ref([]);
const newEmployee = ref({
  name: "",
  email: "",
  dob: "",
  designation: "",
  education: "",
});
const editedEmployee = ref(null);
const editingEmployee = ref(false);
const showForm = ref(false);
const employeeNameError = ref("");
const employeeEmailError = ref("");
const employeeDOBError = ref("");
const employeeDesignationError = ref("");
const employeeEducationError = ref("");

// Validation

const updateEmployeeNameError = () => {
  employeeNameError.value =
    employeeName.value.trim() === "" ? "Employee Name is required." : "";
};

const updateEmployeeEmailError = () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  employeeEmailError.value = !employeeEmail.value.match(emailRegex)
    ? "Invalid email address."
    : "";
};

const updateEmployeeDOBError = () => {
  employeeDOBError.value =
    employeeDOB.value.trim() === "" ? "Date of Birth is required." : "";
};

const updateEmployeeDesignationError = () => {
  employeeDesignationError.value =
    employeeDesignation.value.trim() === "" ? "Designation is required." : "";
};

const updateEmployeeEducationError = () => {
  employeeEducationError.value =
    employeeEducation.value.trim() === "" ? "Education is required." : "";
};

const submitForm = () => {
  updateEmployeeNameError();
  updateEmployeeEmailError();
  updateEmployeeDOBError();
  updateEmployeeDesignationError();
  updateEmployeeEducationError();

  if (
    employeeNameError.value === "" &&
    employeeEmailError.value === "" &&
    employeeDOBError.value === "" &&
    employeeDesignationError.value === "" &&
    employeeEducationError.value === ""
  ) {
    if (editingEmployee.value) {
      updateEmployee();
    } else {
      addEmployee();
    }
  }
};

// Vue table
// Vue table
const tableColumns = [
  { label: "Sr.", field: "serialNumber", width: "30px" },
  { label: "Name", field: "name", width: "20%" },
  { label: "Email", field: "email", width: "15%" },
  { label: "DOB", field: "dob", width: "10%" },
  { label: "Designation", field: "designation", width: "20%" },
  { label: "Education", field: "education", width: "15%" },
  { label: "Actions", field: "action", width: "10%" },
];

// v-model for employee fields
const employeeName = computed({
  get: () =>
    editingEmployee.value ? editedEmployee.value.name : newEmployee.value.name,
  set: (value) => {
    if (editingEmployee.value) {
      editedEmployee.value.name = value;
    } else {
      newEmployee.value.name = value;
    }
  },
});

const employeeEmail = computed({
  get: () =>
    editingEmployee.value
      ? editedEmployee.value.email
      : newEmployee.value.email,
  set: (value) => {
    if (editingEmployee.value) {
      editedEmployee.value.email = value;
    } else {
      newEmployee.value.email = value;
    }
  },
});

const employeeDOB = computed({
  get: () =>
    editingEmployee.value ? editedEmployee.value.dob : newEmployee.value.dob,
  set: (value) => {
    if (editingEmployee.value) {
      editedEmployee.value.dob = value;
    } else {
      newEmployee.value.dob = value;
    }
  },
});

const employeeDesignation = computed({
  get: () =>
    editingEmployee.value
      ? editedEmployee.value.designation
      : newEmployee.value.designation,
  set: (value) => {
    if (editingEmployee.value) {
      editedEmployee.value.designation = value;
    } else {
      newEmployee.value.designation = value;
    }
  },
});

const employeeEducation = computed({
  get: () =>
    editingEmployee.value
      ? editedEmployee.value.education
      : newEmployee.value.education,
  set: (value) => {
    if (editingEmployee.value) {
      editedEmployee.value.education = value;
    } else {
      newEmployee.value.education = value;
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
  editedEmployee.value = {
    name: "",
    email: "",
    dob: "",
    designation: "",
    education: "",
  };
};

// CRUD

const addEmployee = async () => {
  try {
    const response = await fetch("http://localhost:3000/employees", {
      method: "POST",
      headers: headers,
      body: JSON.stringify(newEmployee.value),
    });
    if (response.ok) {
      const data = await response.json();
      employees.value.push(data);
      newEmployee.value = {
        name: "",
        email: "",
        dob: "",
        designation: "",
        education: "",
      };
      showForm.value = false;
    } else {
      console.error("Error creating a new employee:", response.statusText);
    }
  } catch (error) {
    console.error("Error creating a new employee:", error);
  }
};

const editEmployee = (employee) => {
  editingEmployee.value = true;
  showForm.value = true;
  editedEmployee.value = { ...employee };
};

const updateEmployee = async () => {
  if (editedEmployee.value) {
    try {
      const response = await fetch(
        `http://localhost:3000/employees/${editedEmployee.value._id}`,
        {
          method: "PUT",
          headers: headers,
          body: JSON.stringify(editedEmployee.value),
        }
      );
      if (response.ok) {
        const updatedData = await response.json();
        const index = employees.value.findIndex(
          (e) => e._id === updatedData._id
        );
        if (index !== -1) {
          employees.value[index] = updatedData;
        }
        showForm.value = false;
        editingEmployee.value = false;
        editedEmployee.value = null;
      } else {
        console.error("Error updating the employee:", response.statusText);
      }
    } catch (error) {
      console.error("Error updating the employee:", error);
    }
  }
};

const deleteEmployee = async (employeeId) => {
  try {
    const response = await fetch(
      `http://localhost:3000/employees/${employeeId}`,
      {
        method: "DELETE",
        headers: headers,
      }
    );
    if (response.ok) {
      const index = employees.value.findIndex(
        (employee) => employee._id === employeeId
      );
      if (index !== -1) {
        employees.value.splice(index, 1);
      }
    } else {
      console.error("Error deleting employee:", response.statusText);
    }
  } catch (error) {
    console.error("Error deleting employee:", error);
  }
};

onMounted(async () => {
  try {
    const response = await fetch("http://localhost:3000/employees", {
      headers: headers,
    });
    const data = await response.json();
    employees.value = data.map((employee, index) => ({
      ...employee,
      serialNumber: index + 1,
    }));
  } catch (error) {
    console.error("Error fetching employees:", error);
  }
});
</script>

<style scoped>
@import "@/assets/styles/style.scss";
</style>
