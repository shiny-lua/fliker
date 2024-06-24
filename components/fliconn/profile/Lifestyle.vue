<template>
    <div>
        <div class="lifestyle mt-3">
            <div v-if="user && user.is_profile_locked" class="text-center fp-text-color-main mt-2">
                <p>{{ user.name }} has locked their profile!</p>
            </div>
            <div v-else>
                <div class="mb-3">
                    <h6 class="sub_title">
                        <fp-icon name="activity" class="fp-fs-22 fp-text-color-main" />
                        Activities
                        <a v-if="auth_user && user.id === auth_user.id" href="javascript:;" class="btn-add-lifestyle" @click.prevent="$modal.show('lifestyleActivityModal')">
                            + Add
                        </a>
                    </h6>
                    <div v-if="profile.lifestyle_activities.length">
                        <span v-for="item in profile.lifestyle_activities" :key="item.id" class="activity-item selected">{{ item.name }}</span>
                    </div>
                    <p v-else class="fp-text-color-main text-center">Not added</p>
                </div>
                <div class="mb-3">
                    <h6 class="sub_title">
                        <fp-icon name="hobby" class="fp-fs-22 fp-text-color-main" />
                        Hobbies
                        <a v-if="auth_user && user.id === auth_user.id" href="javascript:;" class="btn-add-lifestyle" @click.prevent="$modal.show('lifestyleHobbyModal')">
                            + Add
                        </a>
                    </h6>
                    <div v-if="profile.lifestyle_hobbies.length">
                        <span v-for="item in profile.lifestyle_hobbies" :key="item.id" class="activity-item selected">{{ item.name }}</span>
                    </div>
                    <p v-else class="fp-text-color-main text-center">Not added</p>
                </div>
                <div class="mb-3">
                    <h6 class="sub_title">
                        <fp-icon name="achievement" class="fp-fs-22 fp-text-color-main" />
                        Achievements
                        <a v-if="auth_user && user.id === auth_user.id" href="javascript:;" class="btn-add-lifestyle" @click.prevent="$modal.show('lifestyleAchievementModal')">
                            + Add
                        </a>
                    </h6>
                    <div v-if="profile.lifestyle_achievements && profile.lifestyle_achievements.length">
                        <span v-for="(item, index) in profile.lifestyle_achievements" :key="index" class="activity-item selected">
                            <fp-icon :name="item.icon" class="fp-fs-20" />
                            {{ item.name }}
                        </span>
                    </div>
                    <p v-else class="fp-text-color-main text-center">Not added</p>
                </div>
                <div>
                    <h6 class="sub_title">
                        <fp-icon name="game-sports" class="fp-fs-22 fp-text-color-main" />
                        Games/Sports
                        <a v-if="auth_user && user.id === auth_user.id"
                             href="javascript:;"
                             class="btn-add-lifestyle"
                             @click.prevent="$modal.show('lifestyleGameSportModal')"
                        >+ Add</a>
                    </h6>
                    <div v-if="profile.lifestyle_game_sports.length">
                        <span v-for="item in profile.lifestyle_game_sports" :key="item.id" class="activity-item selected">{{ item.name }}</span>
                    </div>
                    <p v-else class="fp-text-color-main text-center">Not added</p>
                </div>
            </div>
        </div>
        <!-- Modals -->
        <fp-modal name="lifestyleActivityModal" :show-header="false">
            <h5 class="text-center">Your Top 5 Activities</h5>
            <div v-if="activities.length" class="selected-activity-item">
                <span v-for="(item, index) in activity_form.items"
                     :key="index"
                     class="activity-item selected"
                >
                    <span v-if="activities.find(i => i.id === item)">{{ activities.find(i => i.id === item).name }}</span>
                    <fp-icon name="times" class="btn-remove" @click="activity_form.items.splice(index, 1)" />
                </span>
            </div>
            <hr class="mx-n3 fp-bg-color-3">
            <div class="text-center mb-4">
                <form class="input-lifestyle" ref="addActivityForm" @submit.prevent="addActivity">
                    <input type="text" name="name" class="form-control" maxlength="30" required placeholder="Add your own..." />
                    <button type="submit" class="btn fp-btn-gradient px-3 ml-2">
                        Add
                    </button>
                </form>
            </div>
            <div class="item-container">
                <span v-for="(item, index) in activities"
                     :key="index"
                     class="activity-item"
                     :class="activity_form.items.includes(item.id) && 'd-none'"
                     @click="selectActivity(item)"
                >
                    {{ item.name }}
                </span>
            </div>
            <div class="text-center">
                <button type="button" class="btn fp-btn-gradient px-4" :class="activity_form.busy && 'btn-loading'" @click="saveActivity" :disabled="activity_form.busy">
                    Save
                </button>
            </div>
        </fp-modal>
        <fp-modal name="lifestyleHobbyModal"
             :show-header="false"
        >
            <h5 class="text-center">Your Top 5 Hobbies</h5>
            <div v-if="hobbies.length" class="selected-activity-item">
                <span v-for="(item, index) in hobby_form.items"
                     :key="index"
                     class="activity-item selected"
                >
                    <span v-if="hobbies.find(i => i.id === item)">{{ hobbies.find(i => i.id === item).name }}</span>
                    <fp-icon name="times" class="btn-remove" @click="hobby_form.items.splice(index, 1)" />
                </span>
            </div>
            <hr class="mx-n3 fp-bg-color-3">
            <div class="text-center mb-4">
                <form class="input-lifestyle" ref="addHobbyForm" @submit.prevent="addHobby">
                    <input type="text" name="name" class="form-control" maxlength="30" required placeholder="Add your own..." />
                    <button type="submit" class="btn fp-btn-gradient px-3 ml-2">
                        Add
                    </button>
                </form>
            </div>
            <div class="item-container">
                <span v-for="(item, index) in hobbies"
                     :key="index"
                     class="activity-item"
                     :class="hobby_form.items.includes(item.id) && 'd-none'"
                     @click="selectHobby(item)"
                >
                    {{ item.name }}
                </span>
            </div>
            <div class="text-center">
                <button type="button" class="btn fp-btn-gradient px-4" :class="hobby_form.busy && 'btn-loading'" @click="saveHobby" :disabled="hobby_form.busy">
                    Save
                </button>
            </div>
        </fp-modal>
        <fp-modal name="lifestyleGameSportModal"
             :show-header="false"
        >
            <h5 class="text-center">Your Top 5 Game/Sports</h5>
            <div v-if="game_sports.length" class="selected-activity-item">
                <span v-for="(item, index) in game_sport_form.items"
                     :key="index"
                     class="activity-item selected"
                >
                    <span v-if="game_sports.find(i => i.id === item)">{{ game_sports.find(i => i.id === item).name }}</span>
                    <fp-icon name="times" class="btn-remove" @click="game_sport_form.items.splice(index, 1)" />
                </span>
            </div>
            <hr class="mx-n3 fp-bg-color-3">
            <div class="text-center mb-2">
                <form class="input-lifestyle" ref="addGameSportForm" @submit.prevent="addGameSport">
                    <input type="text" name="name" class="form-control" maxlength="30" required placeholder="Add your own..." />
                    <button type="submit" class="btn fp-btn-gradient px-3 ml-2">
                        Add
                    </button>
                </form>
            </div>
            <div class="item-container">
                <span v-for="(item, index) in game_sports"
                     :key="index"
                     class="activity-item"
                     :class="game_sport_form.items.includes(item.id) && 'd-none'"
                     @click="selectGameSport(item)"
                >
                    {{ item.name }}
                </span>
            </div>
            <div class="text-center">
                <button type="button" class="btn fp-btn-gradient px-4" :class="game_sport_form.busy && 'btn-loading'" @click="saveGameSport" :disabled="game_sport_form.busy">
                    Save
                </button>
            </div>
        </fp-modal>
        <fp-modal name="lifestyleAchievementModal" :show-header="false">
            <h5 class="text-center">Your Top 5 Achievements</h5>
            <div v-if="achievements.length" class="selected-activity-item">
                <span v-for="(item, index) in achievement_form.items"
                     :key="index"
                     class="activity-item selected"
                >
                    <fp-icon :name="achievements.find(i => i.id === item).icon" class="fp-fs-20 mt-n-2px" />
                    {{ achievements.find(i => i.id === item).name }}
                    <fp-icon name="times" class="btn-remove" @click="achievement_form.items.splice(index, 1)" />
                </span>
            </div>
            <hr class="mx-n3 fp-bg-color-3">
            <div class="text-center mb-4">
                <form class="input-lifestyle achievement-form" ref="addAchievementForm" @submit.prevent="addAchievement">
                    <div class="dropdown dropdown-achievement mr-2">
                        <a href="javascript:;" class="dropdown-toggle fp-border-color-1" data-toggle="dropdown">
                            <fp-icon :name="achievement_item.icon" class="fp-fs-22 fp-text-color-main" />
                        </a>
                        <div class="dropdown-menu">
                            <a href="javascript:;" class="dropdown-item fp-border-color-1" v-for="item in achievement_icons" :key="item" @click="achievement_item.icon = item">
                                <fp-icon :name="item" class="fp-fs-22 fp-text-color-main" />
                            </a>
                        </div>
                    </div>
                    <input v-model="achievement_item.name"
                        type="text"
                        name="name"
                        class="form-control"
                        maxlength="60"
                        required
                        placeholder="Ex. Running Championship"
                    />
                    <button type="submit" class="btn fp-btn-gradient px-3 ml-2">
                        Add
                    </button>
                </form>
            </div>
            <div class="item-container">
                <span v-for="(item, index) in achievements"
                     :key="index"
                     class="activity-item"
                     :class="achievement_form.items.includes(item.id) && 'd-none'"
                     @click="selectAchievement(item)"
                >
                    <fp-icon :name="item.icon" class="fp-fs-20 mt-n-2px" />
                    {{ item.name }}
                </span>
            </div>
            <div class="text-center">
                <button type="button" class="btn fp-btn-gradient px-4" :class="achievement_form.busy && 'btn-loading'" @click="saveAchievement" :disabled="achievement_form.busy">
                    Save
                </button>
            </div>
        </fp-modal>
    </div>
