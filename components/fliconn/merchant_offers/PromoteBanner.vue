<template>
    <div class="promote-banner fp-card">
        <h5>Register your business &amp; promote unlimited coupons, offers and discounts</h5>
        <p class="fp-text-color-main">Post locally unlimited coupons, offers and discounts on FP. Promote your brand image.</p>
        <router-link :to="{name: 'merchant.promote'}" class="btn btn-block fp-btn-gradient mt-auto">
            <fp-icon name="ads" class="fp-fs-26" />
            Promote on FP
        </router-link>
    </div>
</template>
<style lang="scss" scoped>
    h5 {
        font-size: 16px;
        line-height: 24px;
    }
    .promote-banner {
        display: flex;
        flex-direction: column;
        border-radius: 12px;
        height: 265px;
    }
</style>