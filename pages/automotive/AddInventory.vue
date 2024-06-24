<template>
    <div class="add-post">
        <inventory-form
             mode="add"
             :has-seller-profile="!!auth_user.automotive_seller"
        />
    </div>
</template>
<script>
import InventoryForm from '~/components/automotive/InventoryForm.vue';
export default {
    middleware: 'auth',
    components: {
        InventoryForm,
    },
    computed: {
        auth_user() {
            return this.$store.getters["auth/user"];
        },
    },
}
</script>
<style lang="scss" scoped>
    .add-post {
        padding-top: 16px;
        @media (min-width: 901px) {
            padding-top: 36px;
        }
    }
</style>