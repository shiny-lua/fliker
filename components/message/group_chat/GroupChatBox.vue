<template>
    <div class="chat-box fp-bg-color-1" :class="{minimized}">
        <div class="panel-header">
            <span v-if="tab === 'Chat'" class="d-inline-flex align-items-center">
                <img :src="group.image_url" width="28" class="avatar" alt="">
                <h6 class="mb-0 group-name">
                    {{group.name}}
                </h6>
            </span>
            <a v-else href="javascript:;" class="settings-tab" @click.prevent="tab = 'Chat'">
                <fp-icon name="chevron-left" class="fp-fs-22" />
                {{ tab }}
            </a>
            <div class="header-icons ml-auto">
                <div class="dropdown dropdown-tab">
                    <a href="javascript:;"
                         class="group-icon dropdown-toggle"
                         data-toggle="dropdown"
                    >
                        <fp-icon name="setting" class="fp-fs-22" :style="{'color': tab === 'Chat' ? '#FFFFFF' : '#FDFFB0'}" />
                    </a>
                    <div class="dropdown-menu dropdown-menu-sm dropdown-menu-right">
                        <a href="javascript:;" class="dropdown-item" @click="tab = 'Members'">
                            <fp-icon name="users" class="fp-fs-20 fp-text-color-main" />
                            Members
                        </a>
                        <a href="javascript:;" class="dropdown-item" @click="tab = 'Media'">
                            <fp-icon name="folder" class="fp-fs-18 fp-text-color-main" />
                            Media
                        </a>
                        <a href="javascript:;" class="dropdown-item" @click="tab = 'Settings'">
                            <fp-icon name="setting" class="fp-fs-20 fp-text-color-main" />
                            Settings
                        </a>
                    </div>
                </div>
            </div>
            <a href="javascript:;" class="btn-close ml-1 text-white" @click="minimized = !minimized">
                <fa v-if="minimized" :icon="['far', 'window-restore']" />
                <fp-icon v-else name="minus-square" class="fp-fs-20" />
            </a>
            <a href="javascript:;" class="btn-close text-white ml-2" @click="closeGroupChat()">
                <fp-icon name="close-1" class="fp-fs-20" />
            </a>
        </div>
        <div class="chatbox-body" v-show="!minimized">
            <group-messages v-if="tab === 'Chat'"
                 :group="group"
                 @change-tab="changeTab"
                 @read="$emit('read')"
            />
            <group-users v-if="tab === 'Members'" :group="group"></group-users>
            <group-medias v-if="tab === 'Media'" :group="group"></group-medias>
            <group-settings v-if="tab === 'Settings' && group.is_user"
                 :group="group"
                 @group-deleted="groupDeleted"
                 @group-exited="groupDeleted"
            />
        </div>
    </div>
</template>
<script>
import GroupMessages from './GroupMessages.vue'
import GroupUsers from './GroupUsers.vue'
import GroupMedias from './GroupMedias.vue'
import GroupSettings from './GroupSettings.vue'
export default {
    name: 'GroupChatBox',
    props: {
        group: { type: Object, required: true },
    },
    components: {
        GroupMessages,
        GroupUsers,
        GroupMedias,
        GroupSettings
    },
    data() {
        return {
            tab: 'Chat',
            minimized: false,
        }
    },
    methods: {
        closeGroupChat() {
            this.$store.dispatch('message/closeGroupChat', this.group);
        },
        groupDeleted() {
            this.closeGroupChat();
            this.$emit('group-deleted', this.group.id);
        },
        changeTab(tab) {
            this.tab = tab;
        }
    }
}
</script>
<style lang="scss" scoped>
    .panel-header {
        .group-name {
            max-width: 150px;
            font-size: 14px;
            line-height: 1;
        }
    }
    .chatbox-body {
        flex-grow: 1;
        height: calc(100% - 92px);
    }
    .header-icons {
        display: flex;
        align-items: center;
        .group-icon {
            padding: 1px 2px;
            margin-right: 2px;
        }
        .dropdown {
            .dropdown-toggle {
                &::after {
                    display: none;
                }
            }
        }
    }

    .settings-tab {
        display: inline-flex;
        align-items: center;
        font-size: 16px;
        padding: 3px 0;
        margin-top: -2px;
        color: #FFF;
        text-decoration: none;
    }
</style>