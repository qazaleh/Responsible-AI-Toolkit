<template>
  <main class="flex min-h-screen items-center justify-center bg-[#faf7f0] p-6">
    <section class="rai-card w-full max-w-md p-8">
      <header class="space-y-1">
        <h1 class="flex items-center gap-2 text-xl font-semibold text-[#0f2b2c]">
          <Lock class="h-5 w-5 text-indigo-400" />
          Update Password
        </h1>
        <p class="text-xs text-[#305669]/70">
          Keep your TrustAI credentials safe and secure
        </p>
      </header>

      <form class="mt-6 space-y-4" @submit.prevent="handleSubmit">
        <label class="block">
          <span class="rai-label">Current Password</span>
          <input
            v-model="form.currentPassword"
            :type="showPasswords ? 'text' : 'password'"
            class="rai-input"
            placeholder="••••••••"
          />
        </label>
        <label class="block">
          <span class="rai-label">New Password</span>
          <input
            v-model="form.newPassword"
            :type="showPasswords ? 'text' : 'password'"
            class="rai-input"
            placeholder="••••••••"
          />
        </label>
        <label class="block">
          <span class="rai-label">Confirm New Password</span>
          <input
            v-model="confirmPassword"
            :type="showPasswords ? 'text' : 'password'"
            class="rai-input"
            placeholder="••••••••"
          />
        </label>

        <div class="flex justify-end text-xs text-[#305669]/70">
          <button class="hover:text-[#0f2b2c]" type="button" @click="showPasswords = !showPasswords">
            {{ showPasswords ? 'Hide Passwords' : 'Show Passwords' }}
          </button>
        </div>

        <p
          v-if="message"
          :class="[
            'rounded-xl px-3 py-3 text-sm',
            messageType === 'success'
              ? 'border border-emerald-500/20 bg-emerald-500/10 text-emerald-300'
              : 'border border-rose-500/20 bg-rose-500/10 text-rose-300'
          ]"
        >
          {{ message }}
        </p>

        <div class="flex justify-end gap-2 pt-2">
          <button class="rai-button-secondary h-9" type="button" @click="router.back()">
            Cancel
          </button>
          <button :disabled="submitting" class="rai-button-primary h-9" type="submit">
            {{ submitting ? 'Updating...' : 'Update Password' }}
          </button>
        </div>
      </form>
    </section>
  </main>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { Lock } from 'lucide-vue-next';

import { changePassword } from '../lib/auth';

const router = useRouter();
const confirmPassword = ref('');
const showPasswords = ref(false);
const submitting = ref(false);
const message = ref('');
const messageType = ref('success');
const form = reactive({
  currentPassword: '',
  newPassword: ''
});

async function handleSubmit() {
  message.value = '';

  if (!form.currentPassword || !form.newPassword) {
    messageType.value = 'error';
    message.value = 'Please complete both password fields.';
    return;
  }

  if (form.newPassword !== confirmPassword.value) {
    messageType.value = 'error';
    message.value = 'New password and confirmation do not match.';
    return;
  }

  submitting.value = true;

  try {
    await changePassword({ ...form });
    messageType.value = 'success';
    message.value = 'Password updated successfully.';
    form.currentPassword = '';
    form.newPassword = '';
    confirmPassword.value = '';
  } catch (error) {
    messageType.value = 'error';
    message.value = error.message || 'Unable to update password.';
  } finally {
    submitting.value = false;
  }
}
</script>
