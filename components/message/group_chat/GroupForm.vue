<template>
    <form class="group-form" @submit.prevent="submit">
        <div class="d-md-flex">
            <div>
                <label class="image-label mx-auto">
                    <img v-if="imageData" :src="imageData" width="100%" height="100%" class="form-image" alt="">
                    <fp-icon v-else name="camera-fill" class="fp-fs-30 cam-icon" />
                    <input type="file" name="image" hidden accept="image/*" @change="handleImage" />
                </label>
            </div>
            <div class="input-wrapper flex-grow-1 ml-md-3 mt-2">
                <div class="mb-3">
                    <div class="icon-prefix-input">
                        <fp-icon name="users" />
                        <input v-model="form.name" class="form-control" type="text" name="name" placeholder="Name your group" required maxlength="30" />
                    </div>
                    <has-error :form="form" field="name" />
                </div>
                <div class="mb-3">
                    <div class="icon-prefix-input">
                        <fp-icon name="add-group" />
                        <input type="text" name="keyword" class="form-control" @keyup="handleSearch" placeholder="Add group members" />
                    </div>
                </div>
            </div>
        </div>
        <div v-if="users.length" class="added-users mb-3">
            <div v-for="(item, index) in users.slice(0, 6)" :key="index" class="user-item">
                <img :src="item.photo_url" width="50" height="50" alt="" class="user-photo rounded-lg" />
                <p class="user-name text-center mb-0">{{ item.name }}</p>
                <fa :icon="['far', 'times-circle']" class="btn-remove" @click="removeUser(item, index)" />
            </div>
            <div class="more-users" v-if="users.length > 6">{{ users.length - 6 }}+</div>
        </div>
        <div v-if="loading" class="text-center">
            <div class="spinner-border text-muted"></div>
        </div>
        <div v-else class="searched-users nice-scrollbar">
            <div v-for="(item, index) in searched_users"
                 :key="index"
                 class="user-item mb-2"
                 :class="{
                    'd-none': users.findIndex(i => i.id === item.id) !== -1
                 }"
            >
                <img :src="item.photo_url" width="50" height="50" alt="" class="user-photo rounded-lg" />
                <div class="user-details flex-grow-1 d-flex align-items-center ml-2">
                    <div>
                        <p class="mb-0 font-weight-bold">{{ item.name }}</p>
                        <p class="mb-0 fp-text-color-main username">@{{ item.username }}</p>
                    </div>
                    <div class="actions ml-auto">
                        <a href="javascript:;" class="btn btn-sm fp-btn-gradient py-2 px-3" @click.prevent="addUser(item, index)">Add</a>
                    </div>
                </div>
            </div>
        </div>
        <div class="text-center mt-2">
            <button type="submit" class="btn btn-create-group" :class="form.busy && 'btn-loading'" :disabled="form.busy">
                <fp-icon name="plus-square" class="fp-fs-20 mt-n-2px" />
                Create
            </button>
        </div>
    </form>
</template>
<script>
import Form from "vform";
export default {
    name: 'GroupForm',
    data() {
        return {
            form: new Form({
                user_id: '',
                name: '',
                image: null,
                users: [],
            }),
            imageData: null,
            users: [],
            keyword: '',
            searched_users: [],
            timer: null,
            loading: false,
        }
    },
    computed: {
        auth_user() {
            return this.$store.getters["auth/user"];
        },
    },
    methods: {
        handleImage(event) {
            const file = event.target.files[0]
            this.form.image = file;
            if (!file) return false
            let reader = new FileReader();
            reader.onload = e => {
                this.imageData = e.target.result;
            };
            reader.readAsDataURL(file);
        },
        handleSearch(event) {
            clearTimeout(this.timer);
            this.timer = setTimeout(() => {
                let keyword = event.target.value;
                if (keyword == '') {
                    this.searched_users = [];
                } else {
                    this.searchUsers(keyword);
                }
            }, 500);
        },
        async searchUsers(keyword) {
            this.loading = true;
            try {
                const response = await this.axios.post('/user/get_same_country_users', { keyword: keyword });
                this.searched_users = response.data.data.data;
            } catch (error) { }
            this.loading = false;
        },
        addUser(item, index) {
            if (this.users.find(i => i.id === item.id)) return;
            this.users.push(item);
            this.searched_users.splice(index, 1);
        },
        removeUser(item, index) {
            this.users.splice(index, 1);
            if (!this.searched_users.find(i => i.id === item.id)) {
                this.searched_users.push(item);
            }
        },
        async submit() {
            this.form.user_id = this.auth_user.id;
            this.form.users = this.users.map(i => i.id);
            try {
                const response = await this.form.post(`${process.env.chatApiUrl}/group/save`);
                if (response.data.status === 'Success') {
                    this.$emit('submitted', response.data.data);
                }
            } catch (error) {
                console.log(error)
            }
        }
    }
}
</script>
<style lang="scss" scoped>
    .group-form {
        position: relative;
        .cam-icon {
            color: #FF22A1;
        }
        .btn-create-group {
            color: #FFF;
            background: linear-gradient(97.08deg, #FF22A1 1.5%, #FF76C5 99.31%);
        }
        .image-label {
            width: 110px;
            height: 110px;
            background: #DADADA;
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            .form-image {
                width: 100%;
                height: 100%;
                border-radius: 10px;
                object-fit: cover;
            }
        }
        .searched-users {
            max-height: 170px;
            overflow-y: auto;
            .user-item {
                display: flex;
                .user-photo {
                    min-width: 50px;
                    object-fit: cover;
                }
                .username {
                    font-size: 13px;
                }
            }
        }
        .added-users {
            display: flex;
            align-items: center;
            .user-item {
                width: 50px;
                text-align: center;
                margin-right: 8px;
                position: relative;
                .user-photo {
                    object-fit: cover;
                    margin: auto;
                }
                .user-name {
                    width: 100%;
                    margin-top: 3px;
                    font-size: 12px;
                    line-height: 14px;
                    font-weight: 600;

                    height: 28px;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                .btn-remove {
                    position: absolute;
                    top: 2px;
                    right: 2px;
                    cursor: pointer;
                    color: #DC3545;
                    font-size: 13px;
                }
            }
            .more-users {
                font-size: 24px;
                color: #007BFF;
                margin-top: -27px;
            }
        }
        .spinner-border {
            width: 1.6rem;
            height: 1.6rem;
            border-width: 0.18rem;
        }
    }
</style>