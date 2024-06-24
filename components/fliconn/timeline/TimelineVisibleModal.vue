<template>
    <fp-modal ref="visibleModal"
         :name="modalName"
         title="Who can see this post?"
    >
        <div v-if="step === 1" class="visible-selector">
            <div v-for="item in options"
                 :key="item.value"
                 class="visible-option fp-border-color-1"
                 :class="value === item.value && 'active'"
                 @click.prevent="changeStatus(item.value)"
            >
                <fp-icon :name="item.icon" class="visible-option-icon" :class="item.value" />
                <div class="visible-information">
                    <label class="visible-label">{{ item.label }}</label>
                    <p class="visible-description fp-text-color-main">{{ item.description }}</p>
                </div>
            </div>

        </div>
        <div v-if="step === 2" class="search-users">
            <div class="visible-option active">
                <fp-icon name="privacy_policy" class="visible-option-icon" />
                <div class="visible-information">
                    <label class="visible-label">Sepcific People</label>
                    <p class="visible-description">The post is visible to only selected people.</p>
                </div>
            </div>
            <search-users v-model="visible_users"
                url="/user/search"
                placeholder="Search name or @username"
            >
                <template #image>
                    <fp-icon name="user-tag" class="fp-fs-24" />
                </template>
            </search-users>
            <div class="mt-4 text-center">
                <button type="button" class="btn fp-btn-gradient" @click="confirmVisibleUsers()">Confirm</button>
                <button type="button" class="btn fp-btn-outline ml-2" @click="cancelVisibleUsers()">Cancel</button>
            </div>
        </div>
    </fp-modal>
</template>
<script>
import FpModal from "~/components/ui/Modal.vue"
import SearchUsers from "~/components/ui/SearchUsers.vue";
export default {
    name: 'TimelineVisibleModal',
    props: {
        value: { type: String, required: true },
        is_form: { type: Boolean, default: false },
    },
    components: {
        FpModal,
        SearchUsers,
    },
    data() {
        return {
            step: 1,
            options: [
                {
                    label: "Public",
                    value: "public",
                    description: "Everyone on the FlickerPage can see this post.",
                    icon: `globe`,
                },
                {
                    label: "Followers",
                    value: "followers",
                    icon: `user-check`,
                    description: "This post is visible to only your followers.",
                },
                {
                    label: "Mutual Followers",
                    value: "mutual_followers",
                    icon: `users-check`,
                    description: "This post is visible to your mutual followers.",
                },
                {
                    label: "Restricted",
                    value: "custom",
                    icon: `privacy_policy`,
                    description: "This post is visible to only selected people.",
                },
            ],
            visible_users: [],
        }
    },
    computed: {
        modalName() {
            return `visible_modal_${Math.random()}`;
        }
    },
    mounted() {
        if (!this.is_form) {
            this.options.push({
                label: "Nobody",
                value: "nobody",
                icon: `eye-slash`,
                description: "Noone can this post except you.",
            });
        }
    },
    methods: {
        open() {
            this.step = 1;
            this.$refs.visibleModal.open();
        },
        close() {
            this.$refs.visibleModal.close();
        },
        changeStatus(value) {
            if (value === 'custom') {
                this.step = 2;
            } else {
                this.$emit('input', value);
                this.visible_users = [];
                this.$emit('user-selected', this.visible_users);
                this.close();
            }
        },
        confirmVisibleUsers() {
            this.value = 'custom';
            this.$emit('input', 'custom');
            this.$emit('user-selected', this.visible_users);
            this.close();
        },
        cancelVisibleUsers() {
            this.visible_users = [];
            this.step = 1;
        }
    }
}
</script>
<style lang="scss" scoped>
    .visible-option {
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
            color: #FFF;
            .visible-option-icon {
                color: #FFF;
            }
            .visible-description {
                color: #FFF !important;
            }
        }
        &:last-child {
            margin-bottom: 0;
        }
        .visible-information {
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
    .visible-option-icon {
        font-size: 22px;
        margin-top: 2px;
        &.public {
            font-size: 20px;
            color: #28A745;
        }
        &.followers {
            color: #468FEA;
        }
        &.mutual_followers {
            color: #FFCF55;
        }
        &.custom {
            color: #DA3544;
        }
    }
</style>