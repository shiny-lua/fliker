<template>
    <div class="settings-deactivate">
        <div class="settings-card fp-card mb-4">
            <h6>Deactivate your account</h6>
            <p class="fp-text-color-main">Deactivating your user account will temporarily disable your access. You can reactivate it anytime if you wish to use your account.</p>
            <div>
                <a href="javascript:;" class="btn fp-btn-outline-danger px-4" style="width: 120px;" @click="deactivateAccount()">Deactivate</a>
            </div>
        </div>
        <div class="settings-card fp-card">
            <h6>Delete your account</h6>
            <p class="fp-text-color-main">Deleting your account will permanently remove all your information online. It is recommended to use the "Deactivate" option instead of "Delete" if you plan to access your account in the future.</p>
            <div>
                <a href="javascript:;" class="btn fp-btn-outline-danger px-4" style="width: 120px;" @click="deleteAccount()">Delete</a>
            </div>
        </div>
        <fp-modal
            name="confirmDeactivateModal"
            :title="form.status === 'deleted' ? 'Delete account?' : 'Deactivate account?'"
            @before-open="form.reset()"
        >
            <p class="fp-text-color-main">{{ form.status === 'deleted' ? text_delete : text_deactivate }}</p>
            <form action="" class="mt-3" @submit.prevent="submit">
                <div class="form-group text-left">
                    <label for="" class="font-weight-bold">Password</label>
                    <input type="password" class="form-control" v-model="form.password" required placeholder="Password" />
                    <has-error :form="form" field="password" />
                </div>
                <div>
                    <button type="button" class="btn fp-btn-outline px-4" @click="$modal.hide('confirmDeactivateModal')">Cancel</button>
                    <button type="submit" class="btn fp-btn-gradient ml-3">{{form.status === 'deleted' ? 'Delete' : 'Deactivate'}}</button>
                </div>
            </form>
        </fp-modal>
    </div>
</template>
<script>
import Form from "vform"
import FpModal from "~/components/ui/Modal.vue";
export default {
    name: 'SettingsDeactivate',
    components: {
        FpModal,
    },
    data() {
        return {
            form: new Form({
                status: 'deactivate',
                password: '',
            }),
            text_deactivate: `You will lose your access to your account immediately once the account is deactivated. It is recommended to back up all the necessary information before your click on "Deactivate".`,
            text_delete: `Your account will be deleted permanently and cannot be recovered. Please back up all the important information before you click on the "Delete" option. `,
        }
    },
    computed: {
        auth_user() {
            return this.$store.getters["auth/user"];
        },
    },
    methods: {
        deactivateAccount() {
            this.form.status = 'deactivated';
            this.$modal.show('confirmDeactivateModal');
        },
        deleteAccount() {
            this.form.status = 'deleted';
            this.$modal.show('confirmDeactivateModal');
        },
        submit() {
            this.form.post(`/settings/deactivate_account`).then(response => {
                if (response.data.status == 'Success') {
                    this.$modal.hide('confirmDeactivateModal')
                    this.$toast.info(this.form.status === 'deleted' ? 'Your account is deleted permanently!' : 'Your account is deactivated!')
                    this.$store.dispatch('auth/logout');
                    this.$router.push({name: 'index'});
                }
            })
        },
    }
}
</script>