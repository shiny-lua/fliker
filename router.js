import Vue from "vue";
import Router from "vue-router";
import { scrollBehavior } from "~/utils";

Vue.use(Router);

const page = (path) => () =>
  import(`~/pages/${path}`).then((m) => m.default || m);

const routes = [
  // {
  //   path: "/",
  //   redirect: "/ads",
  // },
  { path: "/test", name: "test", component: page("TestPage.vue") },
  { path: "/ads", name: "ads", component: page("ads/AdsIndex.vue") },

  { path: "/login", name: "login", component: page("auth/login.vue") },
  { path: "/register", name: "register", component: page("auth/register.vue") },
  {
    path: "/social_login",
    name: "SocialSignup",
    component: page("auth/SocialSignup.vue"),
  },
  {
    path: "/password/reset",
    name: "password.request",
    component: page("auth/password/ForgotPassword.vue"),
  },
  {
    path: "/username/reset",
    name: "username.request",
    component: page("auth/password/ForgotUsername.vue"),
  },
  {
    path: "/username/show",
    name: "username.show",
    component: page("auth/password/ShowUsername.vue"),
  },
  {
    path: "/password/reset/:token",
    name: "password.reset",
    component: page("auth/password/ResetPassword.vue"),
  },
  {
    path: "/email/verify/:id",
    name: "verification.verify",
    component: page("auth/verification/verify.vue"),
  },
  {
    path: "/email/resend",
    name: "verification.resend",
    component: page("auth/verification/resend.vue"),
  },

  { path: "/ads/add", name: "ads.add", component: page("ads/AddPost.vue") },
  {
    path: "/ads/edit/:id",
    name: "ads.edit",
    component: page("ads/EditPost.vue"),
  },
  {
    path: "/ads/detail/:slug",
    name: "ads.detail",
    component: page("ads/PostDetail.vue"),
  },
  {
    path: "/ads/activate",
    name: "ads.activate",
    component: page("ads/Activate.vue"),
  },

  {
    path: "/topics",
    name: "topic",
    component: page("topic/TopicIndex.vue"),
  },
  {
    path: "/topics/detail/:slug",
    name: "topic.detail",
    component: page("topic/PostDetail.vue"),
  },
  {
    path: "/topics/post",
    name: "topic.post",
    component: page("topic/CreatePost.vue"),
  },
  {
    path: "/topics/edit/:id",
    name: "topic.edit",
    component: page("topic/EditPost.vue"),
  },
  {
    path: "/topics/create_topic",
    name: "topic.create_topic",
    component: page("topic/CreateTopic.vue"),
  },
  {
    path: "/topics/topic_detail/:slug",
    name: "topic.topic_detail",
    component: page("topic/TopicDetail.vue"),
  },

  {
    path: "/",
    name: "index",
    component: page("fliconn/FliconnIndex.vue"),
  },

  {
    path: "/fliconn/create",
    component: page("fliconn/FliconnCreate.vue"),
    children: [
      { path: "", redirect: { name: "fliconn.create.timeline" } },
      {
        path: "timeline",
        name: "fliconn.create.timeline",
        component: page("fliconn/timeline/TimelineCreate.vue"),
      },
      {
        path: "status_story",
        name: "fliconn.create.status",
        component: page("fliconn/status/StatusCreate.vue"),
      },
      {
        path: "short_flick",
        name: "fliconn.create.clips",
        component: page("fliconn/clips/ClipsCreate.vue"),
      },
      {
        path: "poll",
        name: "fliconn.create.poll",
        component: page("fliconn/poll/PollCreate.vue"),
      },
    ],
  },
  {
    path: "/fliconn/timeline/detail/:id",
    name: "fliconn.timeline.detail",
    component: page("fliconn/timeline/TimelineDetail.vue"),
  },
  {
    path: "/fliconn/users",
    name: "fliconn.users",
    component: page("fliconn/FliconnUsers.vue"),
  },
  {
    path: "/fliconn/profile/:username",
    name: "fliconn.profile",
    component: page("fliconn/FliconnProfile.vue"),
  },

  /////// Channel

  {
    path: "/fliconn/channel/detail/:slug",
    name: "channel.detail",
    component: page("fliconn/channel/ChannelDetail.vue"),
  },

  {
    path: "/fliconn/channel/search",
    name: "channel.search",
    component: page("fliconn/channel/SearchChannel.vue"),
  },
  {
    path: "/fliconn/channel/create",
    name: "fliconn.channel.create",
    component: page("fliconn/channel/CreateChannel.vue"),
  },
  {
    path: "/fliconn/channel/edit/:id",
    name: "fliconn.channel.edit",
    component: page("fliconn/channel/EditChannel.vue"),
  },
  {
    path: "/fliconn/channel/post/create/:channel_id",
    name: "fliconn.channel.create_post",
    component: page("fliconn/channel/CreatePost.vue"),
  },
  {
    path: "/fliconn/channel/post/edit/:id",
    name: "fliconn.channel.edit_post",
    component: page("fliconn/channel/EditPost.vue"),
  },
  {
    path: "/fliconn/channel/post/detail/:slug",
    name: "fliconn.channel.post_detail",
    component: page("fliconn/channel/PostDetail.vue"),
  },

  ////// Group
  {
    path: "/fliconn/group/detail/:slug",
    name: "group.detail",
    component: page("fliconn/group/GroupDetail.vue"),
  },
  {
    path: "/fliconn/group/search/:type",
    name: "group.search",
    component: page("fliconn/group/SearchGroup.vue"),
  },
  {
    path: "/fliconn/:type/create",
    name: "fliconn.group.create",
    component: page("fliconn/group/CreateGroup.vue"),
  },
  {
    path: "/fliconn/group/edit/:id",
    name: "fliconn.group.edit",
    component: page("fliconn/group/EditGroup.vue"),
  },

  {
    path: "/fliconn/test_camera",
    name: "test_camera",
    component: page("fliconn/TestCamera.vue"),
  },

  // Merchant Offers

  {
    path: "/merchant/promote",
    name: "merchant.promote",
    component: page("fliconn/merchant/Promote.vue"),
  },
  {
    path: "/merchant/create",
    name: "merchant.create",
    component: page("fliconn/merchant/CreateMerchant.vue"),
  },
  {
    path: "/merchant/edit/:id",
    name: "merchant.edit",
    component: page("fliconn/merchant/EditMerchant.vue"),
  },
  {
    path: "/merchant/create_offer",
    name: "merchant.create_offer",
    component: page("fliconn/merchant/CreateOffer.vue"),
  },
  {
    path: "/merchant/edit_offer/:id",
    name: "merchant.edit_offer",
    component: page("fliconn/merchant/EditOffer.vue"),
  },
  {
    path: "/merchant/profile/:slug?",
    name: "merchant.profile",
    component: page("fliconn/merchant/MerchantProfile.vue"),
  },

  {
    path: "/automotive/seller_profile_form",
    name: "automotive.seller_profile_form",
    component: page("automotive/SellerProfileForm.vue"),
  },
  {
    path: "/automotive/subscribe",
    name: "automotive.subscribe",
    component: page("automotive/Subscribe.vue"),
  },
  {
    path: "/automotive/seller-profile/:slug?",
    name: "automotive.seller_profile",
    component: page("automotive/SellerProfile.vue"),
  },
  {
    path: "/automotive/create",
    name: "automotive.create",
    component: page("automotive/CreateAutomotive.vue"),
  },
  {
    path: "/automotive/edit/:id",
    name: "automotive.edit",
    component: page("automotive/EditInventory.vue"),
  },
  {
    path: "/automotive/detail/:id",
    name: "automotive.detail",
    component: page("automotive/InventoryDetail.vue"),
  },
  {
    path: "/automotive/post",
    name: "automotive.post",
    component: page("automotive/AddInventory.vue"),
  },
  {
    path: "/automotive/update_subscription",
    name: "automotive.update_subscription",
    component: page("automotive/UpdateSubscription.vue"),
  },

  {
    path: "/account",
    component: page("account/Account.vue"),
    children: [
      { path: "", redirect: { name: "account.fliconn" } },
      {
        path: "ads",
        name: "account.ads",
        component: page("account/Ads.vue"),
      },
      {
        path: "topics",
        name: "account.topics",
        component: page("account/Topics.vue"),
      },
      {
        path: "messages",
        name: "account.messages",
        component: page("account/Messages.vue"),
      },
      {
        path: "notifications",
        name: "account.notifications",
        component: page("account/Notifications.vue"),
      },
      {
        path: "activity_privacy",
        component: page("account/ActivityPrivacy.vue"),
        children: [
          {
            path: "",
            redirect: { name: "account.activity_privacy.login_activity" },
          },
          {
            path: "login_activity",
            name: "account.activity_privacy.login_activity",
            component: page("account/LoginActivity.vue"),
          },
          {
            path: "privacy_center",
            name: "account.activity_privacy.privacy_center",
            component: page("account/PrivacyCenter.vue"),
          },
          {
            path: "active_sessions",
            name: "account.activity_privacy.active_sessions",
            component: page("account/ActiveSessions.vue"),
          },
        ],
      },
      {
        path: "change_password",
        name: "account.change_password",
        component: page("account/ChangePassword.vue"),
      },
    ],
  },
  {
    path: "/settings",
    component: page("settings/Layout.vue"),
    children: [
      { path: "", redirect: { name: "settings.basic_information" } },
      {
        path: "basic_information",
        name: "settings.basic_information",
        component: page("settings/BasicInformation.vue"),
      },
      {
        path: "change_password",
        name: "settings.change_password",
        component: page("settings/ChangePassword.vue"),
      },
      {
        path: "deactivate_delete",
        name: "settings.deactivate",
        component: page("settings/Deactivate.vue"),
      },
      {
        path: "profile_access",
        name: "settings.profile_access",
        component: page("settings/ProfileAccess.vue"),
      },
      {
        path: "classified_ads",
        name: "settings.classified_ads",
        component: page("settings/ClassifiedAds.vue"),
      },
      {
        path: "communication",
        name: "settings.communication",
        component: page("settings/Communication.vue"),
      },
      {
        path: "notifications",
        name: "settings.notifications",
        component: page("settings/Notifications.vue"),
      },
    ],
  },
  { path: "/more", name: "more", component: page("More.vue") },
  {
    path: "/more/manage",
    name: "more.manage",
    component: page("more/Manage.vue"),
  },
  {
    path: "/more/learn",
    name: "more.learn",
    component: page("more/Learn.vue"),
  },

  {
    path: "/choose_country",
    name: "choose_country",
    component: page("ChooseCountry.vue"),
  },

  {
    path: "/learn_m",
    name: "learn_mobile",
    component: page("learn/MobileIndex.vue"),
  },

  {
    path: "/learn",
    component: page("learn/Layout.vue"),
    children: [
      {
        path: "avoid_scams",
        name: "avoid_scams",
        component: page("learn/AvoidScams.vue"),
      },
      {
        path: "services_features",
        name: "services_features",
        component: page("learn/ServicesFeatures.vue"),
      },
      {
        path: "posting_tips",
        name: "posting_tips",
        component: page("learn/PostingTips.vue"),
      },
      {
        path: "report_scam_issue",
        name: "report_scam_issue",
        component: page("learn/ReportScamIssue.vue"),
      },
      {
        path: "prohibited",
        name: "prohibited",
        component: page("learn/Prohibited.vue"),
      },
      {
        path: "about_us",
        name: "about_us",
        component: page("learn/AboutUs.vue"),
      },
      {
        path: "contact_us",
        name: "contact_us",
        component: page("learn/ContactUs.vue"),
      },
      {
        path: "report_us",
        name: "report_us",
        component: page("learn/ReportUs.vue"),
      },
      {
        path: "careers",
        name: "careers",
        component: page("learn/Careers.vue"),
      },
      {
        path: "privacy_policies",
        name: "privacy_policies",
        component: page("learn/PrivacyPolicies.vue"),
      },
      {
        path: "terms_of_use",
        name: "terms_of_use",
        component: page("learn/TermsOfUse.vue"),
      },
      {
        path: "account_settings",
        name: "account_settings",
        component: page("learn/AccountSettings.vue"),
      },
      {
        path: "faqs",
        name: "faqs",
        component: page("learn/FAQs.vue"),
      },
      {
        path: "platform_terms",
        name: "platform_terms",
        component: page("learn/PlatformTerms.vue"),
      },
      {
        path: "safety_guide",
        name: "safety_guide",
        component: page("learn/SafetyGuide.vue"),
      },
      {
        path: "you_and_app",
        name: "you_and_app",
        component: page("learn/YouAndApp.vue"),
      },
      {
        path: "data_policy",
        name: "data_policy",
        component: page("learn/DataPolicy.vue"),
      },
      {
        path: "cookies",
        name: "cookies",
        component: page("learn/Cookies.vue"),
      },
      {
        path: "payments_and_refunds",
        name: "payments_and_refunds",
        component: page("learn/PaymentsRefunds.vue"),
      },
      {
        path: "platform_gaurantee",
        name: "platform_gaurantee",
        component: page("learn/PlatformGaurantee.vue"),
      },
      {
        path: "platform_funding",
        name: "platform_funding",
        component: page("learn/PlatformFunding.vue"),
      },
    ],
  },
];

export function createRouter() {
  return new Router({
    routes,
    scrollBehavior,
    mode: "history",
  });
}
