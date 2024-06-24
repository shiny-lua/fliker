require('dotenv').config()
export default {
  ssr: false,

  env: {
    appName: process.env.APP_NAME || 'FlickerPage',
    serverUrl: process.env.APP_URL,
    authApiUrl: process.env.AUTH_API_URL,
    adsApiUrl: process.env.ADS_API_URL,
    topicsApiUrl: process.env.TOPICS_API_URL,
    timelineApiUrl: process.env.TIMELINE_API_URL,
    clipsApiUrl: process.env.CLIPS_API_URL,
    chatApiUrl: process.env.CHAT_API_URL,
    merchantApiUrl: process.env.MERCHANT_API_URL,
    discoverApiUrl: process.env.DISCOVER_API_URL,
    stripeKey: process.env.STRIPE_KEY,
  },

  head: {
    title: process.env.APP_NAME,
    titleTemplate: '%s - ' + process.env.APP_NAME,
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'FlickerPage' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  router: {
    middleware: ['check-auth']
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    { src: '~assets/scss/app.scss', lang: 'scss' }
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '~plugins/vform',
    '~plugins/axios',
    '~plugins/fontawesome',
    '~plugins/nuxt-client-init',
    '~plugins/custom.js',
    '~plugins/n-formatter.js',
    '~/plugins/event-bus.js',
    { src: '~plugins/loading', mode: 'client' },
    { src: '~plugins/fp-alert', mode: 'client' },
    { src: '~plugins/bootstrap', mode: 'client' },
    { src: '~plugins/file-upload', mode: 'client' },
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  buildModules: [
    '@nuxtjs/moment',
    ['@nuxtjs/dotenv', { filename: '.env.' + process.env.ENV }],
    "@nuxtjs/svg",
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    '@nuxtjs/router',
    '@nuxtjs/firebase',
    ['nuxt-clipboard', { autoSetContainer: true }],
    '@nuxtjs/recaptcha',
    'portal-vue/nuxt',
    '@nuxtjs/dotenv',
    'vue-social-sharing/nuxt',
  ],

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    extractCSS: true,
    postcss: null
  },

  generate: {
    fallback: 'index.html'
  },

  firebase: {
    config: {
      apiKey: process.env.FIREBASE_API_KEY,
      authDomain: process.env.FIREBASE_AUTH_DOMAIN,
      databaseURL: process.env.FIREBASE_DATABASE_URL,
      projectId: process.env.FIREBASE_PROJECT_ID,
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.FIREBASE_APP_ID,
      measurementId: process.env.FIREBASE_MEASUREMENT_ID
    },
    services: {
      database: true
    }
  },

  recaptcha: {
    version: 2,
    siteKey: process.env.RECAPTCHA_SITE_KEY,
  }
}