</template>
<script>
    import { mapGetters } from "vuex";
    import Form from "vform";
    import FpModal from "~/components/ui/Modal.vue";
    export default {
        name: "Lifestyle",
        props: ["user", "profile"],
        components: {
            FpModal,
        },
        data() {
            return {
                activities: [],
                hobbies: [],
                game_sports: [],
                achievements: [],
                activity_form: new Form({ profile_id: this.profile.id, items: [] }),
                hobby_form: new Form({ profile_id: this.profile.id, items: [] }),
                game_sport_form: new Form({ profile_id: this.profile.id, items: [] }),
                achievement_form: new Form({ profile_id: this.profile.id, items: [] }),
                showErrors: false,
                achievement_item: { icon: "first_prize", name: "" },
                achievement_icons: ["first_prize", "winner", "badge", "medal_first", "medal_second", "medal_third", "medal", "thumbs_up", "prize"],
            };
        },
        computed: mapGetters({
            auth_user: "auth/user",
        }),
        watch: {
            profile(value) {
                this.activity_form.items = value.lifestyle_activities.map((i) => i.id);
                this.hobby_form.items = value.lifestyle_hobbies.map((i) => i.id);
                this.game_sport_form.items = value.lifestyle_game_sports.map((i) => i.id);
            },
        },
        mounted() {
            this.loadData();
            this.activity_form.items = this.profile.lifestyle_activities.map((i) => i.id);
            this.hobby_form.items = this.profile.lifestyle_hobbies.map((i) => i.id);
            this.game_sport_form.items = this.profile.lifestyle_game_sports.map((i) => i.id);
            this.achievement_form.items = this.profile.lifestyle_achievements.map((i) => i.id);
        },
        methods: {
            async loadData() {
                const response = await this.axios.get(`${process.env.timelineApiUrl}/profile/get_lifestyle_data`);
                this.activities = response.data.data.activities;
                this.hobbies = response.data.data.hobbies;
                this.game_sports = response.data.data.game_sports;
                this.achievements = response.data.data.achievements;
            },
            async addActivity() {
                if (this.activity_form.items.length >= 5) {
                    this.$toast.error("Select up to 5 activities or less.");
                    return false;
                }
                const name = this.$refs.addActivityForm.name.value;
                if (this.activities.find((i) => i.name === name)) {
                    this.$toast.error("The activity is already exists. Please click it to select.");
                    return false;
                }
                const response = await this.axios.post(`${process.env.timelineApiUrl}/profile/lifestyle/save_activity`, { name });
                if (response.data.status === "Success") {
                    const result = response.data.data;
                    this.activities.push(result);
                    this.activity_form.items.push(result.id);
                }
                this.$refs.addActivityForm.reset();
            },
            selectActivity(item) {
                if (this.activity_form.items.includes(item.id)) {
                    const index = this.activity_form.items.findIndex((i) => i === item.id);
                    this.activity_form.items.splice(index, 1);
                } else {
                    if (this.activity_form.items.length >= 5) {
                        this.$toast.error("Select up to 5 activities or less.");
                        return false;
                    }
                    this.activity_form.items.push(item.id);
                }
            },
            async saveActivity() {
                const response = await this.activity_form.post(`${process.env.timelineApiUrl}/profile/lifestyle/add_activity`);
                if (response.data.status === "Success") {
                    this.$emit("updated");
                    this.$modal.hide("lifestyleActivityModal");
                }
            },
            // Hobby
            async addHobby() {
                if (this.hobby_form.items.length >= 5) {
                    this.$toast.error("Select up to 5 hobbies or less.");
                    return false;
                }
                const name = this.$refs.addHobbyForm.name.value;
                if (this.hobbies.find((i) => i.name === name)) {
                    this.$toast.error("The hobby is already exists. Please click it to select.");
                    return false;
                }
                const response = await this.axios.post(`${process.env.timelineApiUrl}/profile/lifestyle/save_hobby`, { name });
                if (response.data.status === "Success") {
                    const result = response.data.data;
                    this.hobbies.push(result);
                    this.hobby_form.items.push(result.id);
                }
                this.$refs.addHobbyForm.reset();
            },
            selectHobby(item) {
                if (this.hobby_form.items.includes(item.id)) {
                    const index = this.hobby_form.items.findIndex((i) => i === item.id);
                    this.hobby_form.items.splice(index, 1);
                } else {
                    if (this.hobby_form.items.length >= 5) {
                        this.$toast.error("Select up to 5 hobbies or less.");
                        return false;
                    }
                    this.hobby_form.items.push(item.id);
                }
            },
            async saveHobby() {
                const response = await this.hobby_form.post(`${process.env.timelineApiUrl}/profile/lifestyle/add_hobby`);
                if (response.data.status === "Success") {
                    this.$emit("updated");
                    this.$modal.hide("lifestyleHobbyModal");
                }
            },
            // Game Sport
            async addGameSport() {
                if (this.game_sport_form.items.length >= 5) {
                    this.$toast.error("Select up to 5 Games or Sports list.");
                    return false;
                }
                const name = this.$refs.addGameSportForm.name.value;
                if (this.game_sports.find((i) => i.name === name)) {
                    this.$toast.error("The game/sport is already exists. Please click it to select.");
                    return false;
                }
                const response = await this.axios.post(`${process.env.timelineApiUrl}/profile/lifestyle/save_game_sport`, { name });
                if (response.data.status === "Success") {
                    const result = response.data.data;
                    this.game_sports.push(result);
                    this.game_sport_form.items.push(result.id);
                }
                this.$refs.addGameSportForm.reset();
            },
            selectGameSport(item) {
                if (this.game_sport_form.items.includes(item.id)) {
                    const index = this.game_sport_form.items.findIndex((i) => i === item.id);
                    this.game_sport_form.items.splice(index, 1);
                } else {
                    if (this.game_sport_form.items.length >= 5) {
                        this.$toast.error("Select up to 5 Games or Sports list.");
                        return false;
                    }
                    this.game_sport_form.items.push(item.id);
                }
            },
            async saveGameSport() {
                const response = await this.game_sport_form.post(`${process.env.timelineApiUrl}/profile/lifestyle/add_game_sport`);
                if (response.data.status === "Success") {
                    this.$emit("updated");
                    this.$modal.hide("lifestyleGameSportModal");
                }
            },
            async saveAchievement() {
                const response = await this.achievement_form.post(`${process.env.timelineApiUrl}/profile/lifestyle/add_achievement`);
                if (response.data.status === "Success") {
                    this.$emit("updated");
                    this.$modal.hide("lifestyleAchievementModal");
                }
            },
            selectAchievement(item) {
                if (this.achievement_form.items.includes(item.id)) {
                    const index = this.achievement_form.items.findIndex((i) => i === item.id);
                    this.achievement_form.items.splice(index, 1);
                } else {
                    if (this.achievement_form.items.length >= 5) {
                        this.$toast.error("Select up to 5 Games or Sports list.");
                        return false;
                    }
                    this.achievement_form.items.push(item.id);
                }
            },
            async addAchievement() {
                if (this.achievement_form.items.length >= 5) {
                    this.$toast.error("Select up to 5 Achievement list.");
                    return false;
                }
                const name = this.achievement_item.name;
                const icon = this.achievement_item.icon;
                if (this.achievements.find((i) => i.name === name && i.icon === icon)) {
                    this.$toast.error("The achievement is already exists. Please click it to select.");
                    return false;
                }
                const response = await this.axios.post(`${process.env.timelineApiUrl}/profile/lifestyle/save_achievement`, this.achievement_item);
                if (response.data.status === "Success") {
                    const result = response.data.data;
                    this.achievements.push(result);
                    this.achievement_form.items.push(result.id);
                }
                this.achievement_item = { icon: "first_prize", name: "" };
            },
        },
    };
