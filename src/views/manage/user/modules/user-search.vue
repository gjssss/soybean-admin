<script setup lang="ts">
import { useFormRules, useNaiveForm } from '@/hooks/common/form'
import { $t } from '@/locales'
import { computed } from 'vue'

defineOptions({
  name: 'UserSearch',
})

const emit = defineEmits<Emits>()

interface Emits {
  (e: 'reset'): void
  (e: 'search'): void
}

const { formRef, validate, restoreValidation } = useNaiveForm()

const model = defineModel<Api.SystemManage.UserSearchParams>('model', { required: true })

type RuleKey = 'userName'

const rules = computed<Record<RuleKey, App.Global.FormRule>>(() => {
  const { patternRules } = useFormRules() // inside computed to make locale reactive

  return {
    userName: patternRules.userName,
  }
})

async function reset() {
  await restoreValidation()
  emit('reset')
}

async function search() {
  await validate()
  emit('search')
}
</script>

<template>
  <NCard :bordered="false" size="small" class="card-wrapper">
    <NCollapse>
      <NCollapseItem :title="$t('common.search')" name="user-search">
        <NForm ref="formRef" :model="model" :rules="rules" label-placement="left" :label-width="80">
          <NGrid responsive="screen" item-responsive>
            <NFormItemGi span="24 s:24 m:12" :label="$t('page.manage.user.userName')" path="userName" class="pr-24px">
              <NInput v-model:value="model.userName" :placeholder="$t('page.manage.user.form.userName')" />
            </NFormItemGi>
            <NFormItemGi span="24 m:12" class="pr-24px">
              <NSpace class="w-full" justify="end">
                <NButton @click="reset">
                  <template #icon>
                    <icon-ic-round-refresh class="text-icon" />
                  </template>
                  {{ $t('common.reset') }}
                </NButton>
                <NButton type="primary" ghost @click="search">
                  <template #icon>
                    <icon-ic-round-search class="text-icon" />
                  </template>
                  {{ $t('common.search') }}
                </NButton>
              </NSpace>
            </NFormItemGi>
          </NGrid>
        </NForm>
      </NCollapseItem>
    </NCollapse>
  </NCard>
</template>

<style scoped></style>
