<template>
  <div class="row pt-3 pt-md-3 justify-content-center mb-5 register-content">
    <div class="col-md-6 col-lg-5 d-none d-md-block">
      <login-card />
    </div>
    <div class="col-md-6 col-lg-5">
      <div class="signup-container fp-card p-0 p-md-4">
        <div v-if="mustVerify">
          <form @submit.prevent="verifyCode()">
            <verify-form v-if="isEmailUse" mode="email" @sent="verificationCodeSent" :resend="true"
                         :email="form_verify.email" :user_id="form_verify.user_id" />
            <verify-form v-else mode="phone_number" @sent="verificationCodeSent" :resend="true"
                         :phone_number="phoneNumberObj" />
            <div v-if="isEmailUse" class="my-2 d-flex align-items-center">
              <strong> Don't have access to Email?</strong>&nbsp;&nbsp;
              <fp-icon name="mobile" class="fp-fs-24 fp-text-color-main" />&nbsp;
              <a href="javascript:;" tabindex="-1" class="fp-text-color-primary text-underline"
                 @click="isEmailUse = false">Use phone number.</a>
            </div>
            <div v-else class="my-2 d-flex align-items-center">
              <strong> Having trouble with phone?</strong>&nbsp;&nbsp;
              <fp-icon name="email" class="fp-fs-24 fp-text-color-main" />&nbsp;
              <a href="javascript:;" tabindex="-1" class="fp-text-color-primary text-underline"
                 @click="isEmailUse = true">
                Use email address</a>
            </div>
            <div class="fp-border-color-1 p-2 p-md-3 border round-12 mt-4">
              <div class="d-flex align-items-center mb-3">
                <fa icon="check-circle" class="text-success" />
                <p class="fp-text-color-main mb-0 ml-2" style="font-size: 13.6px">
                  Enter the 4 digit verification code
                </p>
              </div>
              <div class="mb-3">
                <input v-model="form_verify.verification_code" type="code" class="form-control form-control-lg code-input"
                       :class="{
                         'is-invalid': form_verify.errors.has('verification_code'),
                       }" maxlength="4" required placeholder="Enter code here" />
                <div v-if="form_verify.errors.has('verification_code')" class="invalid-feedback d-block">
                  <fp-icon name="alert-circle" class="fp-fs-20 mt-n-2px" />
                  {{ form_verify.errors.get("verification_code") }}
                </div>
              </div>
              <div class="justify-center">
                <button type="submit" class="btn fp-btn-gradient px-4" :class="{
                  'btn-loading':
                    form_verify.mode === 'verify' && form_verify.busy,
                }" :disabled="form_verify.mode === 'verify' && form_verify.busy">
                  SUBMIT
                </button>
              </div>
            </div>
          </form>
          <div class="mt-4">
            <fp-icon name="user-check" class="fp-fs-24 fp-text-color-main" />
            Already have an account?
            <a href="javascript:;" class="fp-text-active ml-2" style="text-decoration: underline"
               @click.prevent="handleLogin"><strong>Login</strong></a>
          </div>
        </div>
        <div v-else>
          <form @submit.prevent="register" @keydown="form.onKeydown($event)" class="">
            <div>
              <div class="text-center d-md-none">
                <h4 class="fp-text-active">Sign Up</h4>
              </div>
              <div>
                <!-- First Name -->
                <div class=" mb-3 mb-md-2">
                  <label class="d-md-none">First Name</label>
                  <div class="icon-prefix-input">
                    <fp-icon name="user" />
                    <input v-model="form.first_name" :class="{
                      'is-invalid':
                        form.errors.has('first_name') ||
                        (showErrors && !form.first_name),
                    }" type="text" name="first_name" class="form-control" placeholder="First name" required
                           maxlength="50" @keydown="validateSpace" />
                  </div>
                  <has-error :form="form" field="first_name" />
                </div>

                <!-- Last Name -->
                <div class="mb-3 mb-md-2">
                  <label class="d-md-none">Last Name</label>
                  <div class="icon-prefix-input">
                    <fp-icon name="user" />
                    <input v-model="form.last_name" :class="{
                      'is-invalid':
                        form.errors.has('last_name') ||
                        (showErrors && !form.last_name),
                    }" type="text" name="last_name" class="form-control" placeholder="Last name" required
                           maxlength="50" @keydown="validateSpace" />
                  </div>
                  <has-error :form="form" field="last_name" />
                </div>
              </div>
            </div>
            <div>
              <div class="mb-3 mb-md-2">
                <label class="d-md-none">Date of Birth</label>
                <div class="icon-prefix-input">
                  <fp-icon name="datepicker" />
                  <datepicker v-model="form.date_of_birth" :disabled-dates="disabledDates" :open-date="lastAvailableDate"
                              :input-class="{
                                'form-control': true,
                                'is-invalid': showErrors && !form.date_of_birth,
                              }" placeholder="Date of birth"></datepicker>
                </div>
                <div v-if="form.errors.has('date_of_birth') ||
                  (showErrors && !form.date_of_birth)
                  " class="invalid-feedback d-block">
                  <fp-icon name="alert-circle" class="fp-fs-20 mt-n-2px" />
                  Please select Date of Birth
                </div>
              </div>
              <!-- Gender -->
              <div class="mb-3 mb-md-2">
                <label class="d-md-none">Gender</label>
                <gender-input v-model="form.gender" direction="right" :is-invalid="form.errors.has('gender') || (showErrors && !form.gender)
                  " />
                <div v-if="form.errors.has('gender') || (showErrors && !form.gender)
                  " class="invalid-feedback d-block">
                  <fp-icon name="alert-circle" class="fp-fs-20 mt-n-2px" />
                  Please select your Gender
                </div>
              </div>
              <div v-if="form.gender === 'custom'" class="col-12 px-1 mb-2">
                <div class="icon-prefix-input">
                  <fp-icon name="gender" />
                  <input v-model="form.custom_gender" :class="{
                    'is-invalid':
                      form.errors.has('custom_gender') ||
                      (showErrors &&
                        form.gender === 'custom' &&
                        form.custom_gender == ''),
                  }" type="text" name="custom_gender" class="form-control" placeholder="Enter custom gender"
                         maxlength="128" />
                </div>
                <div v-if="showErrors && form.custom_gender == ''" class="invalid-feedback">
                  <span v-if="form.custom_gender == ''">Please enter custom gender</span>
                  <!-- <span v-else>Custom gender allowed only alphabets</span> -->
                </div>
              </div>
            </div>

            <!-- Email -->
            <div v-if="isEmailUse" class="mb-2">
              <label class="d-md-none">Email</label>
              <div class="icon-prefix-input has-info">
                <fp-icon name="email" />
                <input v-model="form.email" :class="{ 'is-invalid': form.errors.has('email') }" type="email" name="email"
                       class="form-control" placeholder="Enter your email address" required maxlength="256" />
                <fp-icon name="question" class="info mr-2 fp-fs-18" v-tooltip="`We 'll send you a verification code.`" />
              </div>
              <div v-if="form.errors.has('email')" class="invalid-feedback d-block">
                <fp-icon name="alert-circle" class="fp-fs-20 mt-n-2px" />
                {{ form.errors.get("email") }}
              </div>
            </div>
            <!-- Phone Number -->
            <div v-show="!isEmailUse" class="mb-2">
              <label class="d-md-none">Phone Number</label>
              <div class="phone-number-input has-info">
                <phone-number-input v-model="phoneNumberObj" :required="!isEmailUse" />
                <fp-icon name="question" class="info mr-2 fp-fs-18" v-tooltip="`We 'll send you a verification code.`" />
              </div>
              <has-error :form="form" field="phone_number" />
            </div>
            <div v-if="isEmailUse" class="d-flex justify-content-end align-items-center mb-3 mb-md-2">
              <span class="mr-2">Don't have an email?</span>
              <fp-icon name="mobile" class="fp-fs-24 fp-text-color-main" />&nbsp;&nbsp;
              <a href="javascript:;" tabindex="-1" class="fp-text-color-primary" @click="isEmailUse = false">Use phone
                number.</a>
            </div>
            <div v-else class="d-flex justify-content-end mb-3 mb-md-2">
              <span class="mr-2">Having trouble with phone?</span>
              <fp-icon name="email" class="fp-fs-24 fp-text-color-main" />&nbsp;&nbsp;
              <a href="javascript:;" tabindex="-1" class="fp-text-color-primary" @click="isEmailUse = true">Use email
                address
              </a>
            </div>
            <!-- Username -->
            <div class="mb-3 mb-md-2">
              <label class="d-md-none">Username</label>
              <div class="icon-prefix-input">
                <fp-icon name="user" />
                <input v-model="form.username" :class="{
                  'is-invalid':
                    form.errors.has('username') ||
                    (showErrors && !_testUsername()),
                }" type="text" name="username" class="form-control" placeholder="Choose your username" required
                       maxlength="128" />
              </div>
              <p class="mb-0" v-if="showErrors && !_testUsername()" :class="{
                'text-danger': showErrors && !_testUsername(),
                'fp-text-color-main': !showErrors || _testUsername(),
              }" style="font-size: 12.2px; margin-top: 2px">
                Username must be 8-30 char. Allowed only letters, numbers, and
                period(.)
              </p>
              <has-error :form="form" field="username" />
            </div>
            <!-- Password -->
            <div class="form-group">
              <label class="d-md-none">Password</label>
              <div class="icon-prefix-input">
                <fp-icon name="lock" />
                <input v-model="form.password" :class="{
                  'is-invalid':
                    form.errors.has('password') ||
                    (showErrors && !_testPassword()),
                }" type="password" name="password" class="form-control" placeholder="Choose your password" required
                       maxlength="256" />
              </div>
              <p class="mb-0" v-if="showErrors && !_testPassword()" :class="{
                'text-danger': showErrors && !_testPassword(),
                'fp-text-color-main': !showErrors || _testPassword(),
              }" style="font-size: 12.2px; margin-top: 2px">
                Password must contain 8 characters. 1 uppercase, 1 lowercase
                number and special characters
              </p>
              <has-error :form="form" field="password" />
            </div>

            <div class="custom-control custom-checkbox">
              <input type="checkbox" class="custom-control-input" :class="{ invalid: showErrors && !is_accepted }"
                     id="is_accepted" name="accept" v-model="is_accepted" />
              <label class="fp-text-color-main custom-control-label" for="is_accepted">
                By clicking Register, you agree to our
                <router-link :to="{ name: 'terms_of_use' }" class="fp-text-active" target="_blank">Terms of
                  use</router-link>
                and
                <router-link :to="{ name: 'privacy_policies' }" class="fp-text-active" target="_blank">Privacy
                  policy</router-link>
              </label>
            </div>
            <div class="text-center mt-2">
              <button type="submit" class="btn fp-btn-gradient px-5 btn-submit" :class="{ 'btn-loading': form.busy }"
                      :disabled="form.busy">
                <fp-icon name="user-plus" class="fp-fs-22" />
                Sign up
              </button>
            </div>
            <div class="mt-3 d-flex justify-content-center fp-text-color-main">
              Already have an account?
              <a href="javascript:;" class="fp-text-active ml-1" @click="handleLogin">Sign in here</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Form from "vform";
