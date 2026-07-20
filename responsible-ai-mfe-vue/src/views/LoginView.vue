<template>
  <main class="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#faeab1] px-6 py-12">
    <div class="absolute left-[-8%] top-[-10%] h-[34rem] w-[34rem] rounded-full bg-[#305669]/10 blur-[120px]" />
    <div class="absolute bottom-[-12%] right-[-8%] h-[34rem] w-[34rem] rounded-full bg-white/70 blur-[120px]" />

    <section class="rai-card w-full max-w-md p-8">
      <header class="space-y-2 pb-6 text-center">
        <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#305669] text-white shadow-sm">
          <Layers3 class="h-6 w-6 text-white" />
        </div>
        <h1 class="text-2xl font-semibold text-[#0f2b2c]">
          Enter the Vue MFE
        </h1>
        <p class="text-sm text-[#305669]/70">
          Sign in directly when the micro frontend is running standalone
        </p>
      </header>

      <form class="space-y-4" @submit.prevent="handleSubmit">
        <div
          v-if="errorMessage"
          class="rounded-lg border border-rose-500/20 bg-rose-500/10 p-3 text-center text-xs font-medium text-rose-300"
        >
          {{ errorMessage }}
        </div>

        <label class="block">
          <span class="rai-label">Username or Email</span>
          <div class="relative">
            <User class="absolute left-3 top-3 h-4 w-4 text-[#305669]/60" />
            <input
              v-model="form.username"
              autocomplete="username"
              class="rai-input pl-9"
              placeholder="name@trustai.com"
              type="text"
            />
          </div>
        </label>

        <label class="block">
          <span class="rai-label">Password</span>
          <div class="relative">
            <Lock class="absolute left-3 top-3 h-4 w-4 text-[#305669]/60" />
            <input
              v-model="form.cred"
              :type="showPassword ? 'text' : 'password'"
              autocomplete="current-password"
              class="rai-input pl-9 pr-9"
              placeholder="••••••••"
            />
            <button
              class="absolute right-3 top-3 text-[#305669]/60 transition hover:text-[#0f2b2c]"
              type="button"
              @click="showPassword = !showPassword"
            >
              <EyeOff v-if="showPassword" class="h-4 w-4" />
              <Eye v-else class="h-4 w-4" />
            </button>
          </div>
        </label>

        <label class="flex items-center gap-3 text-sm text-[#305669]">
          <input
            v-model="form.rememberMe"
            class="h-4 w-4 rounded border-[#d6d0c4] bg-[#fffdf8] text-[#305669] focus:ring-[#305669]/30"
            type="checkbox"
          />
          Keep the session on this browser
        </label>

        <button :disabled="authState.loading" class="rai-button-primary h-10 w-full" type="submit">
          <LoaderCircle v-if="authState.loading" class="h-4 w-4 animate-spin" />
          <span>{{ authState.loading ? 'Signing in...' : 'Enter Workspace' }}</span>
          <ArrowRight v-if="!authState.loading" class="h-4 w-4" />
        </button>
      </form>
    </section>
  </main>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import {
  ArrowRight,
  Eye,
  EyeOff,
  Layers3,
  LoaderCircle,
  Lock,
  User
} from 'lucide-vue-next';

import { authState, login } from '../lib/auth';
import { defaultSectionPath } from '../lib/navigation';

const router = useRouter();
const errorMessage = ref('');
const showPassword = ref(false);
const form = reactive({
  username: 'admin',
  cred: 'admin',
  rememberMe: true
});

async function handleSubmit() {
  errorMessage.value = '';

  try {
    const result = await login({ ...form });
    await router.replace(defaultSectionPath(result.pages, result.account?.authorities || []));
  } catch (error) {
    errorMessage.value = error.message || 'Authentication failed. Check your credentials.';
  }
}
</script>
