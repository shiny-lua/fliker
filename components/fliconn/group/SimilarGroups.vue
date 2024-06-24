<template>
    <div>
        <h6 v-if="groups.length" class="mb-3">
            Similar {{ type === "group" ? "Groups" : "Pages" }}
        </h6>
        <div v-if="groups.length" class="row mx-n1">
            <div v-for="(item, index) in groups" :key="index" class="col-12 px-1">
                <group-item :group="item" class="round-10 similar-group"></group-item>
            </div>
            <div v-if="groups.length > 5">
                <router-link
                    :to="{
                        name: 'index',
                        query: { tab: 'groups_pages', type: type, keyword: keyword },
                    }"
                >
                    more groups..
                </router-link>
            </div>
        </div>
    </div>
</template>
<script>
    import GroupItem from "./GroupItem.vue";
    export default {
        name: "SimilarGroups",
        props: ["group_id", "type"],
        components: {
            GroupItem,
        },
        data() {
            return {
                groups: [],
                keyword: "",
            };
        },
        mounted() {
            this.getSimilarGroups();
        },
        methods: {
            async getSimilarGroups() {
                const response = await this.axios.post(`${process.env.timelineApiUrl}/group/get_similar_groups`, { group_id: this.group_id });
                this.groups = response.data.data.data;
                this.keyword = response.data.data.keyword;
            },
        },
    };
</script>
