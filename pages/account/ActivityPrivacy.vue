<template>
    <div class="col-12 px-lg-0">
        <div class="d-md-flex align-items-start mb-5 content">
            <nav class="fp-card fp-sm-no-card menu-activity py-md-3">
                <ul class="nav nav-pills flex-md-column">
                    <li class="nav-item fp-border-color-1">
                        <router-link :to="{ name: 'account.activity_privacy.login_activity' }"
                                     class="nav-link fp-text-color-main">
                            <fp-icon name="data_policy" />
                            Login Activity
                        </router-link>
                    </li>
                    <li class="nav-item fp-border-color-1">
                        <router-link :to="{ name: 'account.activity_privacy.privacy_center' }"
                                     class="nav-link fp-text-color-main">
                            <fp-icon name="privacy_policy" />
                            Privacy Center
                        </router-link>
                    </li>
                </ul>
            </nav>
            <div class="fp-card fp-sm-no-card page-activity py-md-4">
                <router-view></router-view>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'ActivityPrivacy',
    middleware: 'auth',
    data() {
        return {

        }
    }
}
</script>
<style lang="scss" scoped>
.menu-activity {
    width: 320px;

    @media (max-width: 768px) {
        width: 100%;
    }

    @media (max-width: 600px) {
        margin-bottom: 8px;

        .nav {
            display: flex;
            flex-direction: columns;
            .nav-item {
                margin-bottom: 8px;
                border-bottom: none;

                .nav-link {
                    padding: 6px 12px;
                    border-radius: 5px;
                    border-style: solid;
                    border-width: 1px;
                    margin-right: 12px;

                    svg {
                        margin-right: 0;
                    }

                    &.router-link-exact-active {
                        background: linear-gradient(100.05deg, #FF22A1 2.3%, #FFA3D8 100%);
                        color: #FFF !important;
                        border: none;
                        padding: 7px 13px;
                        font-weight: 400;
                    }
                }
            }

            @media (min-width: 767px) {
                flex-direction: row;
                width: 100%;
            }
        }
    }

    .nav-item {
        border-bottom-style: solid;
        border-bottom-width: 1px;

        &:last-child {
            border-bottom: none;
        }

        .nav-link {
            padding-top: 8px;
            padding-bottom: 8px;

            svg {
                font-size: 22px;
                margin-right: 8px;
            }

            &.router-link-exact-active {
                color: #FF22A1 !important;
            }
        }

        @media (max-width: 767px) {
            border: none;   
        }
    }
}

.page-activity {
    flex-grow: 1;
    margin-left: 16px;

    @media (max-width: 767px) {
        margin: 16px 0px;
    }

}</style>