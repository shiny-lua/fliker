<template>
    <div class="offer-create pt-3 pt-md-4">
        <offer-form mode="edit" />
    </div>
</template>
<script>
import OfferForm from "~/components/fliconn/merchant_offers/OfferForm.vue";
export default {
    name: 'offer-edit',
    middleware: 'auth',
    components: {
        OfferForm,
    }
}
</script>