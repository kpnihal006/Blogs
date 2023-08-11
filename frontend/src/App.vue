<script setup lang="ts">
import { useSubscription } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import { watch, watchEffect, ref } from 'vue'
import '@/assets/main.css'
import  {Moon} from '@vicons/ionicons5'

import '@aws-amplify/ui-vue/styles.css'
import { Authenticator, useAuthenticator } from '@aws-amplify/ui-vue'
import { Amplify } from 'aws-amplify'
import awsconfig from './aws-exports'

import { useBlogStore } from '@/stores/blogInfo'
import {
  NButton,
  useLoadingBar,
  NLoadingBarProvider,
  NAvatar,
  NIcon,
  NConfigProvider,
  darkTheme,
  type GlobalThemeOverrides
} from 'naive-ui'

import NotificationPanel from '@/components/NotificationPanel.vue'


const auth = useAuthenticator()

Amplify.configure(awsconfig)

const blogStore = useBlogStore()

watchEffect(() => {
  if (auth.user?.attributes.email) {
    blogStore.userEmail = auth.user?.attributes.email
  }
})

function handleStart() {
  useLoadingBar().start()
}

function handleEnd() {
  useLoadingBar().finish()
}

const theme = ref<null | typeof darkTheme>(null)
function changeTheme() {
  theme.value = blogStore.theme == null ? darkTheme : null
  blogStore.theme = blogStore.theme == null ? 'darkTheme' : null
}

</script>

<template>
  <n-config-provider :theme="theme">
  <n-loading-bar-provider>
    <div>
      <template v-if="auth.authStatus === 'configuring'">
        <h2 style="text-align: center">Transporting to your world....</h2>
        <handleStart />
      </template>

      <template v-if="auth.authStatus === 'authenticated'">
        <handleEnd />
        <header>
          <div class="username">
          <h1>Hello!</h1>
          <h3>{{ blogStore.userEmail }}</h3>
          </div>
          <div class="mainLogo">
          <n-avatar src="src/assets/mainLogo.png" :size="90"/>
          <h3 >Where thoughts come to life.</h3>
        </div>
        <div class="headerBtns">
          <n-button quaternary circle @click="changeTheme()"
      ><n-icon class="themeBtn"><Moon /></n-icon
    ></n-button>
          <n-button class="signOutBtn" @click="auth.signOut()" :bordered="false"
            >Sign Out
          </n-button>
        </div>
        </header>
          <nav>
            <RouterLink to="/">Home</RouterLink>
            <RouterLink to="/about">About</RouterLink>
            <RouterLink to="/create">Create</RouterLink>
            <NotificationPanel />
          </nav>
          <div>
          <RouterView />
        </div>
      </template>

      <template v-if="auth.authStatus === 'unauthenticated'">
        <handleEnd />
        <h1>Welcome to your blog world!</h1>
        <h3>Sign in or create your account.</h3>
        <authenticator></authenticator>
      </template>
    </div>
  </n-loading-bar-provider>
</n-config-provider>
</template>

<style scoped>

#app {
  background-color: var(--n-color);
}
.signOutBtn {
  color: var(--primary-color);
  border: 1px solid var(--primary-color);
  box-shadow: 0px 0px 8px 0px var(--primary-color);
  margin-left: 1rem;
}

.signOutBtn:hover {
  color: var(--secondary-color);
  border: 1px solid var(--secondary-color);
  box-shadow: 0px 0px 8px 0px var(--secondary-color);
  transition: 0.2s;

}

.username {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.mainLogo{
  display: flex;
  flex-direction: column;
  align-items: center;
  position: center;
}

.themeBtn {
  font-size: 25px;
  color: var(--secondary-color);
}

.headerBtns {
  display: inline-flex;
}


</style>
