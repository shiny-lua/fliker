<template>
    <div class="fliconn-user-list">
        <div class="row mx-n2">
            <div v-for="(item, index) in users" :key="index" class="col-6 col-md-4 px-2 mb-3" :class="model === 'channel' && 'col-xl-3'">
                <fliconn-member :user="item"
                     :removable="auth_user && auth_user.id === user_id"
                     @remove="remove"
                />
            </div>
        </div>
        <infinite-loading :distance="300"
            :identifier="infiniteId"
            @infinite="search"
        >
            <div slot="no-more"></div>
            <div class="text-center" slot="no-results">No members found!</div>
            <div slot="spinner" class="pt-3 pt-md-4">
                <img src="~assets/images/logo_loading.gif" width="50" alt="" />
            </div>
        </infinite-loading>
    </div>
</template>
<script>
import Swal from 'sweetalert2'
export default {
    name: 'FliconnUserList',
    props: {
        model: { type: String, default: 'group' },
        id: { type: Number, required: true },
        user_id: { type: Number, required: true },
    },
    data() {
        return {
            users: [],
            filter: {
                id: this.id,
                page: 1,
            },
            infiniteId: +new Date(),
        }
    },
    computed: {
        auth_user() {
            return this.$store.getters['auth/user'];
        }
    },
    methods: {
        async search($state) {
            try {
                const response = await this.axios.post(`${process.env.timelineApiUrl}/${this.model}/get_members`, this.filter);
                if (response.data.status == "Success") {
                    let result = response.data.data;
                    if (result.current_page == 1) this.users = [];
                    if (result.data.length) {
                        this.filter.page++;
                        this.users.push(...result.data);
                        $state.loaded();
                    } else {
                        $state.complete();
                    }
                }
            } catch (error) {
                console.log(error);
            }
        },
        remove(item) {
            Swal.fire({
                title: "Are you sure?",
                icon: "warning",
                showCancelButton: true,
            }).then((willDelete) => {
                if (willDelete.isConfirmed) {
                    this.axios
                        .post(`${process.env.timelineApiUrl}/${this.model}/remove_join`, {
                            id: this.id,
                            user_id: item.id,
                        })
                        .then((response) => {
                            let index = this.users.findIndex((i) => i.id === item.id);
                            this.users.splice(index, 1);
                            this.$emit("join_removed", item);
                        })
                        .catch(function (error) {
                            let result = error.response.data;
                            this.$toast.error(result.message);
                        });
                }
            });
        },
    }
}
</script>