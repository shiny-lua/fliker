<template>
    <div class="poll-form-container">
        <poll-form />
        <portal to="mobile-page-title">
            <h6 class="mb-0 mobile-page-title">Craete a Poll</h6>
        </portal>
    </div>
</template>
<script>
import PollForm from "~/components/fliconn/poll/PollForm.vue";
export default {
    name: 'CreatePoll',
    components: {
        PollForm,
    }
}
</script>