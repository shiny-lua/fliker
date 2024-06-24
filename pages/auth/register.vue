<template>
  <register />
</template>

<script>
import Register from "~/components/auth/Register.vue";
export default {
  middleware: "guest",
  components: {
    Register,
  },

  head() {
    return { title: "Register" };
  },
};
</script>
