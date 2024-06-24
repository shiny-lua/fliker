<template>
    <div class="search-user-modal">
        <fp-modal ref="searchModal"
             :name="modalName"
             :title="modalTitle"
             :show-header="!!modalTitle"
        >
            <div v-if="description" class="specific-people-description mb-3">
                <fp-icon name="privacy_policy" class="fp-fs-20" />
                <div class="ml-2">
                    <p class="mb-0">Specific People</p>
                    <p class="description">{{ description }}</p>
                </div>
            </div>
            <search-users url="/user/search"
                placeholder="Search name or @username"
                @input="userSelected"
            >
                <template #image>
                    <fp-icon name="user-tag" class="fp-fs-24" />
                </template>
            </search-users>
            <div class="mt-3 text-center">
                <button type="button" class="btn fp-btn-gradient" @click="save()">Confirm</button>
                <button type="button" class="btn fp-btn-outline ml-2" @click="closeModal()">Cancel</button>
            </div>
        </fp-modal>
        <div v-if="users_data.length" class="users">
            <div v-for="(item, index) in users_data.slice(0, 6)" :key="index" class="user-item">
                <img :src="item.photo_url" alt="" />
                <p class="name">{{ item.name }}</p>
                <p class="fp-text-color-main username">@{{ item.username }}</p>
                <a href="javascript:;" class="btn btn-sm py-1 fp-btn-outline-danger" @click.prevent="remove(item)">Remove</a>
            </div>
            <div v-if="users_data.length > 6" class="mt-4 text-primary fp-fs-24">{{ users_data.length - 6 }}+</div>
        </div>
    </div>
</template>
<script>
import FpModal from "./Modal.vue"
import SearchUsers from "~/components/ui/SearchUsers.vue";
export default {
    name: 'SearchUserModal',
    props: {
        users: { type: Array, default: [] },
        modalTitle: { type: String, default: '' },
        description: { type: String, default: ''} ,
    },
    components: {
        FpModal,
        SearchUsers,
    },
    data() {
        return {
            selected_users: [],
            users_data: [],
        }
    },
    computed: {
        modalName() {
            return `search_user_modal_${Math.round(Math.random() * 10000)}`;
        }
    },
    watch: {
        selected_users() {
            this.getUsersData();
        }
    },
    mounted() {
        this.selected_users = [...this.users];
    },
    methods: {
        openModal() {
            this.$refs.searchModal.open();
        },
        closeModal() {
            this.$refs.searchModal.close();
        },
        save() {
            this.$emit('change', this.selected_users);
            this.closeModal();
        },
        remove(item) {
            const index = this.selected_users.indexOf(item.id);
            this.selected_users.splice(index, 1);
            this.$emit('change', this.selected_users);
        },
        async getUsersData() {
            const response = await this.axios.post('/user/get_users_data', {users: this.selected_users});
            if (response.data.status === 'Success') {
                this.users_data = response.data.data;
            }
        },
        userSelected(data) {
            this.selected_users = Array.from(new Set([...this.selected_users, ...data]));
        }
    },
}
</script>
<style lang="scss" scoped>
    .specific-people-description {
        display: flex;
        background: #FF22A1;
        color: #FFF;
        padding: 12px;
        border-radius: 8px;
        .description {
            font-size: 13.6px;
            margin-bottom: 0;
        }
    }
    .users {
        display: flex;
        max-width: 100%;
        overflow: auto;
        .user-item {
            width: 114px;
            min-width: 114px;
            text-align: center;
            img {
                border-radius: 100%;
                width: 50px;
                height: 50px;
                object-fit: cover;
            }
            .name {
                font-size: 15px;
                margin-top: 6px;
                margin-bottom: 0;
                line-height: 1.2;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            .username {
                font-size: 13.6px;
                font-weight: 400;
                margin-bottom: 8px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
        }
    }
</style>