
<template>
  <n-form label-placement="top">
    <n-grid :span="24" :x-gap="24">
      <n-form-item-gi
        :span="12"
        label="Title"
        :validation-status="titleValidationStatus"
        :feedback="titleFeedback"
        class="form"
      >
        <n-input v-model:value="createBlogTitle" placeholder="What triggered your thoughts?" />
      </n-form-item-gi>

      <n-form-item-gi
        :span="12"
        label="author"
        :validation-status="authorValidationStatus"
        :feedback="authorFeedback"
        class="form"
      >
        <n-input v-model:value="createBlogAuthor" placeholder="Whose thoughts are these?" />
      </n-form-item-gi>

      <n-form-item-gi
        :span="24"
        label="Thought"
        :validation-status="slugValidationStatus"
        :feedback="slugFeedback"
        class="form"
      >
        <n-input
          v-model:value="slugValue"
          placeholder="What are you thinking?"
          type="textarea"
          :autosize="{
            minRows: 3
          }"
        />
      </n-form-item-gi>

      <n-gi :span="24">
        <div style="display: flex; justify-content: center">
          <n-button round type="primary" @click="createBlog()"> Create </n-button>
        </div>
      </n-gi>
    </n-grid>
  </n-form>
  <h3 class="queryStatus">{{ queryStatus }}</h3>
</template>

<style scoped>
.queryStatus {
  text-align: center;
  font-size: 10px;
  font-weight: 50;
  margin: 2rem;
}

.form {
  padding-bottom: 2rem;
}
</style>

<script lang="ts">
import { computed, defineComponent, ref, watch } from 'vue'
import { NButton, NForm, NGrid, NGi, NFormItemGi, NInput } from 'naive-ui'
import { useSubscription, useMutation } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import { useBlogStore } from '@/stores/blogInfo'

function createStatus(value: String) {
  switch (value) {
    case '':
      return 'error'
      case null:
      return 'error'
    case 'I am feeling low':
      return 'warning'
    case 'I am lost':
    return 'warning'
    case 'I don\'t know who I am' :
      return 'warning'
    default:
      return undefined
  }
}

function createSlugFeedback(value: String) {
  switch (value) {
    case '':
      return 'Let go! Spill your mind right here.'
          case null:
      return 'Let go! Spill your mind right here.'
    case 'I am feeling low':
      return 'We are here for you. You deserve love!'
    case 'I am feeling high':
      return 'I see someone has been going crazy with happiness, Share some with us!'
    default:
      return 'The mind is an infinite ocean.'
  }
}

function createAuthorFeedback(value: String) {
  switch (value) {
    case '':
      return 'Whose thoughts are these?'
    case "I don't know who I am":
      return 'When in doubt, look to the stars.'
    case 'I am amazing':
      return "You are living a life you won't forget for an eternity."
    default:
      return 'The beginning of all great things.'
  }
}

function createTitleFeedback(value: String) {
  switch (value) {
    case '':
      return 'What are you calling your thoughts?'
    case 'I am lost':
      return 'Hang in there! find your way by sharing with us.'
    case 'I did it!':
      return 'Amazing, What a time to be alive!'
    default:
      return 'The heart is a tricky thing.'
  }
}

export default defineComponent({
  components: { NButton, NForm, NGrid, NGi, NFormItemGi, NInput },

  setup() {
    const blogStore = useBlogStore()

    const queryStatus = ref('You have to start somewhere. Why not start here?')
    const createBlogTitle = ref()
    const createBlogAuthor = ref()
    const createBlogSlug = ref()

    const {
      mutate: createBlog,
      onDone,
      onError
    } = useMutation(
      gql`
        mutation createBlog(
          $title: String!
          $author: String!
          $blogSlug: String!
          $userEmail: String!
        ) {
          createBlog(
            createBlogInput: {
              title: $title
              author: $author
              blogSlug: $blogSlug
              userEmail: $userEmail
            }
          ) {
            id
            title
            author
            blogSlug
            userEmail
          }
        }
      `,
      () => ({
        variables: {
          title: createBlogTitle.value,
          author: createBlogAuthor.value,
          blogSlug: createBlogSlug.value,
          userEmail: blogStore.userEmail
        }
      })
    )
    onError(() => {
      queryStatus.value = 'Something went wrong. Give it a try again!'
    })
    onDone(() => {
      queryStatus.value = 'Your thought is out there for the world to see.'
    })


    const { result: newBlogNotify } = useSubscription(gql`
      subscription newBlogNotify {
        newBlogNotify {
          id
          title
          author
        }
      }
    `)

    watch(newBlogNotify, () => {
      console.log(newBlogNotify, 'blog received')
    })

    return {
      createBlog,
      queryStatus,
      blogStore,
      createBlogTitle,
      createBlogAuthor,
      slugValue: createBlogSlug,

      slugValidationStatus: computed(() => {
        return createStatus(createBlogSlug.value)
      }),

      slugFeedback: computed(() => {
        return createSlugFeedback(createBlogSlug.value)
      }),
      authorValidationStatus: computed(() => {
        return createStatus(createBlogAuthor.value)
      }),
      authorFeedback: computed(() => {
        return createAuthorFeedback(createBlogAuthor.value)
      }),
      titleValidationStatus: computed(() => {
        return createStatus(createBlogTitle.value)
      }),
      titleFeedback: computed(() => {
        return createTitleFeedback(createBlogTitle.value)
      })
    }
  }
})
</script>
