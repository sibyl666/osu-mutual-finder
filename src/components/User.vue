<script setup lang="ts">
import { getUser } from "../utils";
import { jsonCountries } from "../utils";
import { open } from "@tauri-apps/api/shell";
import { UserObject } from "../types";

const props = defineProps<{
  userId: number,
  user?: UserObject
}>();

const userDetails = props.user || await getUser(props.userId);
const country = jsonCountries.find(country => {
  if (userDetails.country_code == country.code) {
    return country
  }
})

const countryFromCode = (code: string) => {
  let country = jsonCountries.find(country => country.code == code);
  return import.meta.env.DEV ? `/flags/${country?.code.toLowerCase()}.svg`: `./flags/${country?.code.toLowerCase()}.svg`;
}

const openLink = () => {
  open(`https://osu.ppy.sh/users/${props.userId}`);
}
</script>

<template>
  <a @click="openLink" target="_blank"
    class="flex flex-col shadow-md dark:bg-neutral-900 bg-neutral-50 p-1 rounded-md">
    <img :src="userDetails.cover.url" class="flex h-10 object-cover rounded-md" />

    <div class="flex px-2 gap-1 -mt-3">
      <img :src="userDetails.avatar_url" class="w-16 h-16 rounded-md" />

      <div class="flex flex-grow items-end overflow-hidden">
        <div class="overflow-hidden flex-1 px-1">
          <p v-if="userDetails.statistics.global_rank" class="text-sm font-semibold text-neutral-500 -my-1">#{{
              userDetails.statistics.global_rank
          }}</p>
          <p class="font-semibold text-lg truncate">{{ userDetails.username }}</p>
        </div>

        <img v-if="country" class="h-9 flag" :src="countryFromCode(country.code)!" />
      </div>
    </div>
  </a>
</template>