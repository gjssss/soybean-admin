import { createAlova } from 'alova';
import fetchAdapter from 'alova/fetch';
import vueHook from 'alova/vue';
import { alova } from '@/service/alova';
import { createApis, withConfigType } from './createApis';

export const alovaInstance = createAlova({
  baseURL: '',
  statesHook: vueHook,
  requestAdapter: fetchAdapter(),
  beforeRequest: () => {},
  responded: res => {
    return res.json();
  }
});

export const $$userConfigMap = withConfigType({});

const Apis = createApis(alova, $$userConfigMap);

export default Apis;
