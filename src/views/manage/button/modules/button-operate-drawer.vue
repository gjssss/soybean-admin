<script setup lang="ts">
import { useFormRules, useNaiveForm } from '@/hooks/common/form'
import { $t } from '@/locales'
import { computed, ref, watch } from 'vue'

defineOptions({
  name: 'ButtonOperateDrawer',
})

const props = defineProps<Props>()

const emit = defineEmits<Emits>()

interface Props {
  /** the type of operation */
  operateType: NaiveUI.TableOperateType
  /** the edit row data */
  rowData?: SystemButton | null
}

interface Emits {
  (e: 'submitted'): void
}

interface SystemButton {
  code?: string
  desc?: string
  id?: number
}

const visible = defineModel<boolean>('visible', {
  default: false,
})

const { formRef, validate, restoreValidation } = useNaiveForm()
const { defaultRequiredRule } = useFormRules()

const title = computed(() => {
  const titles: Record<NaiveUI.TableOperateType, string> = {
    add: $t('page.manage.button.addButton'),
    edit: $t('page.manage.button.editButton'),
  }
  return titles[props.operateType]
})

type Model = Pick<SystemButton, 'code' | 'desc'>

const model = ref(createDefaultModel())

function createDefaultModel(): Model {
  return {
    code: '',
    desc: '',
  }
}

type RuleKey = 'code'

const rules: Record<RuleKey, App.Global.FormRule> = {
  code: defaultRequiredRule,
}

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
    await Apis.general.post_buttons_update({
      data: {
        id: props.rowData?.id,
        code: model.value.code,
        desc: model.value.desc,
      },
    })
    window.$message?.success($t('common.updateSuccess'))
  }
  else {
    await Apis.general.post_buttons({
      data: {
        code: model.value.code,
        desc: model.value.desc,
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
        <NFormItem :label="$t('page.manage.button.buttonCode')" path="code">
          <NInput v-model:value="model.code" :placeholder="$t('page.manage.button.form.buttonCode')" />
        </NFormItem>
        <NFormItem :label="$t('page.manage.button.buttonDesc')" path="desc">
          <NInput v-model:value="model.desc" :placeholder="$t('page.manage.button.form.buttonDesc')" />
        </NFormItem>
      </NForm>
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
