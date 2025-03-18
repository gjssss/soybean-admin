<script setup lang="tsx">
import type { System_api } from '@/api/globals'
import { useFormRules, useNaiveForm } from '@/hooks/common/form'
import { $t } from '@/locales'
import { computed, ref, watch } from 'vue'

defineOptions({
  name: 'ApiOperateModal',
})

const props = defineProps<Props>()

const emit = defineEmits<Emits>()

export type OperateType = NaiveUI.TableOperateType

interface Props {
  /** 操作类型 */
  operateType: OperateType
  /** 编辑时的行数据 */
  rowData?: System_api | null
  groupList: string[]
}

interface Emits {
  (e: 'submitted'): void
}

const visible = defineModel<boolean>('visible', {
  default: false,
})

const groupOptions = computed(() => {
  return props.groupList.map(i => ({
    label: i,
    value: i,
  }))
})

const { formRef, validate, restoreValidation } = useNaiveForm()
const { defaultRequiredRule } = useFormRules()

const title = computed(() => {
  const titles: Record<OperateType, string> = {
    add: $t('page.manage.api.addApi'),
    edit: $t('page.manage.api.editApi'),
  }
  return titles[props.operateType]
})

type Model = Pick<System_api, 'path' | 'method' | 'group'>

const model = ref<Model>(createDefaultModel())

function createDefaultModel(): Model {
  return {
    path: '',
    method: 'GET',
    group: '',
  }
}

const methodOptions = [
  { label: 'GET', value: 'GET' },
  { label: 'POST', value: 'POST' },
  { label: 'PUT', value: 'PUT' },
  { label: 'DELETE', value: 'DELETE' },
  { label: 'PATCH', value: 'PATCH' },
  { label: 'OPTIONS', value: 'OPTIONS' },
  { label: 'HEAD', value: 'HEAD' },
]

type RuleKey = 'name' | 'path' | 'method' | 'group'

const rules: Record<RuleKey, App.Global.FormRule> = {
  name: defaultRequiredRule,
  path: defaultRequiredRule,
  method: defaultRequiredRule,
  group: defaultRequiredRule,
}

function handleInitModel() {
  model.value = createDefaultModel()

  if (props.operateType === 'edit' && props.rowData) {
    const { path, method, group } = props.rowData
    Object.assign(model.value, { name, path, method, group })
  }
}

function closeDrawer() {
  visible.value = false
}

async function handleSubmit() {
  await validate()

  if (props.operateType === 'edit') {
    await Apis.api.post_apis_update({
      data: {
        ...model.value,
        id: props.rowData?.id,
      },
    })
  }
  else {
    await Apis.api.post_apis({
      data: model.value,
    })
  }

  window.$message?.success($t('common.updateSuccess'))
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
  <NModal v-model:show="visible" :title="title" preset="card" class="w-600px">
    <NForm ref="formRef" :model="model" :rules="rules" label-placement="left" :label-width="100">
      <NGrid responsive="screen" item-responsive>
        <NFormItemGi span="24" :label="$t('page.manage.api.path')" path="path">
          <NInput v-model:value="model.path" :placeholder="$t('page.manage.api.form.path')" />
        </NFormItemGi>
        <NFormItemGi span="24" :label="$t('page.manage.api.method')" path="method">
          <NSelect v-model:value="model.method" :options="methodOptions" :placeholder="$t('page.manage.api.form.method')" />
        </NFormItemGi>
        <NFormItemGi span="24" :label="$t('page.manage.api.group')" path="group">
          <NSelect
            v-model:value="model.group" filterable tag :options="groupOptions"
            :placeholder="$t('page.manage.api.form.group')"
          />
        </NFormItemGi>
      </NGrid>
    </NForm>
    <template #footer>
      <NSpace justify="end" :size="16">
        <NButton @click="closeDrawer">
          {{ $t('common.cancel') }}
        </NButton>
        <NButton type="primary" @click="handleSubmit">
          {{ $t('common.confirm') }}
        </NButton>
      </NSpace>
    </template>
  </NModal>
</template>

<style scoped></style>
