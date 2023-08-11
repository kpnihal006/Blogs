<script lang="ts">
import { NBadge, NIcon, NButton, NDrawer, NDrawerContent, NCard } from 'naive-ui'
import { NotificationsCircleOutline } from '@vicons/ionicons5'
import { useSubscription } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import { watch, ref } from 'vue'
import { useBlogStore } from '@/stores/blogInfo'

export default {
  components: { NBadge, NIcon, NButton, NDrawer, NDrawerContent, NotificationsCircleOutline,NCard },
  setup() {
    let show = ref(false)
    const notifications = ref<any[]>([])

    const { result: newBlogNotify } = useSubscription(gql`
      subscription newBlogNotify {
        newBlogNotify {
          id
          title
          author
        }
      }
    `)
    watch(
      newBlogNotify,
      (data) => {
        console.log('New Blog has been created.')
        notifications.value.push(data.newBlogNotify)
      },
    )

    const handleClick = () => {
      console.log('clicked')
      show.value = true
      console.log(show)
    }
    return {
      handleClick,
      show,
      notifications
    }
  }
}
</script>

<template>
  <div>
    <n-button quaternary circle @click="handleClick()"
      ><n-icon class="notificationBtn"><NotificationsCircleOutline /></n-icon
    ></n-button>
  </div>
  <n-drawer v-model:show="show" :width="502">
       <n-drawer-content title="Someone just had a thought!">
        <div v-for="notify of notifications" :key="notify.id">  
          <n-card class="card" :title="notify.title" hoverable>
            {{ notify.author }}
        </n-card>
        </div>
        </n-drawer-content>
  </n-drawer>
</template>

<style scoped>
.notificationBtn {
  color: var(--primary-color);
  font-size: 1.8rem;
}

.notificationBtn:hover {
  color: var(--secondary-color);
  font-size: 2rem;
  transition: 0.2s;
}
</style>
