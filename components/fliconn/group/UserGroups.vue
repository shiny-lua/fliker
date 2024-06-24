<template>
    <div>
        <h6 v-if="groups.length" class="mb-3">You Created</h6>
        <div v-if="groups.length" class="row mx-n1">
            <div
                v-for="(item, index) in groups"
                :key="index"
                class="col-6 px-1"
            >
                <group-item
                    :group="item"
                    class="mini"
                ></group-item>
            </div>
        </div>
    </div>
</template>
<script>
import GroupItem from './GroupItem.vue'
export default {
    name: 'UserGroups',
    props: ['type'],
    components: {
        GroupItem,
    },
    data() {
        return {
            groups: [],
        }
    },
    computed: {
        auth_user() {
            return this.$store.getters["auth/user"];
        },
    },
    async mounted() {
        const response = await this.axios.post(`${process.env.timelineApiUrl}/group/get_user_groups`, {user_id: this.auth_user.id, type: this.type})
        this.groups = response.data.data
    }
}
</script>
<style lang="scss" scoped>
    .groups-list {
        .group-item-container:last-child {
            &::v-deep {
                .group-item {
                    border-bottom: none;
                }
            }
        }
    }
</style>