import LoginWithSocial from "./LoginWithSocial.vue";
import LoginCard from "./LoginCard.vue";
import VerifyForm from "./VerifyForm.vue";
import Datepicker from "vuejs-datepicker";
import PhoneNumberInput from "../elements/PhoneNumberInput.vue";
import GenderInput from "../elements/GenderInput.vue";
import Swal from "sweetalert2";
export default {
  name: "Register",
  components: {
    LoginWithSocial,
    LoginCard,
    VerifyForm,
    Datepicker,
    PhoneNumberInput,
    GenderInput,
  },
  data() {
    return {
      appName: process.env.appName,
      form: new Form({
        username: "",
        first_name: "",
        last_name: "",
        email: "",
        phone_number: "",
        password: "",
        gender: "",
        custom_gender: "",
        date_of_birth: "",
      }),
      is_accepted: false,
      mustVerify: false,
      isEmailUse: true,
      form_verify: new Form({
        user_id: "",
        mode: "verify",
        verification_code: "",
        email: "",
        phone_number: "",
      }),
      modal_mode: "phone_number",
      showErrors: false,
      phoneNumberObj: {
        country_id: 231,
        code: "+1",
        number: "",
      },
    };
  },
  computed: {
    lastAvailableDate() {
      const currentDate = new Date(); // Current date and time
      const yearThirteenYearsAgo = currentDate.getFullYear() - 13;
      const dateThirteenYearsAgo = new Date(
        yearThirteenYearsAgo,
        currentDate.getMonth(),
        currentDate.getDate()
      );
      return dateThirteenYearsAgo;
    },
    disabledDates() {
      return {
        from: this.lastAvailableDate,
      };
    },
    phone_number() {
      if (this.phoneNumberObj.number) {
        return `${this.phoneNumberObj.code}${this.phoneNumberObj.number}`;
      } else {
        return "";
      }
    },
    auth_user() {
      return this.$store.getters["auth/user"];
    },
  },
  mounted() {
    console.log(this.$route.query);
    if (this.$route.query.step === "verify") {
      if (this.$route.query.phone_number) this.isEmailUse = false;
      this.form_verify.user_id = this.$route.query.user_id;
      this.form_verify.email = this.$route.query.email;
      this.form_verify.phone_number = this.$route.query.phone_number;
      this.mustVerify = true;
    }
  },
  methods: {
    async handleLogin() {
      this.$router.push({ name: "login" });
    },
    async handleUse() {
      if (this.isEmailUse) {
        this.isEmailUse = false;
        this.$modal.show("phone_verification_modal");
      } else {
        this.isEmailUse = true;
      }
    },
    async register() {
      if (!this._validate() || !this._testUsername() || !this._testPassword)
        return;
      this.showErrors = false;
      let response;
      // Register the user.
      this.form.verification_field =
        !this.isEmailUse && this.phone_number ? "phone_number" : "email";
      this.form_verify.email = this.form.email;
      this.form_verify.phone_number = this.phone_number;
      this.form.phone_number = this.phone_number;
      try {
        response = await this.form.post(`/register`);
      } catch (e) {
        return;
      }

      // Must verify email fist.
      let user = null;
      if (response.data.message == "verify") {
        this.mustVerify = true;
        user = response.data.data;
        this.form_verify.user_id = user.id;
        this.$store.dispatch("auth/setUnverifiedUser", { user });
      } else {
        // Log in the user.
        const { data } = await this.form.post(`/login`);

        // Save the token.
        this.$store.dispatch("auth/saveToken", { token: data.data.token });

        // Update the user.
        await this.$store.dispatch("auth/updateUser", { user: data.data.user });
        user = data.data.user;

        this.$modal.hide("auth_modal");
      }

      if (user.location && user.location.city) {
        // Save Fliconn Location Detail
        let profile_location_form = {
          user_id: user.id,
          hometown_place: user.location.city,
          currently_living_in: user.location.city,
        };
        await this.axios.post(
          `${process.env.timelineApiUrl}/profile/save_location_details`,
          profile_location_form
        );
      }
    },
    _validate() {
      if (this.form.date_of_birth == "") return this._formError();
      if (this.form.gender == "") return this._formError();
      if (this.form.gender === "custom") {
        if (
          this.form.custom_gender === "" ||
          /^[a-zA-Z0-9 ]+$/.test(this.form.custom_gender) == false
        )
          return this._formError();
      }
      if (this.form.username.trim() === "" || !this._testUsername())
        return this._formError();
      if (!this.is_accepted) return this._formError();
      if (this.form.password == "" || !this._testPassword())
        return this._formError();
      return true;
    },

    _testPassword() {
      const regex =
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
      console.log("regex o/p is", regex.test(this.form.password));
      return regex.test(this.form.password);
    },
    _testUsername() {
      if (this.form.username.length < 8 || this.form.username.length > 30) {
        return false;
      }
      const regex = /^[a-zA-Z0-9\.]+$/;
      return regex.test(this.form.username);
    },
    _formError() {
      this.showErrors = true;
      return false;
    },
    setModalContent(modal_content) {
      this.$store.dispatch("auth/setModalContent", { modal_content });
    },
    async verifyCode() {
      this.form_verify.mode = "verify";
      if (this.form_verify.verification_code.length !== 4) {
        this.$toast.error("Please insert 4 digits code!");
      } else {
        try {
          const response = await this.form_verify.post(
            this.isEmailUse
              ? `/auth/verify_email_verification_code`
              : `/auth/verify_phone_number_verification_code`
          );
          if (response.data.status == "Success") {
            this.$toast.success("Welcome to FlickerPage Networks!");

            const result = response.data.data;
            // Save the token.
            console.log("here is save token", response.data);
            console.log("here is result", result);

            await this.$store.dispatch("auth/saveToken", {
              token: result.token,
            });
            console.log("passed store token");
            // Fetch the user.
            await this.$store.dispatch("auth/fetchUser");
            console.log("here is fetch user end");
            this.email_verified = true;
            this.code = " ";
            console.log("here is before routing");
            this.$router.push({ name: "index" });
            console.log("here is after routing");
          }
          // else if (response?.data?.status == 'Error')
          // {
          //     this.$toast.error('Verification code doesnt match');
          // }
          // else {
          //     this.$toast.error("Something went wrong");
          // }
        } catch (error) {
          // this.$toast.error('Verification code does not matched..!please enter the correct one')
          console.log("error is", error);
          console.log("error is", error.response);
          console.log(error.response.data?.errors);
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text:
              error.response.data?.errors?.verification_code[0] ||
              "Something went wrong, please try again",
            reverseButtons: true,
            showCancelButton: true,
          });
          // this.$toast.error(error.response.data?.errors?.verification_code[0])
        }
      }
    },
    verificationCodeSent(data) {
      this.$modal.hide("verification_modal");
      this.form.email = data.email;
      this.form.phone_number = data.phone_number;
      this.form_verify.email = data.email;
      this.form_verify.phone_number = data.phone_number;
      this.form_verify.verification_code = "";
      if (!this.mustVerify) this.register();
    },
    validateSpace(event) {
      if (event.key === " " && event.target.value.includes(" ")) {
        event.preventDefault();
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.register-content {
  margin-top: 150px;

  @media (max-width: 600px) {
    margin-top: 0px;
  }
  
  @media (max-height: 700px) {
    margin-top: 70px;
  }
}

.row {
  margin-inline: 0px !important;
}

form {
  &>:first-child {
    &>:last-child {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      gap: .5em;

      &>:first-child {
        width: 100%;
      }

      &>:last-child {
        width: 100%;
      }

      @media (max-width: 600px) {
        flex-direction: column;
      }
    }
  }

  &>:nth-child(2) {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    gap: .5em;

    &>:first-child {
      width: 100%;
    }

    &>:last-child {
      width: 100%;
    }

    @media (max-width: 600px) {
      flex-direction: column;
    }
  }
}

h3 {
  @media (max-width: 600px) {
    font-size: 25px;
  }
}

.signup-container {
  border-radius: 12px;
  height: 100%;
  padding-inline: 10px;

  @media (max-width: 767px) {
    background-color: transparent;
  }

  &::v-deep {
    .vdp-datepicker {
      width: 100%;
    }
  }
}

.custom-date-input::before {
  content: attr(placeholder);
  position: absolute;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
  z-index: -1;
  opacity: 0.5;
}

.phone-icon {
  margin-top: -5px;
}

.phone-verification-modal::v-deep {
  .vm--modal {
    overflow: unset;
  }
}

.phone-number-input {
  &.has-info {
    position: relative;

    input {
      padding-right: 34px;
    }

    .info {
      position: absolute;
      top: 10px;
      right: 10px;
      z-index: 3;
    }
  }
}

.btn-submit {
  @media (max-width: 600px) {
    width: 100%;
  }
}
</style>
