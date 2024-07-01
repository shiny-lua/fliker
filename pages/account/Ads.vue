<template>
    <div class="col-lg-12 px-lg-0">
        <div class="filter form-inline mb-3">
            <h5 class="page-title mb-0 mr-auto">Manage Classifieds</h5>
            <div class="d-flex align-items-center">
                <label class="control-label fp-text-color-main mb-0">Status</label>
                <select class="form-control ml-2 has-bg" v-model="filter.status">
                    <option value="">All</option>
                    <option value="inactive">Inactive</option>
                    <option value="active">Active</option>
                    <option value="expired">Expired</option>
                    <option value="blocked">Blocked</option>
                    <option value="deleted">Deleted</option>
                </select>
            </div>
        </div>
        <div class="table-responsive fp-table">
            <table class="table table-bordered">
                <thead>
                    <tr>
                        <th style="width: 300px;">Subject</th>
                        <th>Category</th>
                        <th>Location</th>
                        <th>Posted/Activated</th>
                        <th>Expires</th>
                        <th>Status</th>
                        <th style="min-width: 75px;">Action</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-if="posts.length == 0"><td colspan="10" class="text-center">No posts found!</td></tr>
                    <tr v-for="(item, index) in posts" :key="index">
                        <td class="subject text-primary">
                            <router-link :to="{name: 'ads.detail', params: {slug: item.slug}}" target="_blank">
                                {{item.title}}
                            </router-link>
                        </td>
                        <td>
                            <span v-if="item.automotive_item_name">{{item.automotive_category ? item.automotive_category.name: ''}}</span>
                            <span v-else>{{item.category ? item.category.name: ''}}</span>
                        </td>
                        <td class="location">{{item.location ? item.location.display_address : ''}}</td>
                        <td>
                            {{$moment(item.posted_date).format('MM/DD/YYYY')}}
                        </td>
                        <td class="text-center">
                            <span v-if="item.status == 'active' || item.status == 'expired'">
                                {{$moment(item.price && item.paid_at ? item.paid_at : item.created_at).add(30, 'days').format('MM/DD/YYYY')}}
                            </span>
                            <span v-else>
                                N/A
                            </span>
                        </td>
                        <td>
                            <span
                                style="text-transform: capitalize;"
                                :class="{
                                    'fp-text-color-main': item.status == 'pending' || item.status == 'archived',
                                    'text-warning': item.status == 'inactive',
                                    'text-success': item.status == 'active',
                                    'text-danger': item.status == 'blocked' || item.status == 'expired' || item.status == 'deleted',
                                }"
                            >
                                <span v-if="item.status === 'pending'">Waiting Approval</span>
                                <span v-else>{{ item.status }}</span>
                            </span>
                        </td>
                        <td class="action text-center">
                            <router-link v-if="item.status === 'inactive'" :to="{name: 'ads.activate', query: {id: item.id, email: item.contact_email}}" v-tooltip="'Activate'"><fp-icon name="circle-a" class="fp-fs-20" /></router-link>
                            <a v-if="item.status === 'pending'" href="javascript:;" @click="changeStatus(item, index, 'archived')" v-tooltip="'Archive'"><fp-icon name="archive" class="fp-fs-20" /></a>
                            <a v-if="item.status === 'expired' || item.status == 'deleted'" href="javascript:;" @click="repost(item, index)" v-tooltip="'Repost'"><fp-icon name="refresh" class="fp-fs-20" /></a>
                            <span v-if="item.status === 'blocked'"><fp-icon name="ban" class="fp-fs-18" /></span>
                            <a v-else href="javascript:;" @click="changeStatus(item, index, 'deleted')" v-tooltip="'Delete'"><fp-icon name="trash" class="fp-fs-20" /></a>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div class="d-flex justify-content-between align-items-center">
                <div>
                    <p class="fp-text-color">Total {{ total }}</p>
                </div>
                <div>
                    <paginate
                        v-model="filter.page"
                        :page-count="page_count"
                        :page-range="3"
                        :margin-pages="2"
                        :prev-class="'page-item'"
                        :next-class="'page-item'"
                        :prev-link-class="'page-link'"
                        :next-link-class="'page-link'"
                        :click-handler="searchPosts"
                        :container-class="'pagination'"
                        :page-class="'page-item'"
                        :prev-text="'Previous'"
                        :next-text="'Next'"
                        :page-link-class="'page-link'">
                    </paginate>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import Swal from 'sweetalert2';
export default {
    name: 'AccountAds',
    data() {
        return {
            posts: [],
            filter: {
                is_admin: true,
                user_id: '',
                status: '',
                page: 1,
            },
            page_count: 0,
            total: 0,
            per_page: 24,
        };
    },
    watch: {
        'filter.status': function(newVal) {
            this.filter.page = 1;
            this.searchPosts();
        }
    },
    computed: {
        auth_user() {
            return this.$store.getters["auth/user"];
        },
    },
    mounted() {
        this.filter.user_id = this.auth_user.id;
        this.searchPosts();
    },
    methods: {
        searchPosts() {
            this.axios.post(`${process.env.adsApiUrl}/post/search`, this.filter).then(response => {
                if (response.data.status == 'Success') {
                    let result = response.data.data
                    this.posts = result.data;
                    this.page_count = result.last_page;
                    this.per_page = result.per_page;
                    this.total = result.total;
                }
            })
        },
        editPost(item) {
            this.$router.push({name: 'ads.edit', params: {id: item.id}});
        },
        changeStatus(item, index, status) {
            if (item.price && status == 'active') {
                this.$router.push({name: 'ads.activate', query: {id: item.id, email: item.contact_email}})
                return false
            }
            Swal.fire({
                title: 'Are you sure?',
                icon: "warning",
                showCancelButton: true,
            }).then((willDelete) => {
                if (willDelete.isConfirmed) {
                    let params = {
                        id: item.id,
                        status: status,
                    }
                    this.axios.post(`${process.env.adsApiUrl}/post/change_status`, params).then (response =>{
                        if (response.data.status == 'Success') {
                            item.status = response.data.data.status
                            this.$toast.success('Successfully done!');
                        }
                    }).catch(function (error) {
                        console.log(error);
                    });
                }
            });
        },
        repost(item, index) {
            if (item.price) {
                return this.$router.push({name: 'ads.activate', query: {id: item.id, email: item.contact_email}});
            } else {
                this.changeStatus(item, index, 'active');
            }
        },
        edit(item) {
            this.$router.push({name: 'ads.edit', params: {id: item.id, action: 'repost'}});
        }
    }
}
</script>

<style lang="scss" scoped>
    @media (max-width: 600px) {
        .page-title {
            font-size: 16px;
        }
    }
    td.subject {
        min-width: 300px;
        a {
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
            text-overflow: ellipsis;
        }
    }
    td.location {
        white-space: nowrap;
    }
    td.action > * {
        margin-right: 6px;
        &:last-child {
            margin-right: 0;
        }
    }
</style>