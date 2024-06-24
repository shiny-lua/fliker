<template>
    <div class="timeline-form-container pt-3 h-100">
        <fliconn-form :mode="mode"
             :group_id="group_id"
             :id="id"
        />
    </div>
</template>
<script>
    import FliconnForm from "~/components/fliconn/timeline/TimelineForm.vue";
    export default {
        name: "TimelineCreate",
        middleware: "auth",
        components: {
            FliconnForm,
        },
        data() {
            return {
                group_id: this.$route.query.group_id,
                mode: this.$route.query.id ? 'edit' : 'add',
                id: this.$route.query.id,
            };
        },
    };
</script>
