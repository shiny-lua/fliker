<template>
    <div class="row pt-3 pt-md-3 justify-content-center">
        <div class="col-md-6 col-lg-5 d-none d-md-block">
            <login-card />
        </div>
        <div class="col-md-6 col-lg-5">
            <div class="login-container fp-card p-md-4">
                <h4 class="mb-4">Welcome to <span class="fp-text-active">FlickerPage</span></h4>
                <div class="card fp-card p-0 form-wrapper round-10 overflow-hidden mb-4">
                    <div class="card-header">
                        <h5 class="text-center mb-0">Forgot Username</h5>
                    </div>
                    <div class="card-body">
                        <div v-if="form.successful">
                            <alert-success :form="form" :message="status">
                                <div class="d-flex align-items-center">
                                    <fa icon="check-circle" class="text-success" />
                                    <p class="mb-0 ml-2" style="font-weight: 500;">
                                        {{form.field === 'phone_number' ? 'We have successfully sent SMS link with your username.' : 'We have emailed your username reset link!'}}
                                    </p>
                                </div>
                            </alert-success>
                        </div>
                        <div v-if="form.errors.has('phone_number')" class="error-message">
                            <alert-error :form="form" :message="status">
                                <div class="d-flex align-items-center">
                                    <fa icon="times-circle" class="alert-icon" />
                                    <p class="mb-0 ml-2">{{form.errors.get('phone_number')}}</p>
                                </div>
                            </alert-error>
                        </div>
                        <div v-else-if="form.errors.has('email')" class="error-message">
                            <alert-error :form="form" :message="status">
                                <div class="d-flex align-items-center">
                                    <fa icon="times-circle" class="alert-icon" />
                                    <p class="mb-0 ml-2">{{form.errors.get('email')}}</p>
                                </div>
                            </alert-error>
                        </div>
                        <form @submit.prevent="send" @keydown="form.onKeydown($event)">
                            <!-- Email -->
                            <div v-if="form.field === 'email'" class="d-flex align-items-center mb-2">
                                <fp-icon name="mobile" class="fp-fs-24 fp-text-color-main" />&nbsp;
                                <a href="javascript:;" class="fp-text-color-primary" tabindex="-1" @click.prevent="form.field = 'phone_number'">Use phone number.</a>
                            </div>
                            <div v-if="form.field === 'phone_number'" class="d-flex align-items-center mb-2">
                                <fp-icon name="email" class="fp-fs-24 fp-text-color-main" />
                                &nbsp;
                                <a href="javascript:;" class="fp-text-color-primary" tabindex="-1" @click.prevent="form.field = 'email'">Use email</a>
                            </div>
                            <div v-if="form.field === 'email'" class="mb-3">
                                <div class="icon-prefix-input">
                                    <fp-icon name="email" />
                                    <input v-model="form.email"
                                         :class="{ 'is-invalid': form.errors.has('email') }"
                                         type="email"
                                         name="email"
                                         class="form-control"
                                         placeholder="Enter registered email address"
                                         required maxlength="256"
                                    />
                                </div>
                            </div>
                            <!-- Phone Number -->
                            <div v-show="form.field === 'phone_number'" class="mb-3">
                                <div class="phone-number-input">
                                    <phone-number-input v-model="phoneNumberObj"
                                         :required="form.field === 'phone_number'"
                                         placeholder="Enter registered phone number"
                                    />
                                </div>
                            </div>

                            <!-- Submit Button -->
                            <div class="text-center">
                                <button type="submit"
                                     class="btn fp-btn-gradient"
                                     :class="form.busy && 'btn-loading'"
                                     :disabled="form.busy"
                                >
                                    Send username
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
                <div class="d-flex align-items-center mb-3 fp-text-color-main">
                    <fp-icon name="lock" class="fp-fs-24 fp-text-color-main" />
                    &nbsp;
                    Forgot password? &nbsp;
                    <router-link :to="{name: 'password.request'}" class="fp-text-active">click here</router-link>
                </div>
                <div class="d-flex align-items-center mb-3 fp-text-color-main">
                    <fp-icon name="sign-in" class="fp-fs-24 fp-text-color-main" />
                    &nbsp;
                    Want to login to your account? &nbsp;&nbsp;
                    <router-link :to="{name: 'login'}" class="fp-text-active">Login</router-link>
                </div>
                <div class="d-flex align-items-center mb-4 fp-text-color-main">
                    <fp-icon name="user-plus" class="fp-fs-24 fp-text-color-main" />&nbsp;
                    Don't have an account? &nbsp;&nbsp;
                    <router-link :to="{name: 'register'}" class="fp-text-active">Sign up</router-link>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import Form from "vform";
    import LoginCard from "../../../components/auth/LoginCard.vue";
    import PhoneNumberInput from "../../../components/elements/PhoneNumberInput.vue"

    export default {
        name: 'ForgotUsername',
        data() {
            return {
                status: "",
                form: new Form({
                    field: 'email',
                    email: "",
                    phone_number: '',
                }),
                phoneNumberObj: {
                    country_id: 231,
                    code: '+1',
                    number: '',
                }
            };
        },
        components: {
            LoginCard,
            PhoneNumberInput,
        },

        head() {
            return { title: "Reset UserName" };
        },
        computed: {
            phone_number() {
                if (this.phoneNumberObj.number) {
                    return `${this.phoneNumberObj.code}${this.phoneNumberObj.number}`.replace(/[ ()]/g, '');
                } else {
                    return '';
                }
            },
        },
        methods: {
            send() {
                if (this.form.field === 'phone_number') {
                    this.form.phone_number = this.phone_number;
                }
                this.form.post(`/username/email`).then(({ data }) => {
                    this.status = data.status;
                });
            },
        },
    };
</script>

<style lang="scss" scoped>
    h3 {
        @media (max-width: 600px) {
            font-size: 25px;
        }
    }

    .login-container {
        border-radius: 12px;
        height: 100%;
    }

    .reset-btn {
        border-radius: 50px;
        outline: none !important;
    }
    .error-message {
        &::v-deep {
            .alert-danger {
                background-color: #ed1c24;
                color: #FFF;
                font-size: 14px;
                font-weight: 400;
                padding: .5rem 1rem;
                .alert-icon {
                    font-size: 24px;
                }
            }
        }
    }
</style>
