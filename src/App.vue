<script setup lang="ts">
import { useRouter } from "vue-router";
import { useAuthStore, useSettingsStore } from "./store";
import { onMounted } from "vue";

import { event } from "@tauri-apps/api";
import { relaunch } from "@tauri-apps/api/process";
import { checkUpdate, installUpdate } from "@tauri-apps/api/updater";
import { notify, notifyRemove } from "./plugin/notification";

import TitleBar from "./components/AppTitleBar.vue";
import axios from "axios";

const router = useRouter();
const settingsStore = useSettingsStore();
const authStore = useAuthStore();
axios.defaults.baseURL = import.meta.env.DEV ? "http://localhost:3001" : "https://sibylku.xyz";
axios.defaults.withCredentials = true;

onMounted(() => {
  let params = new URLSearchParams(window.location.search);
  let access_token = params.get("access_token");
  let refresh_token = params.get("refresh_token");

  if (access_token && refresh_token) {
    // should keep it in the state. Also can get user profiles with these tokens to reduce normal http calls.
    authStore.access_token = access_token;
    authStore.refresh_token = refresh_token;
    settingsStore.uploaded = true;
  }
});

onMounted(async () => {
  const { shouldUpdate, manifest } = await checkUpdate();
  const updateText = shouldUpdate ? `Update Available. v${manifest?.version}` : "No update available";
  notify("Checking for updates..");

  if (shouldUpdate) {
    notify(updateText, {
      acceptText: "Update now",
      acceptCallback: async () => {
        notifyRemove(updateText);
        await installUpdate();
        await relaunch();
      },
      delay: 10000
    });
  } else {
    notify(updateText)
  }

  if (settingsStore.uploaded) {
    // refresh token 
    axios.patch<{ access_token: string, refresh_token: string }>("/api/refresh").then(response => {
      authStore.access_token = response.data.access_token;
      authStore.refresh_token = response.data.refresh_token;
    })

    return;
  }

  notify("Would you like to upload your friend list to database?", {
    acceptText: "Yes!",
    description: "This helps you find mutuals quickly by checking saved mutuals in Mutual Finder's database (Recommended)",
    acceptCallback: () => {
      let url = import.meta.env.DEV ? "http://localhost:3001/api/login" : "https://sibylku.xyz/api/login";

      window.location.href = url;
    },
    delay: 15000,
  });
});

event.listen("tauri://update-status", (res) => {
  console.log(res);
});

if (import.meta.env.DEV) {
  router.push({ path: "/" });
} else {
  router.push({ path: "/" });
}
</script>

<template>
  <TitleBar />
  <div class="relative flex-1 overflow-hidden">
    <suspense>
      <template #default>
        <router-view v-slot="{ Component, route }">
          <keep-alive>
            <component 
              :is="Component" 
              :key="route.meta.usePathKey ? route.path : undefined" 
            />
          </keep-alive>
        </router-view>
      </template>
      <template #fallback>
        <p>Loading...</p>
      </template>
    </suspense>

    <Notification />
  </div>
</template>
