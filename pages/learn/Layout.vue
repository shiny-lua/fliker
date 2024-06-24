 <template>
    <div class="pt-2 pt-md-4">
        <div class="learning-layout d-md-flex">
            <div class="learn-menu fp-card d-none d-md-block">
                <learn-menu />
            </div>
            <div class="panel flex-grow-1 fp-card fp-sm-no-card ml-md-3 p-md-4">
                <transition name="fade" mode="out-in">
                    <router-view />
                </transition>
            </div>
        </div>
    </div>
</template>
<script>
import LearnMenu from "./Menu.vue"
export default {
    name: 'LearnLayout',
    components: {
        LearnMenu,
    },
}
</script>
<style lang="scss" scoped>
    .learning-layout {
        @media (min-width: 601px) {
            margin-bottom: 70px;
            .learn-menu {
                width: 240px;
                min-width: 240px;
            }
        }
        &::v-deep {
            .page-title {
                font-size: 24px;
                @media (max-width: 600px) {
                    font-size: 16px;
                }
            }
            .learning-content {
                white-space: pre-line;
                font-size: 14.4px;
                line-height: 1.6;
                @media (max-width: 600px) {
                    font-size: 13.6px;
                }
            }
        }
    }
</style>