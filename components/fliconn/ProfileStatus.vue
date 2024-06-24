<template>
    <div>
        <div v-if="auth_user && auth_user.id === user.id" class="lock-icon">
            <a href="javascript:;"
                 class="profile-selector btn-lock"
                 @click.prevent="$refs.profileStatusModal.open()"
                 :title="visible_status.title"
            >
                <span class="status-icon">
                    <fp-icon :name="visible_status.icon" :style="{color: visible_status.color}" class="fp-fs-22" />
                </span>
                <span v-if="page === 'settings'" class="status-label ml-1">{{ visible_status.label }}</span>
            </a>

            <user-select-modal ref="userSelectModal"
                 :users="users"
                 v-model="form.visible_users"
                 :show-save-button="true"
                 @save="saveProfileVisibleUsers"
                 title="Who can see my profile?"
                 :showOnlyMe="true"
            ></user-select-modal>
            <fp-modal name="profileStatusModal"
                ref="profileStatusModal"
                title="Who can see my profile"
            >
                <div>
                    <div v-for="item in statuses"
                                :key="item.value"
                                href="javascript:;"
                                class="profile-status-item fp-border-color-1"
                                :class="form.status === item.value && 'active'"
                                @click.prevent="changeStatus(item.value)"
                    >
                        <span class="profile-status-icon">
                            <fp-icon :name="item.icon" :style="{color: item.color}" class="fp-fs-22" />
                        </span>
                        <div class="status-information">
                            <label>{{ item.label }}</label>
                            <p class="description fp-text-color-main">{{ item.description }}</p>
                        </div>
                    </div>
                </div>
            </fp-modal>
        </div>
        <div v-else>
            <span class="profile-status-icon">
                <fp-icon :name="visible_status.icon" :style="{color: visible_status.color}" class="fp-fs-22" />
            </span>
        </div>
    </div>
</template>
<script>
    import Form from "vform";
    import Multiselect from "vue-multiselect";
    import "vue-multiselect/dist/vue-multiselect.min.css";
    import UserSelectModal from "../ui/UserSelectModal.vue";
    import FpModal from "../ui/Modal.vue";
    export default {
        name: "ProfileStatus",
        props: {
            user: { type: Object, required: true },
            page: { type: String, default: "profile" },
        },
        components: {
            Multiselect,
            UserSelectModal,
            FpModal,
        },
        data() {
            return {
                users: [],
                form: new Form({
                    user_id: this.user.id,
                    visible_users: [],
                    status: "public",
                }),
                statuses: [
                    {
                        label: "Public",
                        value: "public",
                        description: "Your profile is visible to everyone publicly.",
                        icon: `globe`,
                        color: '#28A245',
                        icon_bg: '#FFF8DD',
                        title: 'Public Profile',
                    },
                    {
                        label: "Followers",
                        value: "followers",
                        icon: `user-check`,
                        color: '#007BFF',
                        description: "Only your followers can see yor profile. Once you accept the 'follow' request, people can see your profile.",
                    },
                    {
                        label: "Mutual Followers",
                        value: "mutual_followers",
                        icon: `users-check`,
                        color: '#FFC107',
                        description: "Only mutual followers can see your profile. You must be a follower of your following people. Recommended to restrict your profile to only friends and family.",
                    },
                    {
                        label: "Restrict",
                        value: "custom",
                        icon: `privacy_policy`,
                        color: '#DC3545',
                        description: "No one can see your profile details. It is most restricted.",
                        title: 'Restricted Profile',
                    },
                ],
            };
        },
        computed: {
            visible_status() {
                if (!this.user.profile) {
                    return this.statuses.find((i) => i.value === "public");
                }
                return this.statuses.find((i) => i.value === this.user.profile.visible_profile);
            },
            auth_user() {
                return this.$store.getters["auth/user"];
            },
        },
        created() {
            if (this.auth_user) {
                this.getUsers();
                this.getProfileVisibleUsers();
            }
        },
        mounted() {
            this.form.status = this.visible_status.value;
        },
        methods: {
            async changeStatus(status) {
                this.form.status = status;
                if (status === "custom") {
                    this.$refs.profileStatusModal.close();
                    this.$refs.userSelectModal.open();
                    return false;
                }
                const response = await this.axios.post("/settings/update_profile", {
                    visible_profile: status,
                });
                if (response.data.status === "Success") {
                    if (this.page !== 'settings') {
                        this.user.profile.visible_profile = status;
                    }
                    this.$toast.success("Your profile access level successfully updated!");
                    this.$emit("updated", status);
                    this.$refs.profileStatusModal.close();
                }
            },
            async saveProfileVisibleUsers() {
                await this.form.post("/user/save_profile_visible_users");
                if (this.page === "profile") {
                    this.user.profile.visible_profile = "custom";
                } else {
                    this.$store.dispatch("auth/fetchUser");
                }
                this.$refs.userSelectModal.close();
            },
            async getProfileVisibleUsers() {
                const response = await this.axios.post("/user/get_profile_visible_users", { user_id: this.user.id });
                let users = response.data.data;
                this.form.visible_users = users.map((i) => i.id);
            },
            async getUsers() {
                const response = await this.axios.post("/user/get_all_users");
                this.users = response.data.data;
            },
        },
    };
</script>
<style lang="scss" scoped>
    .btn-lock {
        font-size: 26px;
        display: inline-block;
        height: 26px;
        text-decoration: none;
        font-size: 16px;
        &::after {
            display: none;
        }
    }
    .dropdown-profile-selector {
        line-height: 16px;
        .dropdown-toggle {
            &::before {
                display: none;
            }
        }
        .dropdown-menu {
            border-radius: 10px;
            .dropdown-item {
                font-size: 14.4px;
                color: #007bff;
                svg {
                    margin-right: 5px;
                }
            }
        }
    }
    .people-selector {
        &::v-deep {
            .multiselect__content-wrapper {
                max-height: 200px !important;
            }
            .multiselect__option {
                display: flex;
                align-items: center;
                padding: 6px 8px;
                img {
                    width: 30px;
                    height: 30px;
                    border-radius: 100%;
                    object-fit: cover;
                    margin-right: 6px;
                }
            }
        }
    }
    .people-item {
        display: flex;
        align-items: center;
        img {
            width: 30px;
            height: 30px;
            min-width: 30px;
            border-radius: 100%;
            object-fit: cover;
            margin-right: 5px;
        }
        .remove-specific-user {
            color: #28a745;
            cursor: pointer;
            margin-left: 10px;
        }
    }
    .profile-status-item {
        padding: 12px;
        display: flex;
        align-items: flex-start;
        margin-bottom: 14px;
        cursor: pointer;
        border-style: solid;
        border-width: 1px;
        border-radius: 8px;
        &.active {
            border-color: #FF22A1 !important;
            background-color: #FF22A1;
            .status-information {
                label, p {
                    color: #FFF !important;
                }
            }
            &::v-deep {
                [stroke] {
                    stroke: #FFF;
                }
                path[fill] {
                    fill: #FFF
                }
            }
        }
        &:last-child {
            margin-bottom: 0;
        }
        .status-information {
            flex-grow: 1;
            margin-left: 10px;
            label {
                font-size: 14.4px;
                margin-top: 2px;
                margin-bottom: 2px;
            }
            p {
                margin-bottom: 0;
                font-size: 13.2px;
                font-weight: 400;
            }
        }
    }
</style>
