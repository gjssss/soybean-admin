<script setup lang="ts">
import type { UploadCustomRequestOptions } from 'naive-ui'
import axios from 'axios'
import { ref } from 'vue'

const props = defineProps<{
  contentType: 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp'
}>()
const slotData = ref<{
  percent: number
  file: File | null
  isFinished: boolean
  isLoading: boolean
  isError: boolean
  url: string
}>({
  percent: 0,
  file: null,
  isFinished: false,
  isLoading: false,
  isError: false,
  url: '',
})
async function uploadRequest({ file, onProgress, onFinish, onError }: UploadCustomRequestOptions) {
  if (!file.file) {
    return
  }
  slotData.value.file = file.file
  slotData.value.isLoading = true
  slotData.value.isFinished = false
  slotData.value.isError = false
  slotData.value.percent = 0
  slotData.value.url = ''
  const { data } = await Apis.general.get_upload_qiniu({
    params: {
      content_type: props.contentType,
    },
  })

  const formData = new FormData()
  formData.append('file', file.file)
  formData.append('token', data.token)
  formData.append('key', data.key)

  try {
    const response = await axios.post(data.uploadUrl, formData, {
      onUploadProgress: (progressEvent) => {
        const percent = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1))
        slotData.value.percent = percent
        onProgress({ percent })
      },
    })
    slotData.value.isFinished = true
    slotData.value.isLoading = false
    slotData.value.isError = false
    slotData.value.url = data.url
    onFinish()
    return response.data
  }
  catch {
    slotData.value.isFinished = true
    slotData.value.isLoading = false
    slotData.value.isError = true
    onError()
  }
}
</script>

<template>
  <n-upload
    :custom-request="uploadRequest"
  >
    <slot v-bind="slotData" />
  </n-upload>
</template>

<style>

</style>
