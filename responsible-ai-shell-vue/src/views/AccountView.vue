<template>
  <main class="flex min-h-screen items-center justify-center bg-[#faf7f0] p-6">
    <section class="rai-card w-full max-w-md p-8">
      <header class="space-y-1">
        <h1 class="flex items-center gap-2 text-xl font-semibold text-[#0f2b2c]">
          <Settings class="h-5 w-5 text-indigo-400" />
          Profile Settings
        </h1>
        <p class="text-xs text-[#305669]/70">
          Manage your personal profile details in TrustAI
        </p>
      </header>

      <form class="mt-6 space-y-4" @submit.prevent="handleSave">
        <label class="block">
          <span class="rai-label">First Name</span>
          <div class="relative">
            <User class="absolute left-3 top-3 h-4 w-4 text-[#305669]/60" />
            <input v-model="form.firstName" class="rai-input pl-9" type="text" />
          </div>
        </label>

        <label class="block">
          <span class="rai-label">Last Name</span>
          <div class="relative">
            <User class="absolute left-3 top-3 h-4 w-4 text-[#305669]/60" />
            <input v-model="form.lastName" class="rai-input pl-9" type="text" />
          </div>
        </label>

        <label class="block">
          <span class="rai-label">Email Address</span>
          <div class="relative">
            <Mail class="absolute left-3 top-3 h-4 w-4 text-[#305669]/60" />
            <input v-model="form.email" class="rai-input pl-9" type="email" />
          </div>
        </label>

        <label class="block">
          <span class="rai-label">Language (Locale)</span>
          <div class="relative">
            <Globe class="absolute left-3 top-3 h-4 w-4 text-[#305669]/60" />
            <input v-model="form.langKey" class="rai-input pl-9" type="text" />
          </div>
        </label>

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
          <button class="rai-button-secondary h-9" type="button" @click="resetForm">
            Reset
          </button>
          <button :disabled="saving" class="rai-button-primary h-9" type="submit">
            {{ saving ? 'Saving...' : 'Save Changes' }}
          </button>
        </div>
      </form>
    </section>
  </main>
</template>

<script setup>
import { reactive, ref, watch } from 'vue';
import { Globe, Mail, Settings, User } from 'lucide-vue-next';

import { authState, updateAccount } from '../lib/auth';

const message = ref('');
const messageType = ref('success');
const saving = ref(false);
const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
  langKey: 'en'
});

function syncForm() {
  form.firstName = authState.account?.firstName || '';
  form.lastName = authState.account?.lastName || '';
  form.email = authState.account?.email || '';
  form.langKey = authState.account?.langKey || 'en';
}

watch(() => authState.account, syncForm, { immediate: true });

function resetForm() {
  syncForm();
  message.value = '';
}

async function handleSave() {
  if (!authState.account) {
    return;
  }

  saving.value = true;
  message.value = '';

  try {
    await updateAccount({
      id: authState.account.id,
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      langKey: form.langKey
    });
    messageType.value = 'success';
    message.value = 'Account details updated successfully.';
  } catch (error) {
    messageType.value = 'error';
    message.value = error.message || 'Unable to update account.';
  } finally {
    saving.value = false;
  }
}
</script>
