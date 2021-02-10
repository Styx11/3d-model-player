import { config } from '@vue/test-utils'

// work around with css module
// https://github.com/vuejs/vue-test-utils-next/issues/179
config.global.mocks = config.global.mocks || {}
config.global.mocks.$style = {}