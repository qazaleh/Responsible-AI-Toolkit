<template>
  <div class="space-y-5">
    <PageHeader label="Settings" title="Workspace Settings" description="Manage profile, password, API keys, and theme preferences." :icon="Gauge" />

    <div class="grid gap-5 lg:grid-cols-2">
      <CardShell title="User Profile" content-class="space-y-4">
        <Field label="Display Name">
          <TextInput model-value="TrustAI User" />
        </Field>
        <Field label="Email">
          <TextInput model-value="trustai.user@example.com" />
        </Field>
        <button type="button" class="ps-btn-primary">Save Profile</button>
      </CardShell>

      <CardShell title="Password Change" content-class="space-y-4">
        <Field label="Current Password">
          <TextInput type="password" />
        </Field>
        <Field label="New Password">
          <TextInput type="password" />
        </Field>
        <button type="button" class="ps-btn-outline">Update Password</button>
      </CardShell>

      <CardShell title="API Keys" description="Optional integration keys." content-class="space-y-4">
        <Field label="Evaluation API Key">
          <TextInput type="password" model-value="trustai-key-placeholder" />
        </Field>
        <button type="button" class="ps-btn-outline">Rotate Key</button>
      </CardShell>

      <CardShell title="Theme">
        <SimpleSelect v-model="theme" :options="['Light', 'Dark']" />
      </CardShell>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { Gauge } from 'lucide-vue-next';

import CardShell from './CardShell.vue';
import Field from './Field.vue';
import PageHeader from './PageHeader.vue';
import SimpleSelect from './SimpleSelect.vue';
import TextInput from './TextInput.vue';

const theme = ref('Light');
</script>
