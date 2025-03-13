<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useFormRules, useNaiveForm } from '@/hooks/common/form';
import { $t } from '@/locales';
import { wrapAlova } from '@/service/alova/wrap';
import type { System_user } from '@/api/globals';

defineOptions({
  name: 'UserOperateDrawer'
});

interface Props {
  /** the type of operation */
  operateType: NaiveUI.TableOperateType;
  /** the edit row data */
  rowData?: System_user | null;
}

const props = defineProps<Props>();

interface Emits {
  (e: 'submitted'): void;
}

const emit = defineEmits<Emits>();

const visible = defineModel<boolean>('visible', {
  default: false
});

const { formRef, validate, restoreValidation } = useNaiveForm();
const { defaultRequiredRule } = useFormRules();

const title = computed(() => {
  const titles: Record<NaiveUI.TableOperateType, string> = {
    add: $t('page.manage.user.addUser'),
    edit: $t('page.manage.user.editUser')
  };
  return titles[props.operateType];
});

type Model = Pick<Api.SystemManage.User, 'userName' | 'userRoles'> & {
  password: string;
};

const model = ref(createDefaultModel());

function createDefaultModel(): Model {
  return {
    userName: '',
    password: '',
    userRoles: []
  };
}

type RuleKey = Extract<keyof Model, 'userName' | 'status'>;

const rules: Record<RuleKey, App.Global.FormRule> = {
  userName: defaultRequiredRule
};

/** the enabled role options */
const roleOptions = ref<CommonType.Option<string>[]>([]);

async function getRoleOptions() {
  const { error, data } = await wrapAlova(Apis.general.get_roles_all());

  if (!error) {
    const options = data.map(item => ({
      label: item.roleName,
      value: String(item.id)
    }));
    roleOptions.value = options;
  }
}

async function handleInitModel() {
  model.value = createDefaultModel();

  if (props.operateType === 'edit' && props.rowData) {
    model.value.userRoles =
      (
        await Apis.general.get_users_roles({
          params: {
            id: props.rowData.id!
          }
        })
      ).data?.map(item => String(item.id)) || [];
  }
}

function closeDrawer() {
  visible.value = false;
}

async function handleSubmit() {
  await validate();
  // request
  if (props.operateType === 'add') {
    await Apis.general.post_users({
      data: {
        userName: model.value.userName,
        password: model.value.password,
        roleIds: model.value.userRoles.map(Number)
      }
    });
    window.$message?.success($t('common.addSuccess'));
  } else {
    console.log(props.rowData);
    if (!props.rowData?.id) {
      return;
    }
    if (model.value.password) {
      await Apis.general.post_users_password({
        data: {
          id: props.rowData.id,
          password: model.value.password
        }
      });
    }
    await Apis.general.post_users_roles({
      data: {
        id: props.rowData.id,
        roleIds: model.value.userRoles.map(Number)
      }
    });
    window.$message?.success($t('common.updateSuccess'));
  }
  closeDrawer();
  emit('submitted');
}

watch(visible, () => {
  if (visible.value) {
    handleInitModel();
    restoreValidation();
    getRoleOptions();
  }
});
</script>

<template>
  <NDrawer v-model:show="visible" display-directive="show" :width="360">
    <NDrawerContent :title="title" :native-scrollbar="false" closable>
      <NForm ref="formRef" :model="model" :rules="rules">
        <NFormItem v-if="operateType === 'add'" :label="$t('page.manage.user.userName')" path="userName">
          <NInput v-model:value="model.userName" :placeholder="$t('page.manage.user.form.userName')" />
        </NFormItem>
        <NFormItem :label="$t('page.manage.user.password')" path="password">
          <NInput v-model:value="model.password" :placeholder="$t('page.manage.user.form.password')" />
        </NFormItem>
        <NFormItem :label="$t('page.manage.user.userRole')" path="roles">
          <NSelect
            v-model:value="model.userRoles"
            multiple
            :options="roleOptions"
            :placeholder="$t('page.manage.user.form.userRole')"
          />
        </NFormItem>
      </NForm>
      <template #footer>
        <NSpace :size="16">
          <NButton @click="closeDrawer">{{ $t('common.cancel') }}</NButton>
          <NButton type="primary" @click="handleSubmit">{{ $t('common.confirm') }}</NButton>
        </NSpace>
      </template>
    </NDrawerContent>
  </NDrawer>
</template>

<style scoped></style>
