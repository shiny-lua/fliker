<template>
    <div class="fliconn-user-item fp-card">
        <img :src="user.photo_url" class="img-profile" alt="" @click="openProfile()" />
        <div class="ml-2 fliconn-user-detail">
            <p class="mb-0 name" @click="openProfile()">{{user.name}}</p>
            <p class="mb-0 username" @click="openProfile()">@{{user.username}}</p>
            <p v-if="user.location" class="mb-1 address">
                <fp-icon name="location" class="fp-fs-16 fp-text-color-main mt-n-2px" />
                {{user.location.display_address}}
            </p>
            <div class="mt-auto mb-0 user-posts-followers d-flex">
                <span class="ml-1">{{$nFormatter(user.followers_count)}} Follower{{ user.followers_count > 1 ? 's' : ''}}</span>
                <div v-if="auth_user" class="ml-auto d-flex">
                    <div v-if="type == 'request_received' || type == 'request_sent'">
                        <a
                            href="javascript:;"
                            class="btn btn-sm btn-outline-danger px-1 px-md-3"
                            @click.prevent="removeFollowRequest(type === 'request_received' ? 'received' : 'sent')"
                            >{{type === 'request_received' ? 'Decline' : 'Cancel request'}}</a
                        >
                        <a v-if="type === 'request_received'"
                            href="javascript:;"
                            class="btn btn-sm btn-success ml-2 px-1 px-md-3"
                            @click.prevent="acceptFollowRequest()"
                            >Accept</a
                        >
                    </div>
                    <template v-else>
                        <a v-if="user.is_requested_follow" href="javascript:;" class="btn btn-sm btn-outline-danger px-1 px-md-3">
                            <span class="text-normal">Request sent</span>
                            <span class="text-hover">Cancel request</span>
                        </a>
                        <a v-else-if="user.is_following" href="javascript:;" class="btn btn-sm fp-btn-outline px-1 px-md-3" @click="unfollow()">
                            <span class="text-normal">Following</span>
                            <span class="text-hover">Unfollow</span>
                        </a>
                        <a v-else href="javascript:;" class="btn btn-sm fp-btn-outline px-1 px-md-3" @click="follow()">Follow</a>
                    </template>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import Swal from "sweetalert2";
export default {
    name: 'FliconnUserItem',
    props: {
        user: { type: Object, required: true },
        type: { type: String, required: false },
    },
    computed: {
        auth_user() {
            return this.$store.getters["auth/user"];
        },
    },
    methods: {
        openProfile() {
            this.$router.push({name: 'fliconn.profile', params: {username: this.user.username}});
        },
        async follow() {
            const data = await this.$store.dispatch("requestFollow", this.user.id);
            if (data.status === "Success") {
                this.$toast.success(data.message);
                this.user.is_requested_follow = true;
                let notiFb = this.$fire.database.ref("notifications/" + this.user.id).push();
                notiFb.set({ notifier_id: this.auth_user.id, type: "follow_request" });
            }
        },
        async unfollow() {
            const response = await this.axios.post(`/user/unfollow`, {
                user_id: this.user.id,
                follower_id: this.auth_user.id,
            });
            if (response.data.status === "Success") {
                this.$toast.success("Unfollowed successfully!");
                this.user.is_following = false;
            }
        },
        removeFollowRequest(type) {
            Swal.fire({
                title: "Are you sure?",
                icon: "warning",
                showCancelButton: true,
            }).then((willDelete) => {
                if (willDelete.isConfirmed) {
                    this.axios
                        .post(`/user/follow_requests/delete`, {
                            user_id: this.user.id,
                            type: type,
                        })
                        .then((response) => {
                            if (response.data.status == "Success") {
                                this.$emit('request-deleted', this.user.id);
                                this.$store.dispatch("auth/fetchUser");
                            }
                        })
                        .catch(function (error) {
                            console.log(error);
                        });
                }
            });
        },
        acceptFollowRequest() {
            this.axios
                .post(`/user/follow_requests/accept`, { id: this.user.id })
                .then((response) => {
                    if (response.data.status == "Success") {
                        this.$emit('request-accepted', this.user.id);
                        this.$store.dispatch("auth/fetchUser");
                        let notiFb = this.$fire.database.ref("notifications/" + this.user.id).push();
                        notiFb.set({ notifier_id: this.auth_user.id, type: "accept_follow_request" });
                    }
                })
                .catch(function (error) {
                    console.log(error);
                });
        },
    }
}
</script>
<style lang="scss" scoped>
    .fliconn-user-item {
        border-radius: 10px;
        padding: 10px;
        cursor: pointer;
        margin-bottom: 12px;
        display: flex;
        font-weight: 400;
        .fliconn-user-detail {
            display: flex;
            flex-direction: column;
            flex-grow: 1;
        }
        .img-profile {
            width: 90px;
            height: 90px;
            border-radius: 8px;
            object-fit: cover;
        }
        .name {
            font-size: 15px;
            font-weight: 500;
            line-height: 15px;
        }
        .username {
            color: #64748B;
            font-size: 13px;
        }
        .address {
            color: #64748B;
            font-size: 14px;
            margin-top: 2px;
        }
        .user-posts-followers {
            font-weight: 500;
            font-size: 13px;
            display: flex;
            align-items: center;
            img {
                object-fit: cover;
                border-radius: 100%;
                margin-left: -13px;
                border: solid 1px #FFF;
                &:first-child {
                    margin-left: 0;
                }
            }
        }
        .btn {
            .text-hover {
                display: none;
            }
            &:hover {
                .text-hover {
                    display: inline;
                }
                .text-normal {
                    display: none;
                }
            }
            @media (max-width: 600px) {
                font-size: 12px;
                white-space: nowrap;
            }
    }
        }
</style>