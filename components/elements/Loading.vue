<template>
    <div class="fp-loading">
        <img src="@/assets/images/logo_loading.gif" width="100" height="100" alt="">
        <div v-if="percent > 5" class="progress mt-3 mt-md-4">
            <div class="progress-bar bg-success" :style="{width: `${percent}%`}">
                {{ percent }}%
            </div>
        </div>
    </div>
</template>
<script>
import { mapGetters } from "vuex";
export default {
    name: 'Loading',
    computed: mapGetters({
        percent: 'loading_percent',
    }),
    mounted() {
        document.body.style.overflow = 'hidden';
    },
    beforeDestroy() {
        document.body.style.overflow = '';
        this.$store.dispatch('setLoadingPercent', 0);
    }
}
</script>
<style lang="scss" scoped>
    .fp-loading {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        z-index: 100000;
        background: #00000080;
        .progress {
            height: 23px;
            width: 380px;
            text-align: right;
            background: #FFFFFF26;
            border-radius: 6px;
            @media (max-width: 600px) {
                width: 80%;
            }
        }
        @media (max-width: 600px) {
            img {
                width: 64px;
                height: 64px;
            }
            .progress {
                height: 18px;
            }
        }
    }
</style>