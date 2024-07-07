<template>
    <div class="auto-grid">
        <div v-for="(item, index) in plans.filter(i => i.name != 'Custom')" :key="index">
            <div class="fp-card plan-card" :class="{
                'current-plan': current === item.id,
                'favorite': item.name === 'Gold'
            }">
                <div v-if="item.name === 'Gold'" class="fav"></div>
                <h5 class="plan-name text-center">{{ item.name }}</h5>
                <p class="plan-price text-center mb-2"><span class="price">${{ item.price }}</span> / Month</p>
                <p class="term mb-3">
                    <fa icon="check-circle" /> Add upto {{ item.max_items }} items
                </p>
                <p class="term mb-3">
                    <fa icon="check-circle" /> Upgrade anytime
                </p>
                <p class="term mb-5">
                    <fa icon="check-circle" /> Cancel anytime
                </p>
                <div class="text-center">
                    <button type="button" class="btn btn-block" :disabled="current === item.id" :class="{
                        'fp-btn-gradient': item.name !== 'Gold',
                        'btn-white': item.name === 'Gold',
                    }" @click="selectPlan(item)">
                        <span v-if="selected_id == item.id">
                            <fa icon="check-circle" /> Selected
                        </span>
                        <span v-else>{{ current === item.id ? 'Current Plan' : 'Subscribe' }}</span>
                    </button>
                </div>
            </div>
        </div>
        <div v-if="custom_plan">
            <div class="fp-card plan-card">
                <h5 class="plan-name text-center">Custom</h5>
                <p class="plan-price text-center mb-2"><span class="price">${{ custom_plan.price }}</span> / Month</p>
                <p class="form-inline mb-0 fp-text-color-main font-weight-400">
                    No.of Items
                    <span class="custom-plan-selector">
                        <select name="custom_plan" @change="changeCustomPlan($event)"
                            class="form-control form-control-sm has-bg">
                            <option v-for="(item, index) in plans.filter(i => i.name === 'Custom')" :key="index"
                                :value="item.id" :selected="item.id === custom_plan.id">
                                {{ item.max_items }}
                            </option>
                        </select>
                    </span>
                </p>
                <p class="term mb-5" style="margin-top: 42px;">
                    <fa icon="check-circle" /> Cancel anytime
                </p>
                <div>
                    <button type="button" class="btn btn-block" :disabled="current === custom_plan.id" :class="{
                        'fp-btn-primary': current === custom_plan.id,
                        'fp-btn-gradient': current != custom_plan.id,
                    }" @click="selectPlan(custom_plan)">
                        <span v-if="selected_id == custom_plan.id">
                            <fa icon="check-circle" /> Selected
                        </span>
                        <span v-else>{{ current === custom_plan.id ? 'Current Plan' : 'Subscribe' }}</span>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'Plans',
    props: ['current'],
    data() {
        return {
            plans: [],
            selected_id: null,
            custom_plan: null,
        }
    },
    mounted() {
        this.init()
    },
    methods: {
        async init() {
            const response = await this.axios.get(`${process.env.adsApiUrl}/automotive/get_plans`)
            this.plans = response.data.data
            this.custom_plan = this.plans.filter(i => i.name === 'Custom')[0];
        },
        selectPlan(item) {
            this.selected_id = item.id
            this.$emit('selected', item)
        },
        changeCustomPlan(event) {
            let plan = this.plans.find(i => i.id == event.target.value)
            this.custom_plan = plan
            this.selected_id = null
        }
    },
}
</script>
<style lang="scss" scoped>
.plan-card {
    font-weight: 500;
    position: relative;
    overflow: hidden;
    border-radius: 10px;
    padding: 20px 16px;

    &.favorite {
        border-radius: 10px;
        background-color: #FF22A1;
        color: #FFF;

        .term {
            color: #FFF;

            svg {
                color: #FFF;
            }
        }
    }

    .fav {
        position: absolute;
        top: -21px;
        right: 13px;
        transform: rotate(-45deg);
        background-color: #FDFF9A;
        color: #FFF;
        width: 22px;
        height: 91px;
    }

    .plan-name {
        font-size: 16px;
        margin-bottom: 5px;
    }

    .plan-price {
        font-size: 13px;
        font-weight: 400;

        .price {
            font-size: 20px;
            font-weight: 500;
        }
    }

    .term {
        font-size: 14.4px;
        color: #64748B;
        font-weight: 400;
    }

    .btn-white {
        color: #FF22A1;

        &:hover {
            background-color: #FF22A1;
            color: #FFF;
            border-color: #FFF;
        }
    }

    &.favorite {
        .btn-white {
            color: #FFF;
            border-color: #FFF;

            &:hover {
                background-color: #FF22A1;
                color: #FFF;
                border-color: #FFF;
            }
        }
    }
}

.auto-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    transition: all .35s ease 0s;
    gap: 0.75rem;
}

.custom-plan-selector {
    position: relative;
    margin-left: 4px;

    select {
        appearance: none;
        -webkit-appearance: none;
        -moz-appearance: none;
        padding-right: 16px;
    }

    &::after {
        content: '\25BC';
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        font-size: 10px;
        color: #C6C6C6;
        padding: 8px 6px;
        pointer-events: none;
    }
}</style>