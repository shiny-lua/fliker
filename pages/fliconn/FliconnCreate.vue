<template>
    <div class="d-flex justify-content-center">
        <div class="fliconn-form-page mt-3 mt-md-4">
            <router-link :to="{ name: 'index' }" class="font-weight-bold d-none d-md-flex align-items-center">
                <fp-icon name="home" class="fp-fs-24 mt-n-2px" />
                <span class="ml-1">Home</span>
            </router-link>
            <p class="mt-2 d-none d-md-block">
                Please review
                <router-link :to="{ name: 'terms_of_use' }" target="_blank" class="fp-text-active">Terms of use</router-link>
                and
                <router-link :to="{ name: 'privacy_policies' }" target="_blank" class="fp-text-active">Content Policy</router-link>
                before posting.
            </p>
            <div class="fliconn-form-container fp-card d-md-flex">
                <div class="fliconn-types mr-md-3">
                    <h5 class="text-center mb-3">
                        Post on&nbsp;
                        <svg width="24" height="24" viewBox="0 0 19 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M0 13.56h1.618V6.539H0V4.767h1.618V3.63c0-2.451.722-3.63 2.58-3.63 1.575 0 2.495.874 2.647 2.581l-1.73.24c-.154-.765-.327-1.114-.83-1.114-.633 0-.744.612-.744 1.97V4.77h1.772v1.772H3.544v7.02h1.772v1.881H0V13.56Z" fill="url(#a)"/>
                            <path d="M13.726 4.749c2.986 0 5.11 2.124 5.11 5.55 0 3.428-2.124 5.552-5.11 5.552-1.448 0-2.59-.51-3.803-1.593v3.862h2.17V20H6.215v-1.88h1.633V6.54H6.215V4.748h3.64v1.614c1.05-.93 2.217-1.614 3.871-1.614Zm2.918 5.507c0-2.321-1.33-3.67-3.384-3.67-2.028 0-3.337 1.327-3.337 3.67 0 2.322 1.448 3.671 3.337 3.671 2.053 0 3.384-1.349 3.384-3.67Z" fill="url(#b)"/>
                            <defs>
                                <linearGradient id="a" x1="0" y1="7.719" x2="6.847" y2="7.719" gradientUnits="userSpaceOnUse">
                                    <stop stop-color="#FF22A1"/>
                                    <stop offset="1" stop-color="#FFA3D8"/>
                                </linearGradient>
                                <linearGradient id="b" x1="6.214" y1="12.375" x2="18.836" y2="12.375" gradientUnits="userSpaceOnUse">
                                    <stop stop-color="#FF22A1"/>
                                    <stop offset="1" stop-color="#FFA3D8"/>
                                </linearGradient>
                            </defs>
                        </svg>
                    </h5>
                    <div class="types-wrapper">
                        <router-link :to="{name: 'fliconn.create.timeline'}" class="fliconn-type mb-3">
                            <fp-icon name="left_menu_timeline" />
                            Post on Timeline
                        </router-link>
                        <router-link :to="{name: 'fliconn.create.status'}" class="fliconn-type mb-3">
                            <fp-icon name="left_menu_status" />
                            Status Story
                        </router-link>
                        <router-link :to="{name: 'fliconn.create.clips'}" class="fliconn-type mb-3">
                            <fp-icon name="left_menu_flicks" style="font-size: 20px;" />
                            Short Flick
                        </router-link>
                        <router-link :to="{name: 'fliconn.create.poll'}" class="fliconn-type mb-3 mb-md-0">
                            <fp-icon name="left_menu_poll" />
                            Create Poll
                        </router-link>
                    </div>
                </div>
                <div class="router-view align-self-stretch">
                    <router-view />
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import FliconnForm from "~/components/fliconn/timeline/TimelineForm.vue";
    export default {
        name: "FliconnCreate",
        middleware: "auth",
        components: {
            FliconnForm,
        },
        data() {
            return {
                group_id: this.$route.query.group_id,
            };
        },
        computed: {
            routeName() {
                return this.$route.name;
            },
            auth_user() {
                return this.$store.getters["auth/user"];
            },
        }
    };
</script>
<style lang="scss" scoped>
    .fliconn-form-page {
        width: 100%;
        max-width: 780px;
        @media (max-width: 600px) {

        }
    }
    .fliconn-form-container {
        border-radius: 12px;
        @media (max-width: 600px) {
            padding: 0;
            border-radius: 0;
            background-color: inherit;
        }
    }
    .fliconn-types {
        @media (min-width: 601px) {
            width: 140px;
        }
        .types-wrapper {
            display: flex;
            overflow: auto;
            @media (min-width: 601px) {
                flex-direction: column;
            }
        }
        .fliconn-type {
            display: block;
            width: 140px;
            min-width: 140px;
            padding: 16px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            border-radius: 6px;
            color: #64748B;
            font-size: 14px;
            border: solid 1px #ECF1F6;
            text-decoration: none;
            @media (max-width: 600px) {
                background-color: #DCE9FB;
                margin-right: 12px;
                &:last-child {
                    margin-right: 0;
                }
            }
            svg {
                font-size: 24px;
                margin-bottom: 8px;
            }
            &.router-link-active {
                color: #FFF;
                border: none;
                background: linear-gradient(108.58deg, #FF22A1 0%, #FFA3D8 97.86%);

            }
        }
    }
    .router-view {
        @media (min-width: 600px) {
            flex-grow: 1;
            max-width: calc(100% - 159px);
        }
    }
    [data-theme=dark] {
        .fliconn-type {
            background-color: #18243E;
            border: none;
            @media (max-width: 600px) {
                background-color: #00162D;
            }
        }
    }
</style>
