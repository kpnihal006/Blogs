<script lang="ts">
import { useBlogStore } from '@/stores/blogInfo'
import { useQuery, useSubscription } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import { NCard, NCollapse, NCollapseItem, NSpace, NEllipsis, NBackTop } from 'naive-ui'
import { watch } from 'vue'

export default {
  data: () => ({
    show: false
  }),
  components: { NCard, NCollapse, NCollapseItem, NSpace, NEllipsis, NBackTop },
  setup() {
    const blogStore = useBlogStore()

    //query to get all blogs
    const {
      result: allBlogs,
      loading:allBlogsLoading,
      error:allBlogsError
    } = useQuery(gql`
      query getAllBlogs {
        sayBlog {
          id
          title
          author
          blogSlug
        }
      }
    `)

      //query
    const {result:newBlogNotify, loading:newBlogLoading, error:newBlogError} = useSubscription(gql`
    subscription newBlogNotify {
      newBlogNotify {
        id
        title
        author
      }
    }`)

    watch(newBlogNotify, data => {
      console.log(newBlogNotify,"blog received")
    })

    return {
      allBlogs,
      newBlogNotify,
      blogStore,
      allBlogsError,
      allBlogsLoading,
      newBlogError,
      newBlogLoading
    }
  }
}
</script>

<template>
  <n-back-top />
  <div>
    <div v-if="allBlogsLoading">Loading...</div>
    <div v-else-if="allBlogsError">Error: {{ allBlogsError.message }}</div>
    <h1 class="heading">The World's Thoughts</h1>
    <div v-if="allBlogs && allBlogs.sayBlog">
      <div class="spacing" v-for="blog of allBlogs.sayBlog" :key="blog.id">
        <n-card class="card" :title="blog.title" hoverable>
          {{ blog.author }}
          <template #action>
            <n-ellipsis expand-trigger="click" line-clamp="2" :tooltip="false">
              {{ blog.blogSlug }}
            </n-ellipsis>
          </template>
        </n-card>
      </div>
    </div>
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
