<template>
  <div>
    <form v-if="mode === 'phone_number'" @submit.prevent="submitPhoneNumber">
      <div class="phone-number-input-wrapper" :class="resend && 'resend'">
        <phone-number-input v-model="phoneNumberObj" />
        <button
          v-if="resend"
          type="submit"
          class="btn btn-sm py-1 fp-btn-gradient"
          :class="phone_number_form.busy && 'btn-loading'"
        >
          Resend Code
        </button>
      </div>
      <has-error :form="phone_number_form" field="phone_number" />
      <p
        v-if="resend && phone_number_form.successful"
        class="mt-1 mb-3 text-success"
      >
        <fa icon="check-circle" /> Successfully sent verfication code. Please
        check your phone!
      </p>
      <div v-if="!resend" class="text-center mt-3">
        <button
          type="submit"
          class="btn fp-btn-gradient px-4"
          :class="phone_number_form.busy && 'btn-loading'"
        >
          Send Code
        </button>
      </div>
    </form>
    <form v-if="mode === 'email'" @submit.prevent="submitEmail">
      <div
        class="email-input-wrapper icon-prefix-input"
        :class="resend && 'resend'"
      >
        <fp-icon name="email" />
        <input
          v-model="email_form.email"
          :class="{ 'is-invalid': email_form.errors.has('email') }"
          type="email"
          name="email"
          class="form-control"
          placeholder="Email"
          required
          maxlength="150"
        />
        <button
          v-if="resend"
          type="submit"
          class="btn btn-sm fp-btn-gradient py-1"
          :class="email_form.busy && 'btn-loading'"
        >
          Resend Code
        </button>
      </div>
      <has-error :form="email_form" field="email" />
      <p v-if="resend && email_form.successful" class="mt-1 mb-3 text-success">
        <fa icon="check-circle" /> Successfully sent verfication code. Please
        check your email!
      </p>
      <div v-if="!resend" class="text-center mt-3">
        <button
          type="submit"
          class="btn fp-btn-gradient px-4"
          :class="email_form.busy && 'btn-loading'"
        >
          Send Code
        </button>
      </div>
    </form>
  </div>
</template>
<script>
import Form from "vform";
import PhoneNumberInput from "../elements/PhoneNumberInput.vue";
import Swal from "sweetalert2";
export default {
  name: "VerifyForm",
  props: {
    mode: { type: String, default: "phone_number" },
    resend: { type: Boolean, default: true },
    email: { type: String, required: false },
    phone_number: { type: Object, required: false },
    user_id: { type: Number, required: false },
  },
  components: {
    PhoneNumberInput,
  },
  data() {
    return {
      phone_number_form: new Form({
        phone_number: "",
      }),
      email_form: new Form({
        email: this.email,
        userId: this.user_id,
      }),
      phoneNumberObj: {
        country_id: 231,
        code: "+1",
        number: "",
      },
    };
  },
  computed: {
    phone_number_full() {
      if (this.phoneNumberObj.number) {
        return `${this.phoneNumberObj.code}${this.phoneNumberObj.number}`;
      } else {
        return "";
      }
    },
  },
  watch: {
    email(value) {
      this.email_form.email = value;
    },
    phone_number: {
      handler: function (value) {
        if (value instanceof Object) {
          this.phoneNumberObj = value;
        }
      },
      deep: true,
    },
  },
  mounted() {
    if (this.phone_number instanceof Object) {
      this.phoneNumberObj = this.phone_number;
    }
  },
  methods: {
    async submitPhoneNumber() {
      if (!this.phone_number_full) return false;
      this.phone_number_form.phone_number = this.phone_number_full;
      try {
        const response = await this.phone_number_form.post(
          `/auth/send_phone_number_verification_code`
        );
        if (response.data.status === "Success") {
          this.$emit("sent", {
            phone_number: this.phone_number_form.phone_number,
          });
        }
      } catch (e) {
        this.$toast.error("Something went wrong, please try again");
        this.$emit("fail");
      }
    },
    async submitEmail() {
      if (!this.email_form.email) return false;
      try {
        const response = await this.email_form.post(
          `/auth/send_email_verification_code`
        );
        if (response.data.status === "Success") {
          this.$emit("sent", { email: this.email_form.email });
        }
      } catch (e) {
        // this.$toast.error(e.response.data.errors.error || "Something went wrong, please try again");
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text:
            e.response.data.errors.error ||
            "Something went wrong, please try again",
          reverseButtons: true,
          showCancelButton: true,
        });
        this.$emit("fail");
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.phone-number-input-wrapper {
  &.resend {
    position: relative;
    button {
      position: absolute;
      top: 4px;
      right: 4px;
      z-index: 3;
    }
    &::v-deep {
      input {
        padding-right: 110px;
      }
    }
  }
}
.email-input-wrapper {
  &.resend {
    position: relative;
    button {
      position: absolute;
      top: 4px;
      right: 4px;
      z-index: 3;
    }
    input {
      padding-right: 110px;
    }
  }
}
</style>
