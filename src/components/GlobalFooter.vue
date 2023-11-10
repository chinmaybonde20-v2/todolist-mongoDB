<template>
  <footer class="footer">
    &copy; {{ currentYear }} Your Company Name. All Rights Reserved.
  </footer>
</template>

<script>
export default {
  data() {
    return {
      currentYear: new Date().getFullYear(),
    };
  },
};
</script>

<style lang="scss" scoped="true">
.footer {
  background-color: #000; /* Black background color */
  color: white; /* Text color */
  padding: 10px 0;
  text-align: center;
}
</style>
