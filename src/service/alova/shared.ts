import { useAuthStore } from '@/store/modules/auth';
import { localStg } from '@/utils/storage';
import type { RequestInstanceState } from './type';
import { wrapAlova } from './wrap';

export function getAuthorization() {
  const token = localStg.get('token');
  const Authorization = token ? `Bearer ${token}` : null;

  return Authorization;
}

/** refresh token */
export async function handleRefreshToken() {
  const { resetStore } = useAuthStore();

  const rToken = localStg.get('refreshToken') || '';
  const refreshTokenMethod = wrapAlova(
    Apis.general.post_auth_refreshtoken({
      data: {
        refreshToken: rToken
      }
    })
  );

  // set the refreshToken role, so that the request will not be intercepted
  // refreshTokenMethod.meta.authRole = 'refreshToken';

  try {
    const { data } = await refreshTokenMethod;
    if (data) {
      localStg.set('token', data.token!);
      localStg.set('refreshToken', data.refreshToken!);
    }
  } catch (error) {
    resetStore();
    throw error;
  }
}

export function showErrorMsg(state: RequestInstanceState, message: string) {
  if (!state.errMsgStack?.length) {
    state.errMsgStack = [];
  }

  const isExist = state.errMsgStack.includes(message);

  if (!isExist) {
    state.errMsgStack.push(message);

    window.$message?.error(message, {
      onLeave: () => {
        state.errMsgStack = state.errMsgStack.filter(msg => msg !== message);

        setTimeout(() => {
          state.errMsgStack = [];
        }, 5000);
      }
    });
  }
}
