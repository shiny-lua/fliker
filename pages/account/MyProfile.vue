<template>
    <div class="col-lg-10">
        <div class="card card-user">
            <div class="row">
                <div class="col-md-12 px-3 px-md-5 py-3">
                    <h4 class="text-center mb-3 mt-md-4">Basic Information</h4>
                    <form @submit.prevent="update" @keydown="form.onKeydown($event)">
                        <div class="card card-body">
                            <div class="row mx-0">
                                <div class="col-md-6">
                                    <div class="form-group row">
                                        <label class="col-sm-4 col-form-label control-label text-sm-right">First Name</label>
                                        <div class="col-sm-8 disabled-input-container">
                                            <input v-model="form.first_name" :class="{ 'is-invalid': form.errors.has('first_name') }" type="text" name="first_name" class="form-control" placeholder="Ex. Ramana" disabled />
                                            <span class="information"
                                                v-tooltip="`This field can not modified. Please contact fliconn-support@fliconpage.com fo help.`"
                                            ><fa :icon="['far', 'question-circle']" /></span>
                                            <has-error :form="form" field="first_name" />
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="form-group row">
                                        <label class="col-sm-4 col-form-label control-label text-sm-right">Last Name</label>
                                        <div class="col-sm-8 disabled-input-container">
                                            <input v-model="form.last_name" :class="{ 'is-invalid': form.errors.has('last_name') }" type="text" name="last_name" class="form-control" placeholder="Ex. Gude" disabled />
                                            <span class="information"
                                                v-tooltip="`This field can not modified. Please contact fliconn-support@fliconpage.com fo help.`"
                                            ><fa :icon="['far', 'question-circle']" /></span>
                                            <has-error :form="form" field="last_name" />
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="form-group row">
                                        <label class="col-sm-4 col-form-label control-label text-sm-right">Email</label>
                                        <div class="col-sm-8 disabled-input-container">
                                            <input v-model="form.email" :class="{ 'is-invalid': form.errors.has('email') }" type="email" name="email" class="form-control" placeholder="Ex. yourmail@gmail.com" />
                                            <span class="information"
                                                title="Email verification is required"
                                            ><fa :icon="['far', 'question-circle']" /></span>
                                            <has-error :form="form" field="email" />
                                            <div class="form-check mt-1">
                                                <label class="form-check-label">
                                                    <input class="form-check-input" type="checkbox" v-model="form.hide_email"> Hide email from others
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="form-group row">
                                        <label class="col-sm-4 col-form-label control-label text-sm-right">Phone Number</label>
                                        <div class="col-sm-8">
                                            <input v-model="form.phone_number" :class="{ 'is-invalid': form.errors.has('phone_number') }" type="text" name="phone_number" class="form-control" placeholder="Ex. +1 XXX-XXX-XXXX" />
                                            <has-error :form="form" field="phone_number" />
                                            <div class="form-check mt-1">
                                                <label class="form-check-label">
                                                    <input class="form-check-input" type="checkbox" v-model="form.hide_phone_number"> Hide phone from others
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="form-group row">
                                        <label class="col-sm-4 col-form-label control-label text-sm-right">Gender</label>
                                        <div class="col-sm-8">
                                            <select v-model="form.gender" :class="{ 'is-invalid': form.errors.has('gender') }" name="gender" class="form-control">
                                                <option value="" hidden>Select</option>
                                                <option value="male">Male</option>
                                                <option value="femail">Female</option>
                                                <option value="custom">Custom</option>
                                            </select>
                                            <transition>
                                                <input v-show="form.gender === 'custom'" v-model="form.custom_gender" type="text" name="custom_gender" class="form-control mt-2" maxlength="20" placeholder="Enter custom gender" />
                                            </transition>
                                            <has-error :form="form" field="gender" />
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="form-group row">
                                        <label class="col-sm-4 col-form-label control-label text-sm-right">Date Of Birth</label>
                                        <div class="col-sm-8">
                                            <input v-model="form.date_of_birth" :class="{ 'is-invalid': form.errors.has('date_of_birth') }" type="date" name="date_of_birth" class="form-control" />
                                            <has-error :form="form" field="date_of_birth" />
                                            <div class="form-check-inline mt-1">
                                                <label class="form-check-label">
                                                    <input class="form-check-input" type="checkbox" v-model="form.hide_dob"> Hide my DOB
                                                </label>
                                            </div>
                                            <div class="form-check-inline mt-1">
                                                <label class="form-check-label">
                                                    <input class="form-check-input" type="checkbox" v-model="form.show_only_date_month"> Show month and date
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-12">
                                    <div class="form-check mt-3 ml-md-5">
                                        <label class="form-check-label">
                                            <input class="form-check-input" type="checkbox" v-model="form.acknowledge">
                                            I acknowledge all the information provided by me here is accurate, true, and complete. Further, I hereby acknowledge that I have read and understood the terms of use and privacy policies of FlickerPage.com and its services.
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="text-center mt-3">
                            <button type="submit" class="btn btn-success px-5" :class="{'btn-loading': form.busy}">Save</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        <modal
            name="email_verify_modal"
            width="500"
            height="auto"
            :adaptive="true"
        >
            <dir class="p-2 m-0 font-weight-500">
                <div class="card card-body">
                    <p class="text-center">
                        Please enter the 6 digit verification code sent to your email
                        <br />
                        {{ form.email.split('@')[0].slice(0, 4) }}****@{{ form.email.split('@')[1] }}
                    </p>
                    <input type="text" maxlength="6" class="form-control form-control-sm mx-auto w-50" v-model="code" />
                    <div class="text-center mt-2">
                        <a href="javascript:;" class="btn btn-sm btn-primary" @click="sendVerificationCode(true)">Resend</a>
                        <a href="javascript:;" class="btn btn-sm btn-danger ml-1" @click.prevent="$modal.hide('email_verify_modal')">Cancel</a>
                        <a href="javascript:;" class="btn btn-sm btn-success ml-1" @click="verify()">Verify</a>
                    </div>
                    <p v-if="resent_code" class="mb-0 mt-3 text-success text-center"><fa icon="check-circle" /> A new email verification code is resent successfully!</p>
                </div>
            </dir>
        </modal>
    </div>
