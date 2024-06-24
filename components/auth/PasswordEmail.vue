<template>
    <div>
        <div v-if="form.successful">
            <div class="d-flex align-items-center">
                <fa icon="check-circle" class="text-success" />
                <p class="mb-0 ml-2" style="font-weight: 500;">Password reset link has been sent to your email account</p>
            </div>
            <hr class="my-2">
            <p class="mb-2">Please check your email and click on the link to reset your password.</p>
            <span class="font-weight-bold">Link not received?</span><a href="javascript:;" class="text-underline ml-2" @click="send()">Resend</a>
        </div>
        <form @submit.prevent="send" @keydown="form.onKeydown($event)" class="text-center" v-else>
            <!-- Email -->
            <div class="form-group">
                <h6 class="font-weight-500">Reset Password</h6>
                <input
                    v-model="form.email"
                    :class="{ 'is-invalid': form.errors.has('email') }"
                    type="email"
                    name="email"
                    class="form-control text-center"
                    placeholder="Enter registered email address"
                />
                <p v-if="form.errors.has('email')" class="text-danger text-left font-weight-500 mt-1">
                    <fa icon="check-square" />
                    The email entered did not match our records. Please check your registered email.
                </p>
            </div>

            <!-- Submit Button -->
            <div class="form-group">
                <button type="submit" class="btn fp-btn-gradient" :class="{'btn-loading': form.busy}" :disabled="form.busy">Send password reset link</button>
            </div>
        </form>
    </div>
</template>

<script>
import Form from 'vform'

export default {
    data: () => ({
            status: '',
            form: new Form({
            email: ''
        })
    }),

    methods: {
        send () {
            this.form.post(`/password/email`).then(({ data }) => {
                this.status = data.status
                // this.form.reset()
            })
        }
    }
}
</script>
