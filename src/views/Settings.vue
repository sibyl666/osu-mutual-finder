<script setup lang="ts">
import SettingsToggle from "../components/Settings/SettingsToggle.vue";
import SettingsBlacklist from "../components/Settings/SettingsBlacklist.vue";
import SettingsPageLimit from "../components/Settings/SettingsPageLimit.vue";
import SettingsCountries from "../components/Settings/SettingsCountries.vue";
import SettingsMode from "../components/Settings/SettingsMode.vue";
import SettingsOther from "../components/Settings/SettingsOther.vue";
</script>

<template>
  <div id="settings" class="page overflow-y-auto">
    <div class="flex flex-col gap-2 mt-2">
      <SettingsToggle />
      <SettingsBlacklist />
      <div class="flex justify-center gap-2">
        <SettingsPageLimit />
        <SettingsMode />
      </div>
      <SettingsCountries />
      <SettingsOther />
    </div>
  </div>
</template>

<style>
.array-enter-active,
.array-leave-active {
  transition: all 500ms ease;
}
.array-leave-active {
  position: absolute;
}
.array-enter-from {
  opacity: 0;
  transform: translateY(20px);
}
.array-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
.array-move {
  transition: all 500ms ease;
}
</style>
