<script setup lang="ts">
import { ref } from "vue";
import { events } from "./notification";
import { Notification } from "../types";

const notifications = ref<Notification[]>([]);

const removeNotification = (text: string) => {
  let index = notifications.value.findIndex(val => val.message == text);
  notifications.value.splice(index, 1);
}

events.on("notify", ({ text, options }) => {
  notifications.value.push({
    message: text,
    options: {
      ...options
    }
  });

  setTimeout(() => removeNotification(text), options?.delay || 5000)
})

events.on("notifyRemove", ({ text }) => {
  removeNotification(text);
})
</script>

<template>
  <transition-group tag="div" class="absolute bottom-5 flex flex-col gap-2 max-w-md" name="notif" appear>
    <div v-for="notification in notifications" :key="notification.message"
      class="bg-theme-sec ml-5 overflow-hidden rounded min-w-[20rem] shadow py-2 px-3 border-2 border-neutral-200 dark:border-neutral-800">
      <div class="p-1">
        <p class="font-semibold">{{ notification.message }}</p>
        <p v-if="notification.options?.description" class="text-neutral-400">{{ notification.options.description }}</p>
      </div>
      <div v-if="notification.options?.acceptText || notification.options?.rejectText" class="flex gap-2 p-1">
        <button v-if="notification.options?.acceptText" @click="notification.options?.acceptCallback"
          class="form-button p-1">{{ notification.options.acceptText }}</button>
        <button v-if="notification.options?.rejectCallback" @click="notification.options?.rejectCallback"
          class="form-button p-1">{{ notification.options.rejectText }}</button>
      </div>
    </div>
  </transition-group>
</template>

<style>
.notif-enter-active,
.notif-move {
  transition: all 500ms ease;
}

.notif-leave-active {
  transition: all 500ms ease;
  position: absolute;
}

.notif-enter-from {
  transform: translateY(400%);
}

.notif-leave-to {
  transform: translateY(400%);
}
</style>
