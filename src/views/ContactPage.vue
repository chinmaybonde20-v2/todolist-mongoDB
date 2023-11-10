<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-8">
        <div class="text-center">
          <h1 class="display-4">Contact Us</h1>
          <p>Feel free to contact us using the form below:</p>
          <!-- Add your contact form or contact information here -->
          <div>
            <input
              v-model="inputValue"
              @blur="validateInput"
              class="form-control"
              placeholder="Enter your message"
            />
            <p v-if="validationError" class="text-danger">
              {{ validationError }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import validationMixin from "@/mixins/validationMixin"; // Adjust the path as needed

export default {
  mixins: [validationMixin],
  data() {
    return {
      inputValue: "",
      validationError: "",
    };
  },
  methods: {
    validateInput() {
      this.validationError = "";
      const fieldName = "Message"; // You can customize the field name
      if (!this.validateNotBlank(this.inputValue, fieldName)) {
        this.validationError = `${fieldName} cannot be blank.`;
      }
    },
    // Other component methods here
  },
  // Other component options here
};
</script>
