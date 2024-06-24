<template>
    <div class="top-businesses fp-card">
        <div class="d-flex align-items-center mb-3">
            <h6 class="mb-0">Top Businesses</h6>
            <router-link :to="{name: 'merchant.promote'}" class="btn btn-sm fp-btn-gradient py-1 btn-promote ml-auto">Promote on <i>FP</i></router-link>
        </div>
        <fp-slider v-if="merchants.length" :slide-width="172" :slide-count="4" :item-padding="8">
            <div v-for="(merchant, index) in merchants"
                 :key="index"
                 class="business-item"
            >
                <div class="item-wrapper fp-border-color-1">
                    <div class="image-container mb-0">
                        <img :src="merchant.image_url" class="merchant-image" :alt="merchant.name" />
                    </div>
                    <span class="offers-count">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10.2636 3.05851C11.2549 2.18102 12.7451 2.18102 13.7364 3.05851L14.5 3.73444C14.938 4.12218 15.4932 4.35215 16.0771 4.38772L17.095 4.44971C18.4165 4.53019 19.4702 5.5839 19.5507 6.90534L19.6127 7.92325C19.6482 8.50715 19.8782 9.06236 20.2659 9.50039L20.9419 10.264C21.8194 11.2553 21.8194 12.7455 20.9419 13.7368L20.2659 14.5004C19.8782 14.9384 19.6482 15.4936 19.6127 16.0775L19.5507 17.0954C19.4702 18.4169 18.4165 19.4706 17.095 19.5511L16.0771 19.6131C15.4932 19.6486 14.938 19.8786 14.5 20.2663L13.7364 20.9423C12.7451 21.8198 11.2549 21.8198 10.2636 20.9423L9.49999 20.2663C9.06196 19.8786 8.50676 19.6486 7.92285 19.6131L6.90495 19.5511C5.58351 19.4706 4.52979 18.4169 4.44931 17.0954L4.38732 16.0775C4.35176 15.4936 4.12179 14.9384 3.73405 14.5004L3.05811 13.7368C2.18062 12.7455 2.18062 11.2553 3.05811 10.264L3.73405 9.50039C4.12178 9.06236 4.35176 8.50716 4.38732 7.92325L4.44931 6.90534C4.52979 5.5839 5.58351 4.53019 6.90494 4.44971L7.92285 4.38772C8.50676 4.35215 9.06196 4.12218 9.49999 3.73444L10.2636 3.05851Z" stroke="#28A745"/>
                            <path d="M8.39999 15.6004L15.6 8.40039M8.95389 8.94973L8.93975 8.93544M15.0644 15.1231L15.0503 15.1088" stroke="#28A745" stroke-width="1.5" stroke-linecap="round"/>
                        </svg>
                        <span class="count">{{merchant.posts_count}} Offers</span>
                    </span>
                </div>
            </div>
        </fp-slider>
    </div>
</template>
<script>
import FpSlider from "~/components/ui/FpSlider.vue";
export default {
    name: 'TopBusinesses',
    components: {
        FpSlider,
    },
    data() {
        return {
            merchants: [],
        }
    },
    mounted() {
        this.getTopMerchants();
    },
    methods: {
        async getTopMerchants() {
            const response = await this.axios.get(`${process.env.merchantApiUrl}/merchant/get_top_merchants`);
            if (response.data.status === 'Success') {
                this.merchants = response.data.data;
            }
        }
    },
}
</script>
<style lang="scss" scoped>
    .top-businesses {
        border-radius: 12px;
    }
    .business-item {
        padding: 0 8px;
        .item-wrapper {
            position: relative;
            border-style: solid;
            border-width: 1px;
            border-radius: 12px;
            overflow: hidden;
            .image-container {
                width: 172px;
                height: 150px;
                display: flex;
                align-items: center;
                justify-content: center;
                img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
            }
            .offers-count {
                position: absolute;
                top: 6px;
                left: 6px;
                color: #7C7C7C;
                font-size: 13.6px;
                margin-bottom: 0;
            }
        }
    }
    .btn-promote {
        margin-left: auto;
        border-radius: 16px;
        padding-left: 12px;
        padding-right: 12px;
    }
</style>