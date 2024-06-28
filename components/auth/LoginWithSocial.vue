<template>
    <div>
        <button type="button" class="btn google fp-border-color-1 fp-text-color" @click="login('google')">
            <img src="~/assets/images/icons/google.png" width="18" height="18" alt="" />
            <span class="d-none d-md-inline">Gmail</span>
        </button>
        <button type="button" class="btn ml-1 facebook fp-border-color-1 fp-text-color" @click="login('facebook')">
            <img src="~/assets/images/icons/facebook.png" width="18" height="18" alt="" />
            <span class="d-none d-md-inline">Facebook</span>
        </button>
        <button type="button" class="btn ml-1 linkedin fp-border-color-1 fp-text-color" @click="login('linkedin')">
            <img src="~/assets/images/icons/linkedin.png" width="18" height="18" alt="" />
            <span class="d-none d-md-inline">LinkedIn</span>
        </button>
    </div>
</template>

<script>
    export default {
        name: "LoginWithSocial",
        data() {
            return {
                provider: "",
            };
        },

        computed: {
            url: () => `/oauth/${this.provider}`,
        },

        mounted() {
            window.addEventListener("message", this.onMessage, false);
        },

        beforeDestroy() {
            window.removeEventListener("message", this.onMessage);
        },

        methods: {
            async login(provider) {
                this.provider = provider;
                const newWindow = openWindow("", "Login");

                const url = await this.$store.dispatch("auth/fetchOauthUrl", {
                    provider: this.provider,
                });

                newWindow.location.href = url;
            },

            /**
             * @param {MessageEvent} e
             */
            onMessage(e) {
                if (!process.env.authApiUrl.includes(e.origin)) {
                    // throw new Error("Origin not matching");
                    return;
                }

                console.log(e.data);
                if (e.data.token) {
                    this.$store
                        .dispatch("auth/saveToken", {
                            token: e.data.token,
                        })
                        .then(() => {
                            this.$store.dispatch("auth/fetchUser").then(() => {
                                // if (
                                //   this.$store.getters["auth/user"].gender ||
                                //   this.$store.getters["auth/user"].date_of_birth
                                // ) {
                                this.$router.push({ path: "/" });
                                // } else {
                                //   this.$router.push({ path: "/social_login" });
                                // }
                            });
                        });
                } else if (e.data.email) {
                    this.$router.push({ path: "/social_login", query: { email: e.data.email, name: e.data.name } });
                }
            },
        },
    };

    /**
     * @param  {Object} options
     * @return {Window}
     */
    function openWindow(url, title, options = {}) {
        if (typeof url === "object") {
            options = url;
            url = "";
        }

        options = { url, title, width: 600, height: 720, ...options };

        const dualScreenLeft = window.screenLeft !== undefined ? window.screenLeft : window.screen.left;
        const dualScreenTop = window.screenTop !== undefined ? window.screenTop : window.screen.top;
        const width = window.innerWidth || document.documentElement.clientWidth || window.screen.width;
        const height = window.innerHeight || document.documentElement.clientHeight || window.screen.height;

        options.left = width / 2 - options.width / 2 + dualScreenLeft;
        options.top = height / 2 - options.height / 2 + dualScreenTop;

        const optionsStr = Object.keys(options)
            .reduce((acc, key) => {
                acc.push(`${key}=${options[key]}`);
                return acc;
            }, [])
            .join(",");

        const newWindow = window.open(url, title, optionsStr);

        if (window.focus) {
            newWindow.focus();
        }

        return newWindow;
    }
</script>
<style lang="scss" scoped>
    button {
        font-size: 13.2px;
        font-weight: 400;
        padding: 6px 8px;
        border-radius: 6px;
    }
</style>
