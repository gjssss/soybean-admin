<script setup lang="ts">
import { $t } from '@/locales'
import { computed, shallowRef, watch } from 'vue'

defineOptions({
  name: 'ApiAuthModal',
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

const title = computed(() => $t('common.edit') + $t('page.manage.role.apiAuth'))

const tree = shallowRef<any[]>([])

async function getTree() {
  // const { error, data } = await wrapAlova(Apis.api.get_apis())
  // function mapFunc(item: any): any {
  //   return {
  //     id: item.id,
  //     label: item.path,
  //     pId: item.parentId,
  //     children: item.children?.map(mapFunc),
  //   }
  // }
  // if (!error) {
  //   tree.value = data.map(mapFunc)
  // }
  const { data } = await Apis.api.get_apis()
  const records = [] as any[]
  data.forEach((item) => {
    const groupObject = records.find(i => i.id === item.group)
    if (groupObject) {
      groupObject.children!.push({
        id: item.id,
        label: item.path,
        pId: item.group,
      })
    }
    else {
      records.push({
        id: item.group as any,
        label: item.group,
        children: [
          {
            id: item.id,
            label: item.path,
            pId: item.group,
          },
        ],
      })
    }
  })
  tree.value = records
}

const checks = shallowRef<number[]>([])

async function getChecks() {
  // request
  const { data } = await Apis.api.get_apis_role({
    params: {
      roleId: props.roleId,
    },
  })
  checks.value = data.map(item => item.id!) || []
}

async function handleSubmit() {
  // request
  await Apis.api.post_apis_role({
    data: {
      roleId: props.roleId,
      ids: checks.value.filter(item => !Number.isNaN(Number(item))),
    },
  })
  window.$message?.success?.($t('common.modifySuccess'))

  closeModal()
}

function init() {
  getTree()
  getChecks()
}

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
      checkable
      expand-on-click
      virtual-scroll
      block-line
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
