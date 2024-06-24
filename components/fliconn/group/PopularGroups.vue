<template>
    <div class="popular-groups mt-2">
        <h6 v-if="groups.length" class="mb-3">Popular Groups and Pages</h6>
        <div v-if="groups.length" class="row mx-n1">
            <div
                v-for="(item, index) in groups"
                :key="index"
                class="col-6 px-1 popular-item"
            >
                <group-item
                    :group="item"
                    :mini="true"
                ></group-item>
            </div>
        </div>
    </div>
</template>
<script>
import GroupItem from './GroupItem.vue'
export default {
    name: 'PopularGroups',
    components: {
        GroupItem,
    },
    data() {
        return {
            groups: [],
        }
    },
    mounted() {
        this.getGroups()
    },
    methods: {
        async getGroups() {
            let params = {
                order_by: 'joined',
                is_popular: true,
                page: 1,
            };
            const response = await this.axios.post(`${process.env.timelineApiUrl}/group/search`, params)
            this.groups = response.data.data.data
        },
    }
}
</script>
<style lang="scss" scoped>
    .popular-item {
        &::v-deep {
            .btn-join, .img-user {
                display: none;
            }
        }
        &:last-child::v-deep {
            .group-item {
                border-bottom: none;
            }
        }
    }
</style>