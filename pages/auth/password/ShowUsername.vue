<template>
    <div class="row pt-3 pt-md-3 justify-content-center">
        <div class="col-md-6 col-lg-5 d-none d-md-block">
            <login-card />
        </div>
        <div class="col-md-6 col-lg-5">
            <div class="login-container fp-card p-md-4">
                <h4 class="mb-4">Welcome to <span class="fp-text-active">FlickerPage</span></h4>
                <div class="card fp-card p-0 form-wrapper round-10 overflow-hidden">
                    <div class="card-header">
                        <h6 class="mb-0">Forgot username help!</h6>
                    </div>
                    <div class="card-body">
                        <div class="d-flex align-items-center mb-3">
                            <fa icon="check-circle" class="text-success" />
                            <p class="mb-0 ml-2" style="font-weight: 600;">
                                Your username: <span class="text-primary">{{ username }}</span>
                            </p>
                        </div>
                        <div class="d-flex align-items-center mb-3">
                            <fa icon="check-circle" class="text-success" />
                            <p class="mb-0 ml-2" style="font-weight: 500;">
                                Your forgot username has been recovered successfully. Back to login!
                            </p>
                        </div>
                        <div class="text-center">
                            <router-link :to="{name: 'login'}" class="btn fp-btn-gradient px-4">Back to LogIn</router-link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import LoginCard from "../../../components/auth/LoginCard.vue";

    export default {
        name: 'ShowUsername',
        middleware: "guest",
        components: {
            LoginCard,
        },

        data: () => ({
            appName: process.env.appName,
            email: "",
            username: "",
        }),

        head() {
            return { title: "Forgot username" };
        },

        mounted() {
            this.email = this.$route.query.email;
            this.username = this.$route.query.username;
        },
    };
</script>
<style lang="scss" scoped>
    h3 {
        @media (max-width: 600px) {
            font-size: 25px;
        }
    }

    .login-container {
        border-radius: 12px;
        height: 100%;
    }

    .login-btn {
        border-radius: 50px;
        outline: none !important;
    }

    .reset-content {
        border: 1px solid #ebeced;
        border-radius: 10px;
    }
</style>
