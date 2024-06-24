<template>
  <div class="row">
    <div class="col-md-8 col-lg-6 m-auto">
      <div class="verify-form card card-body mt-3 mt-md-5 position-relative">
        <router-link
          :to="{ name: 'index' }"
          style="position: absolute; top: 8px; right: 10px"
          ><fa :icon="['far', 'times-circle']"
        /></router-link>
        <form action="" @submit.prevent="resend">
          <p class="form-title">Enter Registered Email</p>
          <div class="form-group">
            <input
              type="email"
              class="form-control text-center"
              :class="{ 'is-invalid': form.errors.has('email') }"
              v-model="form.email"
              required
              placeholder="Enter registered email address"
            />
          </div>
          <div class="text-center my-2">
            <button
              type="submit"
              class="btn fp-btn-gradient"
              :class="{ 'btn-loading': form.busy }"
              :disabled="form.busy"
            >
              Send verification link
            </button>
          </div>
          <p v-if="form.successful" class="text-success">
            <fa icon="check-square" />
            A verification link has been sent to your email account. Please
            check.
          </p>
          <p
            v-if="form.errors.has('email')"
            class="text-danger font-weight-500"
          >
            <fa icon="check-square" />
            The email entered did not match our records. Please check your
            registered email.
          </p>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import Form from "vform";

export default {
  middleware: "guest",

  metaInfo() {
    return { title: "Verify Email" };
  },

  data: () => ({
    status: "",
    form: new Form({
      email: "",
    }),
  }),

  created() {
    if (this.$route.query.email) {
      this.form.email = this.$route.query.email;
    }
  },

  methods: {
    resend() {
      this.form
        .post(`${process.env.authApiUrl}/email/resend`)
        .then(({ data }) => {
          this.status = data.status;
          this.form.reset();
        });
    },
  },
};
</script>
