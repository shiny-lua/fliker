<template>
    <div class="notification-item" :class="notification.from_admin && 'admin-notification'">
        <div class="d-flex align-items-center">
            <div class="noti-img">
                <img :src="notiImg" alt="" class="avatar" width="45" height="45" />
                <span v-if="!notification.from_admin" class="online-offline" :class="{online: notification.is_online}"></span>
                <svg v-if="notification.type === 'like'" class="mark-like" width="15" height="15" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 6.00835C1 9.00633 4.21554 12.1771 6.56939 14.0966C7.63498 14.9655 8.16778 15.4 9.00001 15.4C9.83223 15.4 10.365 14.9655 11.4306 14.0966C13.7845 12.1771 17 9.00637 17 6.00832C17 1.27945 12.5999 -0.869891 9 2.99902C5.40013 -0.869891 1 1.2796 1 6.00835Z" fill="#28A745"/>
                    <path d="M6.56939 14.0966L7.04337 13.5153V13.5153L6.56939 14.0966ZM9 2.99902L8.45092 3.50991C8.59281 3.6624 8.79171 3.74902 9 3.74902C9.20829 3.74902 9.40719 3.6624 9.54908 3.50991L9 2.99902ZM11.4306 14.0966L11.9046 14.6778L11.4306 14.0966ZM7.04337 13.5153C5.88773 12.573 4.5429 11.3407 3.4933 9.99554C2.42948 8.63211 1.75 7.25527 1.75 6.00835H0.25C0.25 7.7594 1.17829 9.46695 2.3107 10.9183C3.45733 12.3878 4.8972 13.7007 6.09541 14.6778L7.04337 13.5153ZM1.75 6.00835C1.75 3.86957 2.7329 2.47344 3.93813 1.97202C5.12295 1.47911 6.80283 1.73865 8.45092 3.50991L9.54908 2.48812C7.59729 0.390472 5.27718 -0.20969 3.36196 0.587096C1.46717 1.37539 0.25 3.41837 0.25 6.00835H1.75ZM11.9046 14.6778C13.1028 13.7008 14.5427 12.3879 15.6893 10.9183C16.8217 9.46696 17.75 7.75941 17.75 6.00832H16.25C16.25 7.25529 15.5705 8.63214 14.5067 9.99557C13.4571 11.3408 12.1123 12.573 10.9566 13.5153L11.9046 14.6778ZM17.75 6.00832C17.75 3.41829 16.5328 1.3753 14.638 0.587034C12.7228 -0.209727 10.4027 0.39048 8.45092 2.48812L9.54908 3.50991C11.1972 1.73864 12.8771 1.47907 14.0619 1.97197C15.2671 2.47336 16.25 3.86948 16.25 6.00832H17.75ZM6.09541 14.6778C7.09996 15.497 7.84904 16.15 9 16.15L9.00001 14.65C8.48651 14.65 8.17 14.4341 7.04337 13.5153L6.09541 14.6778ZM10.9566 13.5153C9.83001 14.4341 9.5135 14.65 9.00001 14.65L9 16.15C10.151 16.15 10.9 15.497 11.9046 14.6778L10.9566 13.5153Z" fill="white"/>
                </svg>
            </div>
            <div class="noti-info ml-2">
                <p class="mb-0 content" v-html="notiContent"></p>
                <p class="mb-0 diff_time">{{ notification.diff_time  }}</p>
            </div></div>
        <div class="notification-extra">
            <div v-if="notification.type === 'follow_request' && !notification.notifier.is_follower && !notification.is_read" class="mt-2">
                <a href="javascript:;" class="btn btn-outline-danger" @click.stop="declineFollowRequest()">Decline</a>
                <a href="javascript:;" class="btn btn-success ml-2" @click.stop="acceptFollowRequest()">Accept</a>
            </div>
            <p v-if="notification.description" class="description mt-2">{{ notification.description }}</p>
        </div>
    </div>
</template>
<script>
export default {
    name: 'NotificationItem',
    props: {
        notification: { type: Object, required: true },
    },
    computed: {
        notiImg() {
            if (this.notification.from_admin) {
                return require('@/assets/images/logo.png');
            } else {
                return this.notification.notifier.photo_url;
            }
        },
        notiUsername() {
            return this.notification.notifier.username;
        },
        notiContent() {
            const userLink = `<a href="/fliconn/profile/${this.notiUsername}" target="_blank" class="text-primary">@${this.notiUsername}</a>`;
            return this.notification.content.replace('{username}', userLink);
        }
    },
    methods: {
        acceptFollowRequest() {
            this.axios.post(`/user/follow_requests/accept`, { id: this.notification.notifier_id }).then(response => {
                if (response.data.status == "Success") {
                    this.notification.notifier.is_follower = true;
                    this.$store.dispatch('fetchNotifications');
                    this.$store.dispatch("auth/fetchUser");
                    this.read();
                }
            }).catch(function (error) {
                this.$toast.error('Something went wrong');
            });
        },
        declineFollowRequest() {
            this.axios.post(`/user/follow_requests/delete`, { user_id: this.notification.notifier_id, type: 'received' }).then(response => {
                if (response.data.status == "Success") {
                    this.read();
                }
            }).catch(function (error) {
                this.$toast.error('Something went wrong');
            });
        },
        async read() {
            const response = await this.axios.post(`/notification/read_one`, {id: this.notification.id});
            if (response.data.status == "Success") {
                this.notification.is_read = true;
            }
        }
    }
}
</script>
<style lang="scss" scoped>
    .notification-item {
        font-weight: 400;
        padding: 12px 0;
        .noti-img {
            position: relative;
            .avatar {
                border-radius: 100%;
                object-fit: cover;
            }
            .online-offline {
                position: absolute;
                top: 4px;
                right: -3px;
            }
            .mark-like {
                position: absolute;
                bottom: 1px;
                right: -4px;
            }
        }
        .content {
            font-size: 14.4px;
            &::v-deep {
                a {
                    font-weight: 500;
                }
            }
        }
        .diff_time {
            color: #64748B;
            font-size: 13px;
        }
        .notification-extra {
            margin-left: 54px;
            .btn {
                font-size: 14.4px;
            }
            .description {
                font-size: 13.6px;
                background: #F8F8F8;
                color: #464646;
                padding: 8px 12px;
                border-radius: 6px;
                margin-bottom: 0;
            }
        }
        &.admin-notification {
            .noti-img {
                .avatar {
                    border-radius: 0;
                    object-fit: contain;
                }
            }
        }
    }
    [data-theme=dark] {
        .notification-extra {
            .description {
                background: #18243E;
                color: #FFF;
            }
        }
    }
</style>