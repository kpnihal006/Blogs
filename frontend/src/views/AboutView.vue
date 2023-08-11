
<script lang="ts">
import { ref, watchEffect } from 'vue'
import { useQuery } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import {useBlogStore} from '@/stores/blogInfo'
import { NCard,NCollapse,NCollapseItem,NSpace } from 'naive-ui'


export default {
  components: {NCard,NCollapse,NCollapseItem,NSpace},
  setup () {

    const blogStore = useBlogStore()

    const { result:getBlogByUser, loading,error } = useQuery(gql`
    query getBlogByUser ($userEmail:String!) {
      sayBlogByUser (userEmail:$userEmail) {
        id,
        title,
        author,
        blogSlug
      }
    }`,blogStore)

    return {
      getBlogByUser,
      blogStore,
      loading,
      error
        }
  },
}

</script>

<template>
  <div class="about">
    <h1 class="heading">My Thoughts</h1>
    <div v-if="loading">Loading...</div>
    <div v-else-if="error">Error: {{ error.message }}</div>
    <div v-else-if="getBlogByUser && getBlogByUser.sayBlogByUser">
      <div class="spacing" v-for="blog of getBlogByUser.sayBlogByUser" :key="blog.id">
        <n-card class="card" :title="blog.title" hoverable>
          {{ blog.author }}
          <template #action>
            {{ blog.blogSlug }}
          </template>
        </n-card>
        </div>
  </div>
  <div v-else>No Blogs were found for you.</div>

  </div>
</template>

<style scoped>
.spacing {
  margin: 2rem;
}

.heading {
  text-align: center;
  font-size: 20px;
  font-weight: 10;
}

</style>
