import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router).directive('select', {
  mounted(el) {
    if (el) {
      el.addEventListener('focus', () => {
        el.select()
      })
    }
  }
})

app.mount('#app')
