<script setup lang="ts">
import { computed, shallowRef, watch } from 'vue';
import { $t } from '@/locales';
import type { System_menu } from '@/api/globals';
import { wrapAlova } from '@/service/alova/wrap';

defineOptions({
  name: 'MenuAuthModal'
});

interface Props {
  /** the roleId */
  roleId: number;
}

const props = defineProps<Props>();

const visible = defineModel<boolean>('visible', {
  default: false
});

function closeModal() {
  visible.value = false;
}

const title = computed(() => $t('common.edit') + $t('page.manage.role.menuAuth'));

const tree = shallowRef<any[]>([]);

async function getTree() {
  const { error, data } = await wrapAlova(Apis.general.get_menus());
  function mapFunc(item: System_menu): any {
    return {
      id: item.id,
      label: item.menuName,
      pId: item.parentId,
      children: item.children?.map(mapFunc)
    };
  }
  if (!error) {
    tree.value = data.map(mapFunc);
  }
}

const checks = shallowRef<number[]>([]);

async function getChecks() {
  // request
  const { data } = await Apis.general.get_menus_role({
    params: {
      roleId: props.roleId
    }
  });
  checks.value = data.map(item => item.id!) || [];
}

async function handleSubmit() {
  console.log(checks.value, props.roleId);
  // request
  await Apis.general.post_roles_menus({
    data: {
      roleId: props.roleId,
      menuIds: checks.value
    }
  });
  window.$message?.success?.($t('common.modifySuccess'));

  closeModal();
}

function init() {
  getTree();
  getChecks();
}

watch(visible, val => {
  if (val) {
    init();
  }
});
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
