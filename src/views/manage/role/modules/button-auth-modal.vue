<script setup lang="ts">
import type { TreeOption } from 'naive-ui'
import { $t } from '@/locales'
import { computed, shallowRef, watch } from 'vue'

defineOptions({
  name: 'ButtonAuthModal',
})

const props = defineProps<Props>()

interface Props {
  /** the roleId */
  roleId: number
}

const visible = defineModel<boolean>('visible', {
  default: false,
})

function closeModal() {
  visible.value = false
}

const title = computed(() => $t('common.edit') + $t('page.manage.role.buttonAuth'))

const tree = shallowRef<TreeOption[]>([])

async function getAllButtons() {
  // request
  const { data } = await Apis.general.get_buttons()
  tree.value
    = data?.map(item => ({
      id: item.id!,
      label: item.code!,
      key: item.code!,
    })) || []
}

const checks = shallowRef<number[]>([])

async function getChecks() {
  // request
  const { data } = await Apis.general.get_buttons_role({
    params: {
      roleId: props.roleId,
    },
  })
  checks.value = data.map(item => item.id!) || []
}

async function handleSubmit() {
  // request
  await Apis.general.post_roles_buttons({
    data: {
      roleId: props.roleId,
      buttonIds: checks.value,
    },
  })
  window.$message?.success?.($t('common.modifySuccess'))

  closeModal()
}

function init() {
  getAllButtons()
  getChecks()
}

// init
init()

watch(visible, (val) => {
  if (val) {
    init()
  }
})
</script>

<template>
  <NModal v-model:show="visible" :title="title" preset="card" class="w-480px">
    <NTree
      v-model:checked-keys="checks"
      :data="tree"
      key-field="id"

      checkable expand-on-click virtual-scroll block-line
      class="h-280px"
    />
    <template #footer>
      <NSpace justify="end">
        <NButton size="small" class="mt-16px" @click="closeModal">
          {{ $t('common.cancel') }}
        </NButton>
        <NButton type="primary" size="small" class="mt-16px" @click="handleSubmit">
          {{ $t('common.confirm') }}
        </NButton>
      </NSpace>
    </template>
  </NModal>
</template>

<style scoped></style>
