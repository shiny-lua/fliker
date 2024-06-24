<template>
    <div class="row justify-content-center">
        <div class="col-lg-10 col-xl-9 mt-3 mt-md-5">
            <h4 class="text-center mb-3">Upgrade/Downgrade Plan</h4>
                <Plans v-if="automotive_seller"
                    :current="automotive_seller.subscription.plan_id"
                    @selected="selectPlan"
                />
                <div class="text-center mt-3">
                    <a href="#" class="btn btn-dark" @click.prevent="$router.back()"><fa icon="times" /> Cancel</a>
                    <button
                        type="button"
                        class="btn btn-success ml-2"
                        @click="change"
                        :disabled="form.busy"
                        :class="form.busy && 'btn-loading'"
                    >
                        <fa :icon="['far', 'save']" /> Change
                    </button>
                </div>
        </div>
    </div>
</template>
<script>
import Plans from "~/components/automotive/Plans.vue"
import Form from "vform"
export default {
    name: 'UpdateSubscription',
    components: {
        Plans,
    },
    data() {
        return {
            automotive_seller: null,
            form: new Form({
                automotive_seller_id: null,
                plan_id: null
            })
        }
    },
    computed: {
        auth_user() {
            return this.$store.getters["auth/user"];
        },
    },
    mounted() {
        this.load()
    },
    methods: {
        async load() {
            const response = await this.axios.post(`${process.env.adsApiUrl}/automotive/get_seller_profile`, {user_id: this.auth_user.id})
            this.automotive_seller = response.data.data
            this.form.automotive_seller_id = this.automotive_seller.id
        },
        selectPlan(item) {
            this.form.plan_id = item.id
        },
        async change() {
            if (this.form.plan_id == null) {
                this.$toast.error('Please select plan');
                return false
            }
            const response = await this.form.post(`${process.env.adsApiUrl}/stripe/update_subscription`)
            if (response.data.status === 'Success') {
                this.$toast.success('Changed successfully')
                this.$router.back()
            }
        }
    }
}
</script>