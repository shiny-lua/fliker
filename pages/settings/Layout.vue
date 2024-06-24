<template>
    <div class="page-settings pt-2 pt-md-4">
        <h5 class="fp-text-color">Settings</h5>
        <div class="row">
            <div class="col-md-4 mb-3">
                <div class="settings-menu fp-card fp-sm-no-card">
                    <ul class="nav nav-pills flex-md-column">
                        <li class="nav-item fp-border-color-1">
                            <a href="javascript:;" @click.prevent="$router.push({name: 'settings.basic_information'})"
                                 class="nav-link"
                                 :class="{'router-link-exact-active': ['settings.basic_information', 'settings.change_password', 'settings.deactivate'].includes(routeName)}"
                            >
                                <fp-icon name="user" />
                                Account
                            </a>
                            <ul class="nav-sub d-none d-md-block">
                                <li class="nav-item">
                                    <router-link :to="{name: 'settings.basic_information'}" class="nav-link">Basic Information</router-link>
                                </li>
                                <li class="nav-item">
                                    <router-link :to="{name: 'settings.change_password'}" class="nav-link">Change Password</router-link>
                                </li>
                                <li class="nav-item">
                                    <router-link :to="{name: 'settings.deactivate'}" class="nav-link">Deactivate</router-link>
                                </li>
                            </ul>
                        </li>
                        <li class="nav-item fp-border-color-1">
                            <router-link :to="{name: 'settings.profile_access'}" class="nav-link">
                                <fp-icon name="user_banned" />
                                Profile &amp; Access
                            </router-link>
                        </li>
                        <li class="nav-item fp-border-color-1">
                            <router-link :to="{name: 'settings.classified_ads'}" class="nav-link">
                                <fp-icon name="ads" class="fp-fs-26" />
                                Classified Ads
                            </router-link>
                        </li>
                        <li class="nav-item fp-border-color-1">
                            <router-link :to="{name: 'settings.communication'}" class="nav-link">
                                <fp-icon name="communication" />
                                Communication &amp; Notifications
                            </router-link>
                        </li>
                    </ul>

                    <ul v-if="['settings.basic_information', 'settings.change_password', 'settings.deactivate'].includes(routeName)" class="nav-sub mobile-sub-menu fp-border-color-1 d-md-none">
                        <li class="nav-item">
                            <router-link :to="{name: 'settings.basic_information'}" class="nav-link fp-text-color-main">Basic Information</router-link>
                        </li>
                        <li class="nav-item">
                            <router-link :to="{name: 'settings.change_password'}" class="nav-link fp-text-color-main">Change Password</router-link>
                        </li>
                        <li class="nav-item">
                            <router-link :to="{name: 'settings.deactivate'}" class="nav-link fp-text-color-main">Deactivate</router-link>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="col-md-8 mb-3">
                <div class="settings-panel">
                    <router-view></router-view>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'Settings',
    middleware: 'auth',
    computed: {
        routeName() {
            return this.$route.name;
        }
    }
}
</script>
<style lang="scss" scoped>
    .settings-menu {
        align-self: flex-start;
        @media (max-width: 600px) {
            .nav {
                flex-wrap: nowrap;
                overflow: auto;
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
                            color: #FFF;
                            border: none;
                            padding: 7px 13px;
                            font-weight: 400;
                            .fp-svg-fill-3 {
                                fill: #FFF;
                            }
                            .fp-svg-stroke-3 {
                                stroke: #FFF;
                            }
                        }
                    }
                }
            }
            .nav-sub.mobile-sub-menu {
                display: flex;
                justify-content: space-between;
                border-bottom-style: solid;
                border-bottom-width: 3px;
                padding-left: 0;
                .nav-item {
                    .nav-link {
                        padding: 0;
                        border-bottom-style: solid;
                        border-bottom-width: 3px;
                        border-bottom-color: transparent;
                        border-radius: 0 !important;
                        padding-bottom: 8px;
                        margin-bottom: -9px;
                        &.router-link-exact-active {
                            border-bottom-color: #FF22A1;
                        }
                    }
                }
            }
        }
        .nav-item {
            border-bottom-style: solid;
            border-bottom-width: 1px;
            padding-top: 6px;
            padding-bottom: 6px;
            &:last-child {
                border-bottom: none;
            }
            .nav-link {
                color: #64748B;
                padding: 6px 0;
                white-space: nowrap;
                img {
                    width: 26px;
                    height: 26px;
                    margin-right: 8px;
                }
                svg {
                    width: 22px;
                    height: 22px;
                    margin-right: 8px;
                }
                &.router-link-exact-active {
                    color: #FF22A1;
                }
            }
        }
        .nav-sub {
            list-style: none;
            padding-left: 22px;
            .nav-item {
                border-bottom: none;
                .nav-link {
                    padding: 6px 12px;
                    &.router-link-active {
                        color: #FF22A1;
                        border-radius: 6px;
                        font-weight: 400;
                        background-color: #F0F3F9;
                    }
                }
                &:last-child {
                    border-bottom: none;
                }
            }
            &:last-child {
                margin-bottom: 8px;
            }
        }
    }
    .page-settings {
        margin-bottom: 100px;
    }

    [data-theme=dark] {
        .settings-menu {
            .nav-sub {
                .nav-link {
                    &.router-link-exact-active {
                        background-color: #18243E;
                    }
                }
            }
        }

    }
</style>