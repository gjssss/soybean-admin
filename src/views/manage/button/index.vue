<script setup lang="tsx">
import { useTable, useTableOperate } from '@/hooks/common/table'
import { $t } from '@/locales'
import { wrapAlova } from '@/service/alova/wrap'
import { useAppStore } from '@/store/modules/app'
import { NButton, NPopconfirm } from 'naive-ui'
import ButtonOperateDrawer from './modules/button-operate-drawer.vue'

const appStore = useAppStore()
const {
  columns,
  columnChecks,
  data,
  loading,
  getData,
  getDataByPage,
} = useTable({
  apiFn: async () => {
    // 由于没有不分页的封装，所以只能这样写
    return {
      data: {
        records: (await wrapAlova(Apis.general.get_buttons())).data!,
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
      key: 'index',
      title: $t('common.index'),
      width: 64,
      align: 'center',
    },
    {
      key: 'code',
      title: $t('page.manage.button.buttonCode'),
      align: 'center',
      minWidth: 120,
    },
    {
      key: 'desc',
      title: $t('page.manage.button.buttonDesc'),
      minWidth: 120,
    },
    {
      key: 'operate',
      title: $t('common.operate'),
      align: 'center',
      width: 130,
      render: row => (
        <div class="flex-center gap-8px">
          <NButton type="primary" ghost size="small" onClick={() => edit(row.id)}>
            {$t('common.edit')}
          </NButton>
          <NPopconfirm onPositiveClick={() => handleDelete(row.id)}>
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
      ),
    },
  ],
})

const {
  drawerVisible,
  operateType,
  editingData,
  handleAdd,
  handleEdit,
  checkedRowKeys,
  onBatchDeleted,
  onDeleted,
} = useTableOperate(data, getData)

async function handleBatchDelete() {
  // request
  await Apis.general.post_buttons_batchdelete({
    data: {
      ids: checkedRowKeys.value.map(Number),
    },
  })
  onBatchDeleted()
}

async function handleDelete(id: number) {
  // request
  await Apis.general.post_buttons_delete({
    data: {
      id,
    },
  })

  onDeleted()
}

function edit(id: number) {
  handleEdit(id)
}
</script>

<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <NCard :title="$t('page.manage.button.title')" :bordered="false" size="small" class="sm:flex-1-hidden card-wrapper">
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
        :scroll-x="702"
        :loading="loading"
        remote
        :row-key="row => row.id"
        :pagination="false"
        class="sm:h-full"
      />
      <ButtonOperateDrawer
        v-model:visible="drawerVisible"
        :operate-type="operateType"
        :row-data="editingData"
        @submitted="getDataByPage"
      />
    </NCard>
  </div>
</template>

<style scoped></style>
