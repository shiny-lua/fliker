<template>
    <div class="col-md-8 col-lg-6">
        <div class="card card-body fp-card card-shadow ">
            <h5 class="my-4 font-weight-bold text-center">Change Password</h5>
            <div v-if="password_form.successful">
                <div class="d-flex align-items-center justify-content-center">
                    <fa icon="check-circle" class="text-success" />
                    <p class="mb-0 ml-2" style="font-weight: 500;">Your password has been updated successfully!</p>
                </div>
            </div>
            <form @submit.prevent="updatePassword" @keydown="password_form.onKeydown($event)" v-else>
                <!-- Current Password -->
                <div class="form-group row">
                    <label class="col-md-4 col-form-label text-md-right font-weight-bold">Current Password</label>
                    <div class="col-md-8">
                        <input v-model="password_form.current_password" :class="{ 'is-invalid': password_form.errors.has('current_password') }" type="password" name="current_password" class="form-control" />
                        <has-error :form="password_form" field="current_password" />
                    </div>
                </div>

                <!-- New Password -->
                <div class="form-group row">
                    <label class="col-md-4 col-form-label text-md-right font-weight-bold">New Password</label>
                    <div class="col-md-8">
                        <input v-model="password_form.password" :class="{ 'is-invalid': password_form.errors.has('password') }" type="password" name="password" class="form-control" />
                        <has-error :form="password_form" field="password" />
                    </div>
                </div>

                <!-- Password Confirmation -->
                <div class="form-group row">
                    <label class="col-md-4 col-form-label text-md-right font-weight-bold">Confirm Password</label>
                    <div class="col-md-8">
                        <input v-model="password_form.password_confirmation" :class="{ 'is-invalid': password_form.errors.has('password_confirmation') }" type="password" name="password_confirmation" class="form-control" />
                        <has-error :form="password_form" field="password_confirmation" />
                    </div>
                </div>

                <!-- Submit Button -->
                <div class="form-group row">
                    <div class="col-md-8 ml-md-auto text-center">
                        <button type="submit" class="btn btn-success" :class="{'btn-loading': password_form.busy}">Update</button>
                    </div>
                </div>
            </form>
        </div>
    </div>
</template>


<script>
import Form from 'vform'
import { mapGetters } from 'vuex'

export default {
    middleware: 'auth',
    data: () => ({
        password_form: new Form({
            current_password: '',
            password: '',
            password_confirmation: ''
        }),
    }),

    computed: mapGetters({
        auth_user: 'auth/user'
    }),

    methods: {
        updatePassword () {
            this.password_form.patch('/settings/password').then(() => {
                this.password_form.reset()
            })
        },
    }
}
</script>