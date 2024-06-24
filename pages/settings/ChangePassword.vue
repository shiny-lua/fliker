<template>
    <div class="settings-card fp-card">
        <h6 class="mb-3 text-center">Change Password</h6>
        <div v-if="password_form.successful">
            <div class="d-flex align-items-center">
                <fa icon="check-circle" class="text-success" />
                <p class="mb-0 ml-2" style="font-weight: 500;">Your password has been updated successfully!</p>
            </div>
        </div>
        <form @submit.prevent="updatePassword" @keydown="password_form.onKeydown($event)" v-else>
            <div class="row mx-n2">
                <!-- Current Password -->
                <div class="col-md-6 px-2 mb-3">
                    <label class="mb-1">Current Password</label>
                    <input v-model="password_form.current_password" :class="{ 'is-invalid': password_form.errors.has('current_password') }" type="password" name="current_password" class="form-control" placeholder="Enter your current password" maxlength="256" />
                    <has-error :form="password_form" field="current_password" />
                </div>

                <!-- New Password -->
                <div class="col-md-6 px-2 mb-3">
                    <label class="mb-1">New Password</label>
                    <input v-model="password_form.password" :class="{ 'is-invalid': password_form.errors.has('password') }" type="password" name="password" class="form-control" placeholder="New password" maxlength="256" />
                </div>

                <!-- Password Confirmation -->
                <div class="col-md-6 px-2 mb-3">
                    <label class="mb-1">Confirm Password</label>
                    <input v-model="password_form.password_confirmation" :class="{ 'is-invalid': password_form.errors.has('password_confirmation') }" type="password" name="password_confirmation" class="form-control" placeholder="Confirm new password" maxlength="256" />
                    <has-error :form="password_form" field="password" />
                </div>
            </div>
            <button type="submit" class="btn fp-btn-gradient px-4" :class="{'btn-loading': password_form.busy}">Update</button>
        </form>
    </div>
</template>
<script>
import Form from 'vform'
import { mapGetters } from 'vuex'
export default {
    name: 'SettingsChangePassword',
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
            this.password_form.patch('/settings/password').then((response) => {
                if (response.data.status === 'Success') {
                    this.password_form.reset();
                    this.$store.dispatch('fetchNotifications');
                }
            })
        },
    }
}
</script>
<style lang="scss" scoped>
    .settings-change-password {
        border-radius: 15px;
        background-color: #FFF;
        padding: 30px;
    }
</style>