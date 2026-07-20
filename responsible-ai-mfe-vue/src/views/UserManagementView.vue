<template>
  <section class="space-y-6">
    <article class="rai-card p-6">
      <div class="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p class="rai-kicker">Identity</p>
          <h2 class="mt-2 text-2xl font-semibold text-[#0f2b2c]">User Management</h2>
          <p class="mt-4 max-w-3xl text-sm leading-7 text-[#305669]/70">
            Review activation status and authority assignments through the existing backend user endpoints.
          </p>
        </div>
        <div class="flex flex-wrap gap-3">
          <input
            v-model="search"
            class="rai-input w-64"
            placeholder="Search by first name or login"
            type="text"
          />
          <button class="rai-button-primary" type="button" @click="loadUsers">
            Refresh users
          </button>
        </div>
      </div>
    </article>

    <p
      v-if="feedback"
      class="rounded-xl border border-[#e6dece] bg-[#fffdf8] px-4 py-3 text-sm text-[#174143]"
    >
      {{ feedback }}
    </p>

    <div class="grid gap-4">
      <article
        v-for="user in filteredUsers"
        :key="user.id"
        class="rai-card p-6"
      >
        <div class="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
          <div class="min-w-0">
            <p class="text-xl font-semibold text-[#0f2b2c]">{{ user.firstName || user.login }}</p>
            <p class="mt-1 text-sm text-[#305669]/70">{{ user.login }}</p>
            <p class="mt-3 text-[10px] font-bold uppercase tracking-[0.24em] text-[#305669]/60">Current roles</p>
            <p class="mt-2 text-sm text-[#174143]">{{ user.authorities.join(', ') }}</p>
          </div>

          <div class="grid min-w-[320px] gap-4 rounded-xl border border-[#e6dece] bg-[#faf7f0] p-4">
            <label class="flex items-center gap-3 text-sm text-[#174143]">
              <input
                v-model="drafts[user.id].activated"
                class="h-4 w-4 rounded border-[#d6d0c4] bg-[#fffdf8] text-emerald-500 focus:ring-emerald-300"
                type="checkbox"
              />
              User activated
            </label>

            <div>
              <p class="text-[10px] font-bold uppercase tracking-[0.24em] text-[#305669]/60">Authorities</p>
              <div class="mt-3 grid gap-2 sm:grid-cols-2">
                <label
                  v-for="authority in authorities"
                  :key="authority"
                  class="flex items-center gap-3 rounded-lg border border-[#e6dece] bg-[#fffdf8] px-3 py-2 text-sm text-[#174143]"
                >
                  <input
                    :checked="drafts[user.id].authorities.includes(authority)"
                    class="h-4 w-4 rounded border-[#d6d0c4] bg-[#fffdf8] text-[#305669] focus:ring-[#305669]/30"
                    type="checkbox"
                    @change="toggleAuthority(user.id, authority, $event.target.checked)"
                  />
                  {{ authority }}
                </label>
              </div>
            </div>

            <div class="flex flex-wrap gap-3">
              <button class="rai-button-primary" type="button" @click="saveUser(user.id)">
                Save changes
              </button>
              <button class="rai-button-danger" type="button" @click="deleteUser(user.id)">
                Delete user
              </button>
            </div>
          </div>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue';

import { getCatalogValue, loadCatalog } from '../lib/catalog';
import { request } from '../lib/http';
import { joinUrl } from '../lib/urls';

const users = ref([]);
const authorities = ref([]);
const feedback = ref('');
const search = ref('');
const drafts = reactive({});

const filteredUsers = computed(() => {
  const term = search.value.trim().toLowerCase();
  if (!term) {
    return users.value;
  }

  return users.value.filter(user => {
    const haystack = `${user.firstName || ''} ${user.login || ''}`.toLowerCase();
    return haystack.includes(term);
  });
});

function backendEndpoint(pathKey) {
  return joinUrl(getCatalogValue('Backend'), getCatalogValue(pathKey));
}

function ensureDrafts(nextUsers) {
  nextUsers.forEach(user => {
    drafts[user.id] = {
      activated: Boolean(user.activated),
      authorities: [...user.authorities]
    };
  });
}

async function loadUsers() {
  feedback.value = '';

  try {
    await loadCatalog();

    const [userResponse, authorityResponse] = await Promise.all([
      request(backendEndpoint('Backend_Users')),
      request(backendEndpoint('Backend_authorities'))
    ]);

    users.value = Array.isArray(userResponse?.userList) ? userResponse.userList : [];
    authorities.value = Array.isArray(authorityResponse) ? authorityResponse : [];
    ensureDrafts(users.value);
  } catch (error) {
    feedback.value = error.message || 'Unable to load user management data.';
  }
}

function toggleAuthority(userId, authority, checked) {
  const nextAuthorities = new Set(drafts[userId].authorities);

  if (checked) {
    nextAuthorities.add(authority);
  } else {
    nextAuthorities.delete(authority);
  }

  drafts[userId].authorities = [...nextAuthorities];
}

async function saveUser(userId) {
  feedback.value = '';

  try {
    await request(backendEndpoint('Backend_UpdateUser'), {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: userId,
        activated: drafts[userId].activated,
        authorities: drafts[userId].authorities
      })
    });
    feedback.value = `Updated user ${userId} successfully.`;
    await loadUsers();
  } catch (error) {
    feedback.value = error.message || 'Unable to update user.';
  }
}

async function deleteUser(userId) {
  feedback.value = '';

  try {
    await request(`${backendEndpoint('Backend_DeleteUser')}?id=${encodeURIComponent(userId)}`, {
      method: 'DELETE'
    });
    feedback.value = `Deleted user ${userId} successfully.`;
    await loadUsers();
  } catch (error) {
    feedback.value = error.message || 'Unable to delete user.';
  }
}

onMounted(() => {
  loadUsers();
});
</script>
