<script setup lang="ts">
import type { System_role } from '@/api/globals'
import { useFormRules, useNaiveForm } from '@/hooks/common/form'
import { $t } from '@/locales'
import { useBoolean } from '@sa/hooks'
import { computed, ref, watch } from 'vue'
import ButtonAuthModal from './button-auth-modal.vue'
import MenuAuthModal from './menu-auth-modal.vue'

defineOptions({
  name: 'RoleOperateDrawer',
})

const props = defineProps<Props>()

const emit = defineEmits<Emits>()

interface Props {
  /** the type of operation */
  operateType: NaiveUI.TableOperateType
  /** the edit row data */
  rowData?: System_role | null
}

interface Emits {
  (e: 'submitted'): void
}

const visible = defineModel<boolean>('visible', {
  default: false,
})

const { formRef, validate, restoreValidation } = useNaiveForm()
const { defaultRequiredRule } = useFormRules()
const { bool: menuAuthVisible, setTrue: openMenuAuthModal } = useBoolean()
const { bool: buttonAuthVisible, setTrue: openButtonAuthModal } = useBoolean()

const title = computed(() => {
  const titles: Record<NaiveUI.TableOperateType, string> = {
    add: $t('page.manage.role.addRole'),
    edit: $t('page.manage.role.editRole'),
  }
  return titles[props.operateType]
})

type Model = Pick<Api.SystemManage.Role, 'roleName' | 'roleDesc'>

const model = ref(createDefaultModel())

function createDefaultModel(): Model {
  return {
    roleName: '',
    roleDesc: '',
  }
}

type RuleKey = Exclude<keyof Model, 'roleDesc'>

const rules: Record<RuleKey, App.Global.FormRule> = {
  roleName: defaultRequiredRule,
}

const roleId = computed(() => props.rowData?.id || -1)

const isEdit = computed(() => props.operateType === 'edit')

function handleInitModel() {
  model.value = createDefaultModel()

  if (props.operateType === 'edit' && props.rowData) {
    Object.assign(model.value, props.rowData)
  }
}

function closeDrawer() {
  visible.value = false
}

async function handleSubmit() {
  await validate()
  // request
  if (props.operateType === 'edit') {
    await Apis.general.post_roles_update({
      data: {
        id: props.rowData?.id,
        roleName: model.value.roleName,
        roleDesc: model.value.roleDesc,
      },
    })
    window.$message?.success($t('common.updateSuccess'))
  }
  else {
    await Apis.general.post_roles({
      data: {
        roleName: model.value.roleName,
        roleDesc: model.value.roleDesc,
      },
    })
    window.$message?.success($t('common.addSuccess'))
  }
  closeDrawer()
  emit('submitted')
}

watch(visible, () => {
  if (visible.value) {
    handleInitModel()
    restoreValidation()
  }
})
</script>

<template>
  <NDrawer v-model:show="visible" display-directive="show" :width="360">
    <NDrawerContent :title="title" :native-scrollbar="false" closable>
      <NForm ref="formRef" :model="model" :rules="rules">
        <NFormItem :label="$t('page.manage.role.roleName')" path="roleName">
          <NInput v-model:value="model.roleName" :placeholder="$t('page.manage.role.form.roleName')" />
        </NFormItem>
        <NFormItem :label="$t('page.manage.role.roleDesc')" path="roleDesc">
          <NInput v-model:value="model.roleDesc" :placeholder="$t('page.manage.role.form.roleDesc')" />
        </NFormItem>
      </NForm>
      <NSpace v-if="isEdit">
        <NButton @click="openMenuAuthModal">
          {{ $t('page.manage.role.menuAuth') }}
        </NButton>
        <MenuAuthModal v-model:visible="menuAuthVisible" :role-id="roleId" />
        <NButton @click="openButtonAuthModal">
          {{ $t('page.manage.role.buttonAuth') }}
        </NButton>
        <ButtonAuthModal v-model:visible="buttonAuthVisible" :role-id="roleId" />
      </NSpace>
      <template #footer>
        <NSpace :size="16">
          <NButton @click="closeDrawer">
            {{ $t('common.cancel') }}
          </NButton>
          <NButton type="primary" @click="handleSubmit">
            {{ $t('common.confirm') }}
          </NButton>
        </NSpace>
      </template>
    </NDrawerContent>
  </NDrawer>
</template>

<style scoped></style>
