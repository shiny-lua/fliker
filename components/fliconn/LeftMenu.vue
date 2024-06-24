<template>
    <div class="left-fliconn-menu">
        <a href="javascript:;" class="menu-item" :class="{ active: tab === 'timeline' }" @click="changeTab('timeline')" title="Timeline">
            <span class="menu-image">
                <fp-icon name="left_menu_timeline" />
            </span>
            Timeline
        </a>
        <a href="javascript:;" class="menu-item" :class="{ active: tab === 'clips' }" @click="changeTab('clips')" title="Short Flicks">
            <span class="menu-image">
                <fp-icon name="left_menu_flicks" style="width: 26px;" />
            </span>
            Flicks
        </a>
        <a href="javascript:;" class="menu-item" :class="{ active: tab === 'merchant' }" @click="changeTab('merchant')" title="Coupons/Offers">
            <span class="menu-image">
                <fp-icon name="left_menu_coupon_offers" />
            </span>
            Coupons/Offers
        </a>
        <a href="javascript:;" class="menu-item" :class="{ active: tab === 'connections' }" @click="changeTab('connections')" title="People">
            <span class="menu-image">
                <fp-icon name="left_menu_people" />
            </span>
            Find People
            <sup v-if="auth_user && auth_user.received_follow_requests_count"
                class="badge badge-pill badge-danger align-self-start"
                style="line-height: 11px;"
            >
                {{ auth_user.received_follow_requests_count }}
            </sup>
        </a>
        <a href="javascript:;" class="menu-item" :class="{ active: tab === 'channel' }" @click="changeTab('channel')" title="Channels">
            <span class="menu-image">
                <fp-icon name="left_menu_channels" />
            </span>
            Channels
        </a>
        <a href="javascript:;" class="menu-item" :class="{ active: tab === 'group' }" @click="changeTab('group')" title="Groups">
            <span class="menu-image">
                <fp-icon name="left_menu_groups" />
            </span>
            Groups
        </a>
        <a href="javascript:;" class="menu-item" :class="{ active: tab === 'page' }" @click="changeTab('page')" title="Pages">
            <span class="menu-image">
                <fp-icon name="left_menu_pages" />
            </span>
            Pages
        </a>
        <a href="javascript:;" class="menu-item" :class="{ active: tab === 'discover' }" @click="changeTab('discover')" title="Discover">
            <span class="menu-image">
                <fp-icon name="left_menu_discover" />
            </span>
            Around Me
        </a>
        <a href="javascript:;" class="menu-item" :class="{ active: tab === 'bookmark' }" @click="changeTab('bookmark')" title="Favourite">
            <span class="menu-image">
                <fp-icon name="left_menu_favorite" class="fp-fs-22" />
            </span>
            Favourite
        </a>
    </div>
</template>
<script>
export default {
    name: 'FliconnLeftMenu',
    props: {
        tab: { type: String, default: 'timeline' },
        mode: { type: String, default: '' },
    },
    computed: {
        auth_user() {
            return this.$store.getters['auth/user'];
        }
    },
    methods: {
        changeTab(tab) {
            this.$emit('change', tab);
        },
    }
}
</script>
<style lang="scss" scoped>
    .left-fliconn-menu {
        .menu-item {
            display: flex;
            position: relative;
            padding: 8px 12px;
            border-radius: 0 10px 10px 0;
            text-decoration: none;
            font-size: 16px;
            &::before {
                background-color: #FF22A1;
            }
            .menu-image {
                display: inline-flex;
                width: 34px;
                text-align: center;
                font-size: 24px;
            }
            &.active {
                &::before {
                    content: "";
                    position: absolute;
                    display: block;
                    width: 3px;
                    height: 30px;
                    border-radius: 0 5px 5px 0;
                    top: 5px;
                    left: 0;
                }
            }
            .message-count {
                position: absolute;
                font-size: 13px;
                padding: 2px 5px;
                top: -3px;
                right: -15px;
            }
        }
    }
    [data-theme=dark] {
        .left-fliconn-menu {
            .menu-item {
                color: #FFF;
                &.active {
                    background-color: #18243E;
                }
            }
        }
    }
</style>