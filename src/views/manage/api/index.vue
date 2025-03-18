<script setup lang="tsx">
import type { System_api } from '@/api/globals'
import type { Ref } from 'vue'
import type { OperateType } from './modules/api-operate-modal.vue'
import { useTable, useTableOperate } from '@/hooks/common/table'

import { $t } from '@/locales'
import { wrapAlova } from '@/service/alova/wrap'
import { useAppStore } from '@/store/modules/app'
import { useBoolean } from '@sa/hooks'
import { NButton, NPopconfirm } from 'naive-ui'
import { computed, ref } from 'vue'
import ApiOperateModal from './modules/api-operate-modal.vue'

const appStore = useAppStore()

const { bool: visible, setTrue: openModal } = useBoolean()

const wrapperRef = ref<HTMLElement | null>(null)

const { columns, columnChecks, data, loading, getData, getDataByPage } = useTable({
  apiFn: async () => {
    const data = (await wrapAlova(Apis.api.get_apis())).data!
    const records = [] as (System_api & { children: System_api[] })[]
    data.forEach((item) => {
      const groupObject = records.find(i => i.group === item.group)
      if (groupObject) {
        groupObject.children!.push(item)
      }
      else {
        records.push({
          id: item.group as any,
          group: item.group,
          children: [
            item,
          ],
        })
      }
    })
    // 由于没有不分页的封装，所以只能这样写
    return {
      data: {
        records,
        current: 1,
        size: 10,
        total: 10,
      },
      error: null,
      response: {} as any,
    }
  },
  columns: () => [
    {
      type: 'selection',
      align: 'center',
      width: 48,
    },
    {
      key: 'group',
      title: $t('page.manage.api.group'),
      align: 'center',
      width: 200,
    },
    {
      key: 'id',
      title: $t('page.manage.menu.id'),
      align: 'center',
      width: 150,
    },
    {
      key: 'path',
      title: $t('page.manage.api.path'),
      align: 'left',
      minWidth: 80,
    },
    {
      key: 'method',
      title: $t('page.manage.api.method'),
      align: 'center',
      width: 100,
    },
    {
      key: 'operate',
      title: $t('common.operate'),
      align: 'center',
      width: 200,
      render: row => (
        row.children
          ? <></>
          : (
              <div class="flex-center justify-center gap-8px">
                <NButton type="primary" ghost size="small" onClick={() => handleEdit(row)}>
                  {$t('common.edit')}
                </NButton>
                <NPopconfirm onPositiveClick={() => handleDelete(row.id!)}>
                  {{
                    default: () => $t('common.confirmDelete'),
                    trigger: () => (
                      <NButton type="error" ghost size="small">
                        {$t('common.delete')}
                      </NButton>
                    ),
                  }}
                </NPopconfirm>
              </div>
            )
      ),
    },
  ],
})
const { checkedRowKeys, onBatchDeleted, onDeleted } = useTableOperate(data as any, getData)

const groupList = computed(() => {
  return data.value.map(item => item.group!)
})

const operateType = ref<OperateType>('add')

function handleAdd() {
  operateType.value = 'add'
  openModal()
}

async function handleBatchDelete() {
  // request
  // await Apis({
  //   data: {
  //     ids: checkedRowKeys.value.map(i => Number.parseInt(i, 10)),
  //   },
  // })
  await Apis.api.post_apis_delete_batch({
    data: {
      ids: checkedRowKeys.value.map(i => Number.parseInt(i, 10)).filter(item => !Number.isNaN(item)),
    },
  })
  onBatchDeleted()
}

async function handleDelete(id: number) {
  // request
  await Apis.api.post_apis_delete({
    data: {
      id,
    },
  })
  onDeleted()
}

/** the edit menu data or the parent menu data when adding a child menu */
const editingData: Ref<System_api | null> = ref(null)

function handleEdit(item: System_api) {
  operateType.value = 'edit'
  editingData.value = { ...item }

  openModal()
}
</script>

<template>
  <div ref="wrapperRef" class="flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <NCard :title="$t('page.manage.menu.title')" :bordered="false" size="small" class="sm:flex-1-hidden card-wrapper">
      <template #header-extra>
        <TableHeaderOperation
          v-model:columns="columnChecks"
          :disabled-delete="checkedRowKeys.length === 0"
          :loading="loading"
          @add="handleAdd"
          @delete="handleBatchDelete"
          @refresh="getData"
        />
      </template>
      <NDataTable
        v-model:checked-row-keys="checkedRowKeys"
        :columns="columns"
        :data="data"
        size="small"
        :flex-height="!appStore.isMobile"
        :scroll-x="1088"
        :loading="loading"
        :row-key="row => row.id"
        :pagination="false"
        remote
        class="sm:h-full"
      />
      <ApiOperateModal
        v-model:visible="visible"
        :operate-type="operateType"
        :row-data="editingData"
        :group-list="groupList"
        @submitted="getDataByPage"
      />
    </NCard>
  </div>
</template>

<style scoped></style>
