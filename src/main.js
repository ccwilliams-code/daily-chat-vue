import { createApp } from 'vue'
import { createStore } from 'vuex'
import App from './App.vue'

// Create a new store instance.
const store = createStore({
  state () {
    return {
      local_user:
      {
          chat_me:null,
          username: null,
          userid: null
      },
      
      participants:[]
    }
  },
  mutations: {
  }
})


const app = createApp(App)
app.use(store)
app.mount('#app');
