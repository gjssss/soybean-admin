import type { FlatResponseData } from '~/packages/axios/src'

export async function wrapAlova<
  T extends Promise<any>,
  R = Awaited<T>['data'],
  M = R extends any[] ? Required<R[number]>[] : Required<R>,
>(req: T): Promise<FlatResponseData<M>> {
  let data: M | null = null
  let error = false

  try {
    const res = await req
    data = res.data
  }
  catch {
    error = true
  }
  return {
    data,
    error,
  } as unknown as FlatResponseData<M>
}

export async function wrapAlovaTable<
  T extends {
    data: {
      records: any[]
    }
  },
>(req: Promise<T>) {
  type R = Required<T['data']['records'][0]>

  let data: any
  let error = false
  try {
    const res = await req
    data = res.data
  }
  catch {
    error = true
  }
  return {
    data,
    error,
  } as unknown as FlatResponseData<Api.Common.PaginatingQueryRecord<R>>
}
