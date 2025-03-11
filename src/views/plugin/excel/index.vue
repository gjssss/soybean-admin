<script setup lang="tsx">
import { NButton } from 'naive-ui';
import { utils, writeFile } from 'xlsx';
import { useAppStore } from '@/store/modules/app';
import { useTable } from '@/hooks/common/table';
import { fetchGetUserList } from '@/service/api';
import { $t } from '@/locales';

const appStore = useAppStore();

const { columns, data, loading } = useTable({
  apiFn: fetchGetUserList,
  showTotal: true,
  apiParams: {
    current: 1,
    size: 999,
    // if you want to use the searchParams in Form, you need to define the following properties, and the value is null
    // the value can not be undefined, otherwise the property in Form will not be reactive
    userName: null
  },
  columns: () => [
    {
      type: 'selection',
      align: 'center',
      width: 48
    },
    {
      key: 'index',
      title: $t('common.index'),
      align: 'center',
      width: 64
    },
    {
      key: 'userName',
      title: $t('page.manage.user.userName'),
      align: 'center',
      minWidth: 100
    }
  ]
});

function exportExcel() {
  const exportColumns = columns.value.slice(2);

  const excelList = data.value.map(item => exportColumns.map(col => getTableValue(col, item)));

  const titleList = exportColumns.map(col => (isTableColumnHasTitle(col) && col.title) || null);

  excelList.unshift(titleList);

  const workBook = utils.book_new();

  const workSheet = utils.aoa_to_sheet(excelList);

  workSheet['!cols'] = exportColumns.map(item => ({
    width: Math.round(Number(item.width) / 10 || 20)
  }));

  utils.book_append_sheet(workBook, workSheet, '用户列表');

  writeFile(workBook, '用户数据.xlsx');
}

function getTableValue(
  col: NaiveUI.TableColumn<NaiveUI.TableDataWithIndex<Api.SystemManage.User>>,
  item: NaiveUI.TableDataWithIndex<Api.SystemManage.User>
) {
  if (!isTableColumnHasKey(col)) {
    return null;
  }

  const { key } = col;

  if (key === 'operate') {
    return null;
  }

  if (key === 'userRoles') {
    return item.userRoles.map(role => role).join(',');
  }

  return item[key];
}

function isTableColumnHasKey<T>(column: NaiveUI.TableColumn<T>): column is NaiveUI.TableColumnWithKey<T> {
  return Boolean((column as NaiveUI.TableColumnWithKey<T>).key);
}

function isTableColumnHasTitle<T>(column: NaiveUI.TableColumn<T>): column is NaiveUI.TableColumnWithKey<T> & {
  title: string;
} {
  return Boolean((column as NaiveUI.TableColumnWithKey<T>).title);
}
</script>

<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <NCard title="Excel导出" :bordered="false" size="small" class="sm:flex-1-hidden card-wrapper">
      <template #header-extra>
        <NSpace align="end" wrap justify="end" class="lt-sm:w-200px">
          <NButton size="small" ghost type="primary" @click="exportExcel">
            <template #icon>
              <icon-file-icons:microsoft-excel class="text-icon" />
            </template>
            导出excel
          </NButton>
        </NSpace>
      </template>

      <NDataTable
        :columns="columns"
        :data="data"
        size="small"
        :flex-height="!appStore.isMobile"
        :scroll-x="962"
        :loading="loading"
        remote
        :row-key="row => row.id"
        :pagination="false"
        :virtual-scroll="true"
        class="sm:h-full"
      />
    </NCard>
  </div>
</template>

<style scoped></style>
