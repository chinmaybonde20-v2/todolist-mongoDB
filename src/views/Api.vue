<template>
  <div>
    <h1>API Use</h1>
    <p>API USE</p>
    <!-- Add your contact form or contact information here -->
  </div>
</template>

<script>
// Import the API endpoints
import { apiUrl } from "@/helpers/api";
import axios from "axios";

// Make a GET request
axios
  .get(apiUrl.getUsers)
  .then((response) => {
    // Handle the API response here
    console.log(response.data);
  })
  .catch((error) => {
    // Handle errors
    console.error(error);
  });
</script>
