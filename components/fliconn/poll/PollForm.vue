<template>
    <form class="poll-form position-relative" @submit.prevent="submit">
        <h5 class="text-center mb-0 d-none d-md-block">Create a Poll</h5>
        <hr class="my-3 mx-1" />
        <div class="inputs-wrapper nice-scrollbar pt-1 px-1">
            <textarea v-model="form.detail" rows="2" class="form-control mb-3"
                      placeholder="Write about poll in few words..." maxlength="500" required></textarea>
            <textarea v-model="form.question" rows="2" class="form-control mb-3" placeholder="Add poll question"
                      maxlength="250" required></textarea>
            <div class="d-flex align-items-center mb-2">
                <h6 class="mb-0 fp-fs-sm-13">Add choices <span class="fp-text-color-main">(Up to 10)</span></h6>
                <label class="ml-auto d-flex align-items-center mb-0 fp-fs-sm-13" for="allow_multiple_choices">
                    Allow Multiple Choices
                    <div class="custom-control custom-switch ml-2">
                        <input v-model="form.allow_multiple_choices" type="checkbox" class="custom-control-input"
                               id="allow_multiple_choices">
                        <label class="custom-control-label" for="allow_multiple_choices"></label>
                    </div>
                </label>
            </div>
            <div class="choices">
                <div v-for="(item, index) in form.choices" :key="index" class="input-container mb-3 position-relative">
                    <input v-model="form.choices[index]" type="text" class="form-control"
                           :placeholder="`Choice ${index + 1}`" maxlength="250" required />
                    <a v-if="index > 1" href="javascript:;" class="btn-remove-choice" tabindex="-1"
                       @click.prevent="removeChoice(index)">
                        <fp-icon name="close-1" class="fp-fs-18 fp-text-color=main" />
                    </a>
                </div>
                <a v-if="form.choices.length < 10" href="javascript:;" class="btn-add-choice" @click.prevent="addChoice()">
                    <fp-icon name="plus" class="fp-fs-16" style="margin-top: -1px;" />
                    Add choice
                </a>
                <span v-else class="font-italic text-muted">Max allowed 10 choices only.</span>
            </div>
        </div>
        <div class="d-flex align-items-center">
            <div class="poll-expire ml-auto">
                <datepicker v-model="form.expires_at" :disabled-dates="disabledDates" :input-class="{
                    'form-control': true,
                }" format="MM/dd/yyyy" placeholder="Expires on"></datepicker>
                <fp-icon name="calendar-1" class="fp-fs-18 fp-text-color-main" />
            </div>
            <button type="submit" class="btn fp-btn-gradient px-3 px-md-4 ml-2" :class="form.busy && 'btn-loading'"
                    :disabled="form.busy">Post</button>
        </div>
    </form>
</template>
<script>
import Form from "vform";
import Datepicker from "vuejs-datepicker";
export default {
    name: 'PollForm',
    props: {
        mode: { type: String, default: 'add' },
    },
    components: {
        Datepicker,
    },
    data() {
        return {
            form: new Form({
                detail: '',
                question: '',
                allow_multiple_choices: false,
                expires_at: '',
                choices: [
                    '',
                    '',
                ]
            }),
        }
    },
    computed: {
        disabledDates() {
            return {
                to: new Date(new Date().setDate(new Date().getDate() - 1)),
            }
        },
    },
    methods: {
        addChoice() {
            if (this.form.choices.length === 10) {
                this.$toast.error('You must add up to 10 choices.');
                return;
            }
            this.form.choices.push('');
        },
        removeChoice(index) {
            if (this.form.choices.length === 2) return;
            this.form.choices.splice(index, 1);
        },
        async submit() {
            try {
                console.log(this.form.choices)
                const uniqueChoices = new Set(this.form.choices);
                if (uniqueChoices.size !== this.form.choices.length) {
                    this.$toast.error("Choices must be equal.");
                    return
                }

                const response = await this.form.post(`${process.env.timelineApiUrl}/poll/save`);
                if (response.data.status === 'Success') {
                    this.form.reset();
                    const message = this.mode === 'edit' ? 'Your poll has been modified successfully!' : 'Your poll has been created successfully!';
                    this.$fpSuccess(message);
                    this.$router.push({ name: 'index', query: { tab: 'timeline' } });
                }
            } catch (error) {
                console.log(error)
                this.$toast.error('Something went wrong while create a poll. Please try again later.');
            }
        },
    }
}
</script>
<style lang="scss" scoped>
.inputs-wrapper {
    @media (min-width: 601px) {
        max-height: 340px;
        overflow-y: auto;
        overflow-x: visible;
    }
}

.btn-remove-choice {
    position: absolute;
    top: 8px;
    right: 8px;
}

.poll-expire {
    position: relative;

    &::v-deep {
        .vdp-datepicker {
            width: 130px;

            .vdp-datepicker__calendar {
                right: 0;
            }
        }
    }

    svg {
        position: absolute;
        top: 10px;
        right: 8px;
    }
}

.btn-add-choice {
    display: inline-block;
    color: #FF22A1;
    background-color: rgba(255, 34, 161, 0.102);
    border-radius: 28px;
    padding: 4px 12px;
    font-size: 13.6px;
    font-weight: 400;
}
</style>