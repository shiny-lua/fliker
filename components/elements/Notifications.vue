<template>
    <div class="notifications fp-text-color">
        <h5 class="mb-3 d-flex align-items-center">
            Notifications
            <a href="javascript:;" class="btn-read-all ml-auto" @click.stop="readAll()">
                <fp-icon name="read" class="fp-fs-20" />
                Mark all as read
            </a>
        </h5>
        <div class="filter">
            <nav class="navbar navbar-expand notification-filter">
                <ul class="navbar-nav">
                    <li class="nav-item">
                        <a href="javascript:;"
                             class="nav-link"
                             :class="{active: filter.is_read == 'all'}"
                             @click.stop="filter.is_read = 'all'"
                        >
                            All
                            <span v-if="unreads" class="unreads">{{ unreads }}</span>
                        </a>
                    </li>
                    <li class="nav-item">
                        <a href="javascript:;" class="nav-link" :class="{active: filter.is_read == 1}" @click.stop="filter.is_read = 1">Read</a>
                    </li>
                    <li class="nav-item">
                        <a href="javascript:;" class="nav-link" :class="{active: filter.is_read == 0}" @click.stop="filter.is_read = 0">Unread</a>
                    </li>
                </ul>
            </nav>
        </div>
        <div class="mt-2 px-1">
            <div v-if="notifications.length === 0 && !loading" class="text-center">No notifications available</div>
            <notification-item v-for="(item, index) in notifications"
                    :key="index"
                    :notification="item"
                    class="fp-border-color-1"
            />
        </div>

        <infinite-loading :distance="100"
            :identifier="infiniteId"
            @infinite="search"
        >
            <div slot="no-more"></div>
            <div class="text-center" slot="no-results"></div>
            <div slot="spinner" class="pt-3 pt-md-4">
                <img src="~assets/images/logo_loading.gif" width="50" alt="" />
            </div>
        </infinite-loading>
    </div>
</template>
<script>
import {mapGetters} from "vuex"
import Swal from 'sweetalert2'
import NotificationItem from './NotificationItem.vue'
export default {
    name: 'Notifications',
    props: {
        mode: { type: String, default: 'page' },
    },
    components: {
        NotificationItem,
    },
    data() {
        return {
            notifications: [],
            selected: [],
            filter: {
                user_id: '',
                is_read: 'all',
                page: 1,
                per_page: this.mode === 'page' ? 12 : 3,
            },
            page_count: 0,
            total: 0,
            infiniteId: +new Date(),
            loading: false,
        };
    },
    watch: {
        'filter.is_read': function(newVal) {
            this.searchNotifications();
        },
        'unreads': function(newVal) {
            this.filter.is_read = 'all';
            this.searchNotifications();
        }
    },
    computed: mapGetters({
        auth_user: 'auth/user',
        unreads: 'unread_notifications',
    }),
    mounted() {
        this.filter.user_id = this.auth_user.id;
        if (this.mode === 'top') {
            this.search();
        }
        this.$fire.database.ref('notifications/' + this.auth_user.id).remove();
    },
    methods: {
        async searchNotifications() {
            this.notifications = [];
            await this.$nextTick();
            this.filter.page = 1;
            this.infiniteId++;
        },
        async search($state) {
            this.loading = true;
            try {
                const response = await this.axios.post(`/notification/get_all`, this.filter);
                if (response.data.status == "Success") {
                    let result = response.data.data;
                    if (result.current_page === 1) this.notifications = [];
                    if (this.mode === 'top' && !!$state) $state.complete();
                    if (result.data.length) {
                        this.filter.page++;
                        this.notifications.push(...result.data);
                        this.total = result.total;
                        $state.loaded();
                    } else {
                        $state.complete();
                    }
                }
            } catch (error) { }
            this.loading = false;
        },
        readAll() {
            this.axios.post(`/notification/read_all`).then(response => {
                this.$store.dispatch('fetchNotifications');
            });
        },
        remove(item, index) {
            Swal.fire({
                title: 'Are you sure?',
                icon: "warning",
                showCancelButton: true,
            }).then((willDelete) => {
                if (willDelete.isConfirmed) {
                    let params = {
                        selected: this.selected,
                    }
                    this.axios.post(`/notification/delete_all`, params).then (response =>{
                        if (response.data.status == 'Success') {
                            this.$toast.success('Deleted successfully!');
                            this.selected.map(i => {
                                let index = this.notifications.findIndex(n => n.id == i);
                                if (index) this.posts.splice(index, 1);
                            });
                        }
                    }).catch(function (error) {
                        console.log(error);
                    });
                }
            });
        },
    }
}
</script>
<style lang="scss" scoped>
    .notification-filter {
        padding: 4px 16px;
        font-size: 14.4px;
        box-shadow: none;
        border-radius: 8px;
        background-color: #F0F3F9;
        .nav-link {
            margin: 0 30px 0 0;
            color: #64748B;
            &.active {
                color: #FF22A1 !important;
                font-weight: 500;
            }
            .unreads {
                color: #FF22A1;
                background: #FF22A11A;
                padding: 0 3px 1px;
                border-radius: 2px;
                font-size: 12px;
            }
        }
    }
    .btn-read {
        font-weight: bold;
    }
    .btn-read-all {
        color: #FF22A1;
        font-size: 14.4px;
    }
    .notification-item {
        border-bottom-style: solid;
        border-bottom-width: 1px;
        &:last-child {
            border-bottom: none;
        }
        .content {
            &.expanded {
                white-space: pre-line;
                word-break: break-word;
                &:first-line { line-height: 0; }
            }
        }
        .diff_time {
            color: #757575;
        }
        .sender-image {
            border-radius: 100%;
            &.admin-image {
                border-radius: 0;
                padding: 0px 2px;
            }
        }
    }
    [data-theme=dark] {
        .notification-filter {
            background-color: #18243E;
            .nav-link {
                color: #FFF;
            }
        }
    }
</style>