</template>


<script>
import Form from 'vform'
import { mapGetters } from 'vuex'

export default {
    middleware: 'auth',
    data: () => ({
        form: new Form({
            first_name: '',
            last_name: '',
            gender: '',
            custom_gender: '',
            email: '',
            hide_email: false,
            phone_number: '',
            hide_phone_number: false,
            date_of_birth: '',
            hide_dob: false,
            show_only_date_month: false,
            acknowledge: false,
        }),
        email_verified: false,
        resent_code: false,
        code: '',
    }),

    computed: mapGetters({
        auth_user: 'auth/user'
    }),

    mounted() {
        // Fill the form with user data.
        this.form = new Form({
            first_name: this.auth_user.first_name,
            last_name: this.auth_user.last_name,
            gender: this.auth_user.gender,
            custom_gender: this.auth_user.custom_gender,
            email: this.auth_user.email,
            hide_email: this.auth_user.hide_email,
            phone_number: this.auth_user.phone_number,
            hide_phone_number: this.auth_user.hide_phone_number,
            date_of_birth: this.auth_user.date_of_birth,
            hide_dob: this.auth_user.hide_dob,
            show_only_date_month: this.auth_user.show_only_date_month,
            acknowledge: this.auth_user.acknowledge,
        });
    },

    methods: {
        async update () {
            if (this.auth_user.email != this.form.email && !this.email_verified) {
                let result  = await this.sendVerificationCode()
                if (result) this.$modal.show('email_verify_modal');
                return false;
            }
            const response = await this.form.post(`/settings/profile`)
            let user = response.data.data;
            this.$toast.success('Information updated successfully');
            this.$store.dispatch('auth/updateUser', { user });
        },
        async sendVerificationCode(is_resent = false) {
            try {
                await this.axios.post(`/profile/send_email_verification_code`, {email: this.form.email})
                if (is_resent) this.resent_code = true
                return true
            } catch (e) {
                this.$toast.error(e.response.data.message)
                return false
            }
        },
        async verify() {
            const response = await this.axios.post(`/profile/verify_email_verification_code`, {code: this.code})
            if (response.data.data.status === 'success') {
                this.$toast.sucess('Verified successfully')
                this.email_verified = true
                this.code = ' '
                this.$modal.hide('email_verify_modal')
            } else {
                this.$toast.error('Verification code does not match')
            }
        }
    }
}
</script>
<style lang="scss" scoped>
    .card-user {
        @media (max-width: 600px) {
            padding: 0;
            border: none;
            background-color: #f7f9fb;
            .form-group div.col-sm-8 {
                margin-right: 12px;
            }
        }
    }
</style>