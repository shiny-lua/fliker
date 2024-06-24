<template>
    <div class="d-flex justify-content-center pt-3 pt-md-4">
        <div class="fliconn-groups">
            <div class="input-container">
                <input type="text"
                        class="form-control has-bg"
                        v-model="filter.keyword"
                        :placeholder="`Search ${filter.type}s`"
                        @input="debounceSearchGroups"
                />
                <fp-icon name="search" class="fp-fs-18 fp-text-color-main" />
            </div>

            <div class="search-groups-list">
                <div class="groups-wrapper">
                    <div v-for="(item, index) in groups" :key="index" class="group-item-container">
                        <group-item :group="item" />
                    </div>
                </div>
                <infinite-loading
                    :distance="300"
                    :identifier="infiniteId"
                    @infinite="search"
                >
                    <div slot="no-more"></div>
                    <div slot="no-results">No results found...</div>
                </infinite-loading>
            </div>
        </div>
    </div>
</template>
<script>
import GroupItem from "~/components/fliconn/group/GroupItem.vue"
export default {
    name: 'SearchGroup',
    components: {
        GroupItem,
    },
    data() {
        const type = this.$route.params.type;
        return {
            groups: [],
            filter: {
                type: type,
                page: 1,
                keyword: '',
            },
            infiniteId: +new Date(),
            tm: null,
        }
    },
    computed: {
        auth_user() {
            return this.$store.getters["auth/user"];
        },
    },
    methods: {
        debounceSearchGroups() {
            clearTimeout(this.tm);
            this.tm = setTimeout(() => {
                this.searchGroups();
            }, 500);
        },
        searchGroups() {
            this.groups = [];
            this.filter.page = 1;
            this.infiniteId += 1;
        },
        async search($state) {
            const response  = await this.axios.post(`${process.env.timelineApiUrl}/group/search`, this.filter);
            if (response.data.status == 'Success') {
                let result = response.data.data
                if (result.current_page == 1) this.users = [];
                if(result.data.length) {
                    this.filter.page++;
                    this.groups.push(...result.data);
                    $state.loaded();
                } else {
                    $state.complete();
                }
            }
        },
    }

}
</script>
<style lang="scss" scoped>
    .input-container {
        position: relative;
        margin-bottom: 12px;
        input {
            padding-right: 30px;
            border: none;
            font-size: 14.4px;
        }
        svg {
            position: absolute;
            top: 9px;
            right: 9px;
            z-index: 1;
        }
    }
    .groups-wrapper {
        .group-item-container {
            margin-top: 20px;
            &:first-child {
                margin-top: 0;
            }
            &:last-child {
                border-bottom: 0;
                &::v-deep {
                    .group-item {
                        margin-bottom: 0;
                    }
                }
            }
        }
    }
    .fliconn-groups {
        width: 100%;
        max-width: 520px;
    }
</style>