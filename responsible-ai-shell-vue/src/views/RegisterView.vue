<template>
  <main class="flex min-h-screen items-center justify-center bg-[#faeab1] px-6 py-12">
    <section class="rai-card w-full max-w-md p-8">
      <header class="space-y-2">
        <h1 class="flex items-center gap-2 text-xl font-semibold text-[#0f2b2c]">
          <UserPlus class="h-5 w-5 text-indigo-400" />
          Create Account
        </h1>
        <p class="text-xs text-[#305669]/70">
          Join the TrustAI Responsible AI governance toolkit
        </p>
      </header>

      <div
        v-if="isSuccess"
        class="mt-6 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-300"
      >
        Registration complete. Redirecting to sign in...
      </div>

      <form v-else class="mt-6 space-y-4" @submit.prevent="handleRegister">
        <label class="block">
          <span class="rai-label">Username</span>
          <input v-model="username" class="rai-input" placeholder="expert_user" required type="text" />
        </label>
        <label class="block">
          <span class="rai-label">Email Address</span>
          <input v-model="email" class="rai-input" placeholder="user@trustai.com" required type="email" />
        </label>
        <label class="block">
          <span class="rai-label">Password</span>
          <input
            v-model="password"
            class="rai-input"
            placeholder="••••••••"
            required
            type="password"
          />
        </label>
        <label class="block">
          <span class="rai-label">Confirm Password</span>
          <input
            v-model="confirmPassword"
            class="rai-input"
            placeholder="••••••••"
            required
            type="password"
          />
        </label>

        <p
          v-if="errorMessage"
          class="rounded-xl border border-rose-500/20 bg-rose-500/10 px-3 py-3 text-sm text-rose-300"
        >
          {{ errorMessage }}
        </p>

        <button class="rai-button-primary w-full" type="submit">
          Create TrustAI Account
        </button>

        <div class="text-center text-xs text-[#305669]/70">
          Already have an account?
          <button class="text-[#305669] hover:underline" type="button" @click="router.push('/login')">
            Sign In
          </button>
        </div>
      </form>
    </section>
  </main>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { UserPlus } from 'lucide-vue-next';

const router = useRouter();
const username = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const errorMessage = ref('');
const isSuccess = ref(false);

function handleRegister() {
  errorMessage.value = '';

  if (password.value !== confirmPassword.value) {
    errorMessage.value = 'Passwords do not match.';
    return;
  }

  isSuccess.value = true;
  window.setTimeout(() => {
    router.push('/login');
  }, 1800);
}
</script>
