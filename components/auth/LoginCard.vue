<template>
    <div class="login-card p-4">
        <div class="title">
            <h4 class="mt-3 mb-2 fp-text-color">Start your journey</h4>
            <h4 class="fp-text-color mb-3 text-center">with <span style="color: #FF22A1">FlickerPage</span></h4>
        </div>
        <div class="d-flex">
            <div>
                <div class="mb-4 slugs fp-text-color-main">
                    <span v-for="slug in slugs" :key="slug" class="pr-2">#{{ slug }}</span>
                </div>
                <div class="d-flex flex-wrap mb-2">
                    <div class="icon-panel mr-3 mb-3">
                        <img :src="require(`~/assets/images/icons/login_card/ads.png`)" width="28" height="28" />
                    </div>
                    <div class="icon-panel mr-3 mb-3">
                        <img :src="require(`~/assets/images/icons/login_card/timeline.png`)" width="28" height="27" />
                    </div>
                    <div class="icon-panel mr-3 mb-3">
                        <img :src="require(`~/assets/images/icons/login_card/clips.png`)" width="28" height="17" />
                    </div>
                    <div class="icon-panel mr-3 mb-3">
                        <img :src="require(`~/assets/images/icons/login_card/status.png`)" width="28" height="28" />
                    </div>
                    <div class="icon-panel mr-3 mb-3">
                        <img :src="require(`~/assets/images/icons/login_card/automotive.png`)" width="28" height="28" />
                    </div>
                    <div class="icon-panel mr-3 mb-3">
                        <img :src="require(`~/assets/images/icons/login_card/topics.png`)" width="28" height="28" />
                    </div>
                </div>
            </div>
            <div v-if="loaded">
                <img class="visible-light" src="~/assets/images/login-banner.png" width="170" height="245" alt="" />
                <img class="visible-dark" src="~/assets/images/login-banner-dark.png" width="170" height="245" alt="" />
            </div>
        </div>
        <div class="d-flex fp-text-color-main">
            <p class="mb-0" style="white-space: pre-line;">North America, Mexico, EU, Asia, Australia, and World Wide.</p>
        </div>
    </div>
</template>
<script>
    const loadImage = url => {
        return new Promise(resolve => {
            const img = new Image();
            img.onload = resolve;
            img.onerror = resolve;
            img.src = url;
        });
    };
    export default {
        name: "login-card",
        data() {
            return {
                slugs: ["Timeline", "Posts", "People", "Follow", "Comment", "Like", "Clips", "Status", "Facts", "Groups", "Pages", "Local Ads", "Automotives", "Questions", "Social Topics", "Channels", "Polls", "Coupons & Offers"],
                loaded: false,
            };
        },
        async mounted() {
            await loadImage(require('~/assets/images/login-banner.png'));
            await loadImage(require('~/assets/images/login-banner-dark.png'));
            this.loaded = true;
        },
    };
</script>
<style lang="scss" scoped>
    .slugs {
        font-size: 14.4px;
        line-height: 1.4;
        display: flex;
        flex-wrap: wrap;
    }

    .icon-panel {
        width: 50px;
        height: 50px;
        border: solid 1px #FF22A1;
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        img {
            width: 28px;
        }
    }
</style>
