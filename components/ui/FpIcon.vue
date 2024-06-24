<template>
    <component :is="require(`@/assets/icons/${name}.svg?inline`)"
        @click="$emit('click', $event)"
    />
</template>
<script>
    export default {
        name: "FpIcon",
        props: {
            name: { type: String, required: true }
        },
    }
</script>

<style lang="scss" scoped>
    @keyframes rotate {
        from {
            transform: rotate(0deg);
        }
        to {
            transform: rotate(359deg);
        }
    }
    svg {
        height: 1em;
        width: auto;
        display: inline-block;
        &::v-deep {
            path, rect {
                &.fp-icon-stroke-none {
                    stroke: none;
                }
                &.fp-icon-fill-none {
                    fill: none;
                }
                &.fp-icon-stroke {
                    stroke: #64748B;
                }
                &.fp-icon-fill {
                    fill: #64748B;
                }
            }
            .rotating {
                animation: rotate 10s linear infinite;
                transform-origin: center center;
            }
        }
    }

    [data-theme=dark] {
        svg {
            &::v-deep {
                path {
                    .fp-icon-stroke {
                        stroke: #8598B2;
                    }
                    .fp-icon-fill {
                        fill: #8598B2;
                    }
                }
            }
        }
    }
</style>