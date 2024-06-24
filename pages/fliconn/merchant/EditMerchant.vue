<template>
    <div class="merchant-create pt-3 pt-md-4">
        <merchant-form mode="edit" />
    </div>
</template>
<script>
import MerchantForm from "~/components/fliconn/merchant_offers/MerchantForm.vue";
export default {
    name: 'merchant-create',
    components: {
        MerchantForm,
    }
}
</script>