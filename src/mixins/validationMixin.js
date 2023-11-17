// validationMixin.js
export default {
  methods: {
    validateNotBlank(value, fieldName) {
      if (!value || value.trim() === "") {
        this.$emit("validation-error", `${fieldName} cannot be blank.`);
        return false;
      }
      return true;
    },
    // Other mixin methods here
  },
  computed: {
    // Other computed properties here
  },
};
