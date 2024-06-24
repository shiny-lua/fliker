<template>
    <div class="group-settings p-3">
        <div class="settings-item d-flex justify-content-between">
            <div>
                <p class="option mb-0">Mute chat notifications</p>
                <p class="text-muted description">Mute or unmute chat notification sounds from group members</p>
            </div>
            <div class="custom-control custom-switch">
                <input type="checkbox" class="custom-control-input" id="switch_mute" v-model="mute_notifications" />
                <label class="custom-control-label" for="switch_mute"></label>
            </div>
        </div>
        <template v-if="isPrimaryAdmin">
            <div class="settings-item d-flex justify-content-between">
                <div>
                    <p class="option mb-0">Enable one way messaging</p>
                    <p class="text-muted description">If you enable 1-way messaging, only group admin can post messages. Group members can only read messages.</p>
                </div>
                <div class="custom-control custom-switch">
                    <input type="checkbox" class="custom-control-input" id="switch_replies" v-model="one_way_messaging" />
                    <label class="custom-control-label" for="switch_replies"></label>
                </div>
            </div>
            <div class="settings-item">
                <p class="option mb-0">
                    Enable message disappearing
                </p>
                <div style="width: 286px;">
                    <step-radios v-model="available_hours" :steps="hour_steps"></step-radios>
                </div>
            </div>
            <div class="settings-item mb-4 text-center">
                <a href="javascript:;" class="btn btn-sm btn-outline-danger" @click.prevent="$modal.show('deleteGroupModal')">Delete Group</a>
                <a href="javascript:;" class="btn btn-sm  fp-btn-outline ml-2" @click.prevent="$modal.show('exitGroupModal')">Exit from Group</a>
            </div>
        </template>
        <div v-else class="d-flex align-items-center justify-content-center">
            <a href="javascript:;" class="btn btn-sm btn-outline-danger" @click.prevent="blockGroup()">{{group.is_blocked ? 'Unblock Group' : 'Block Group'}}</a>
            <a href="javascript:;" class="btn btn-sm  fp-btn-outline ml-2" @click.prevent="exitMember()">Exit from Group</a>
        </div>
        <modal name="deleteGroupModal"
            :width="450"
            height="auto"
            :adaptive="true"
            :clickToClose="false"
            @before-open="delete_form.reset();delete_form.errors.clear();"
        >
            <div class="py-4 px-3 confirm-delete-modal">
                <div class="text-center mb-3">
                    <span class="alert-sign">!</span>
                </div>
                <p class="description">
                    Do you really want to delete group <span class="text-primary">"{{ this.group.name }}"</span>? Enter password and click confirm to delete.
                </p>
                <form @submit.prevent="deleteGroup()">
                    <div class="form-group mx-auto" style="width: 240px;">
                        <input v-model="delete_form.password" type="password" class="form-control" placeholder="Enter your password..." required />
                        <has-error :form="delete_form" field="password" />
                    </div>
                    <div class="text-center">
                        <button type="submit" class="btn btn-danger" :class="delete_form.busy && 'btn-loading'" :disabled="delete_form.busy">Confirm</button>
                        <button type="button" class="btn btn-secondary ml-2" @click="$modal.hide('deleteGroupModal')">Cancel</button>
                    </div>
                </form>
            </div>
        </modal>
        <modal name="exitGroupModal"
            :width="500"
            height="auto"
            :adaptive="true"
            :clickToClose="false"
            @before-open="exit_form.reset();exit_form.errors.clear();"
        >
            <div class="py-4 px-3 confirm-delete-modal exit-modal">
                <div class="text-center mb-3">
                    <span class="alert-sign">!</span>
                </div>
                <p class="description">
                    Do you really want to exit from the group <span class="text-primary">"{{ group.name }}"</span>? Delegate primary admin rights to another group member and confirm.
                </p>
                <form @submit.prevent="exitGroup()">
                    <div class="d-md-flex align-items-center justify-content-center mb-3">
                        <label class="mb-md-0 mr-3">Primary admin</label>
                        <div class="d-flex align-items-center">
                            <search-single-user :url="searchUserUrl"
                                 :params="{
                                    id: group.id,
                                    page: 1,
                                 }"
                                 @input="selectNewPrimaryAdmin"
                            ></search-single-user>
                            <div v-if="newPrimaryAdmin" class="new-primary-admin">
                                <img :src="newPrimaryAdmin.photo_url" width="40" height="40" alt="" />
                                <p class="mb-0">{{ newPrimaryAdmin.first_name }}</p>
                            </div>
                        </div>
                        <!-- <has-error :form="delete_form" field="password" /> -->
                    </div>
                    <div class="text-center">
                        <button type="submit" class="btn btn-danger px-4" :class="exit_form.busy && 'btn-loading'" :disabled="exit_form.busy">Exit</button>
                        <button type="button" class="btn btn-secondary ml-2" @click="$modal.hide('exitGroupModal')">Cancel</button>
                    </div>
                </form>
            </div>
        </modal>
    </div>
