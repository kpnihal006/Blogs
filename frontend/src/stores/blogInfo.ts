import { defineStore } from "pinia";
import { ref } from "vue";

export const useBlogStore = defineStore('blogInfo', {
    state : () =>({
        notifications: [],
        theme:<string|null>null,
        userEmail:undefined,
    }
    )
})