</script>
<style lang="scss" scoped>
    .sub_title {
        display: flex;
        align-items: center;
        font-size: 15px;
        font-weight: 500;
        svg {
            margin-right: 6px;
        }
    }
    .btn-add-lifestyle {
        margin-left: auto;
        border-radius: 50px;
        background: #FF22A114;
        padding: 3px 10px;
        font-size: 13px;
        font-weight: 400;
        color: #FF22A1;
        text-decoration: none;
        line-break: 15px;
    }
    .item-container {
        min-height: 150px;
    }
    .activity-item {
        color: #64748B;
        display: inline-block;
        font-size: 13.6px;
        border: solid 1px #ECF1F6;
        padding: 7px 12px;
        border-radius: 8px;
        margin-right: 12px;
        margin-top: 12px;
        cursor: pointer;
        &.selected {
            border-color: #FF22A1;
            background-color: #FF22A1;
            color: #fff !important;
            border: none !important;
            font-weight: 400;
        }
        img {
            margin-right: 4px;
        }
        .btn-remove {
            cursor: pointer;
            margin: -2px -4px 0 4px;
            font-size: 18px;
        }
    }
    .input-lifestyle {
        width: 250px;
        margin: auto;
        position: relative;
        display: flex;
        align-items: center;
        &.achievement-form {
            width: 63%;
        }
        &.place-form {
            width: 50%;
            img {
                position: absolute;
                left: 6px;
            }
            input {
                padding-left: 25px;
                max-width: 100%;
            }
        }
        @media (max-width: 600px) {
            width: 80%;
        }
        input {
            border-radius: 10px;
        }
    }
    .lifestyle-modal {
        position: relative;
        .btn-close {
            color: #999999;
            position: absolute;
            top: 4px;
            right: 10px;
        }
    }
    .dropdown-achievement {
        .dropdown-toggle {
            border-style: solid;
            border-width: 1px;
            border-radius: 10px;
            padding: 7px;
            display: inline-block;
            &::after {
                display: none;
            }
        }
        .dropdown-menu {
            padding: 10px 0 0 10px;
            border-radius: 10px;
            .dropdown-item {
                border-style: solid;
                border-width: 1px;
                border-radius: 10px;
                padding: 7px;
                display: inline-block;
                margin-right: 10px;
                margin-bottom: 10px;
                width: 38px;
            }
        }
    }
    [data-theme=dark] {
        .activity-item {
            border: 1px solid #334557;
            color: #8598B2;
        }
    }
</style>