</template>
<script>
import StepRadios from '../../elements/StepRadios.vue'
import { mapGetters } from "vuex";
import Cookies from 'js-cookie';
import Form from "vform";
import SearchSingleUser from '../../ui/SearchSingleUser.vue';
import Swal from "sweetalert2";
export default {
    name: 'GroupSettings',
    props: {
        group: { type: Object, required: true },
    },
    components: {
        StepRadios,
        SearchSingleUser
    },
    data() {
        return {
            mute_notifications: false,
            one_way_messaging: !this.group.repliable,
            available_hours: this.group.available_hours || 0,
            hour_steps: [
                { value: 0, label: 'Off' },
                { value: 24, label: '1 Day' },
                { value: 168, label: '1 Week' },
                { value: 720, label: '1 Month' },
            ],
            delete_form: new Form({
                group_id: this.group.id,
                password: '',
            }),
            exit_form: new Form({
                group_id: this.group.id,
                new_user_id: '',
            }),
            newPrimaryAdmin: null,
        }
    },
    mounted() {
        let muted_groups = this.mutedGroups();
        this.mute_notifications = muted_groups.includes(this.group.id);
    },
    computed: {
        ...mapGetters({
            auth_user: 'auth/user',
        }),
        isPrimaryAdmin() {
            return this.auth_user && this.auth_user.id === this.group.user_id;
        },
        searchUserUrl() {
            return `${process.env.chatApiUrl}/group/get_users`;
        }
    },
    watch: {
        one_way_messaging() {
            this.enableReply()
        },
        available_hours() {
            this.changeAvailableHours()
        },
        mute_notifications(val) {
            let muted_groups = this.mutedGroups();
            const index =  muted_groups.findIndex(i => i == this.group.id);
            if (index === -1 && val) {
                muted_groups.push(this.group.id);
            } else if (index >= 0 && !val) {
                muted_groups.splice(index, 1);
            }
            Cookies.set('muted_groups', JSON.stringify(muted_groups));
        }
    },
    methods: {
        async enableReply() {
            let payload = {
                id: this.group.id,
                repliable: !this.one_way_messaging,
            }
            const response = await this.axios.post(`${process.env.chatApiUrl}/group/enable_reply`, payload);
            if (response.data.status === 'Success') {
                this.$store.dispatch('message/enableGroupReply', {
                                group_id: this.group.id,
                                repliable: response.data.data.repliable,
                            });
            }
        },
        async changeAvailableHours() {
            let payload = {
                id: this.group.id,
                available_hours: this.available_hours,
            }
            const response = await this.axios.post(`${process.env.chatApiUrl}/group/change_available_hours`, payload);
            if (response.data.status === 'Success') {
                this.$store.dispatch('message/changeGroupMsgAvailableHours', {
                                group_id: this.group.id,
                                available_hours: response.data.data.available_hours,
                            });

            }
        },
        async deleteGroup() {
            try {
                const response = await this.delete_form.delete(`${process.env.chatApiUrl}/group/delete/${this.group.id}`);
                if (response.data.status === 'Success') {
                    this.delete_form.reset();
                    this.$modal.hide('deleteGroupModal');
                    this.$emit('group-deleted');
                }
            } catch (error) {
                console.log(error);
            }
        },
        async exitGroup() {
            if (!this.exit_form.new_user_id) {
                this.$toast.error('Please select the new primary admin from the group members.');
                return false;
            }
            try {
                const response = await this.exit_form.post(`${process.env.chatApiUrl}/group/exit`);
                if (response.data.status === 'Success') {
                    this.exit_form.reset();
                    this.$modal.hide('exitGroupModal');
                    this.$emit('group-exited');
                }
            } catch (error) {
                console.log(error);
            }

        },
        mutedGroups() {
            let mutedGroups = Cookies.get('muted_groups');
            if (!mutedGroups) return [];
            try {
                return JSON.parse(mutedGroups);
            } catch (error) {
                return [];
            }
        },
        selectNewPrimaryAdmin(user) {
            this.newPrimaryAdmin = user;
            this.exit_form.new_user_id = user.id;
        },
        exitMember() {
            Swal.fire({
                html: `Do you really want to exit from the group <span class="text-primary">"${ this.group.name }"</span>?`,
                icon: "warning",
                showCancelButton: true,
            }).then((willDelete) => {
                if (willDelete.isConfirmed) {
                    this.axios.post(`${process.env.chatApiUrl}/group/exit`, {group_id: this.group.id}).then (response =>{
                        if (response.data.status == 'Success') {
                            this.$emit('group-exited');
                        }
                    }).catch(function (error) {
                        console.log(error);
                    });
                }
            });
        },
        blockGroup() {
            Swal.fire({
                title: `Are you sure?`,
                icon: "warning",
                showCancelButton: true,
            }).then((willDelete) => {
                if (willDelete.isConfirmed) {
                    this.axios.post(`${process.env.chatApiUrl}/group/block`, {group_id: this.group.id}).then (response =>{
                        if (response.data.status == 'Success') {
                            this.$emit('group-blocked');
                            this.$store.dispatch('message/setGroupBlocked', response.data.data.is_blocked);
                        }
                    }).catch(function (error) {
                        console.log(error);
                    });
                }
            });
        }
    }
}
</script>
<style lang="scss" scoped>
    .option {
        font-size: 15px;
    }
    .description {
        font-size: 13.6px;
        font-weight: 400;
    }
    .custom-switch {
        margin-left: 12px;
    }
    .confirm-delete-modal {
        .description {
            font-size: 15px;
            font-weight: 500;
            text-align: center;
        }
    }
    .alert-sign {
        margin: auto;
        font-size: 50px;
        line-height: 70px;
        display: block;
        width: 75px;
        height: 75px;
        border-radius: 100%;
        border: solid 3px #DC3545;
        color: #DC3545;
    }
    .exit-modal {
        .alert-sign {
            color: #ffc107;
            border-color: #ffc107;
        }
    }
    .new-primary-admin {
        margin-top: 5px;
        text-align: center;
        padding: 0 12px;
        margin-left: 12px;
        img {
            object-fit: cover;
            border-radius: 100%;
        }
        p {
            font-size: 14.4px;
        }
    }
</style>