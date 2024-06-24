<template>
    <div class="recomment-groups" :class="groups.length === 0 && 'd-none'">
        <group-item-card v-for="(group, index) in groups"
             :key="index"
             :group="group"
             class="mb-3"
             @joined="init()"
        />
    </div>
</template>
<script>
import GroupItemCard from './GroupItemCard.vue';
export default {
    name: 'RecommendGroup',
    props: {
        type: { type: String, default: 'group' },
    },
    components: {
        GroupItemCard,
    },
    data() {
        return {
            groups: [],
        }
    },
    watch: {
        type() {
            this.init();
        }
    },
    mounted() {
        this.init();
    },
    methods: {
        async init() {
            const response = await this.axios.post(`${process.env.timelineApiUrl}/group/get_recommends`, {type: this.type});
            this.groups = response.data.data;
        }
    }
}
</script>