<template>
  <Header />
  <Home />
  
</template>

<script>
import Home from "./components/Home.vue";
import Header from "./components/Header.vue";
import { CometChat } from "@cometchat-pro/chat";




export default {
   created(){
   this.initializeComet()
  },
    methods: {
      initializeComet(){
        const APP_ID= '2068775636952963';
            const REGION= 'us';
            const appSetting = new CometChat.AppSettingsBuilder()
              .subscribePresenceForAllUsers()
              .setRegion(REGION)
              .build();
            CometChat.init(APP_ID, appSetting).then(
              () => {
                console.log('Initialization completed successfully');
                // You can now call login function.
              },
              (error) => {
                console.log('Initialization failed with error:', error);
                // Check the reason for error and take appropriate action.
              }
        );
      }
    },
  name: "App",
  components: {
    Home,
    Header,
  },
};
</script>

<style>
:root {
  --grey-lightest: #f7f9fa;
  --white: #ffffff;
  --grey: #c8d1dc;
  --dark-grey: #6b7785;
  --dark-blue: #1f2d3d;
  --dark-blue-border: #2b3f56;
  --teal: #1bebb9;
  --red-dark: #bb0c0c;
  --font-family: GraphikRegular, "Helvetica Neue", Sans-Serif;
}

body {
  margin: 0;
  min-height: 100vh;
}

.row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

#app {
  font-family: Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100vh;
  overflow: scroll;
  display: flex;
  flex-direction: column;
}
</style>
