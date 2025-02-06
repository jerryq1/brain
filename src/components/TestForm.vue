<template>
  <el-card class="test-card">
    <template #header>
      <span>问答测试区</span>
    </template>

    <div class="test-container">
      <el-input
          v-model="inputQuestion"
          placeholder="请输入您的问题"
          style="width: 500px; margin-right: 10px;"
          clearable
      />

      <el-button
          type="success"
          :loading="isTraining"
          @click="handleTest"
      >
        测试问答
      </el-button>
    </div>

    <el-divider />

    <el-card class="result-card" v-if="outputAnswer">
      <template #header>
        <span>模型回答</span>
      </template>
      <div class="answer-content">
        {{ outputAnswer }}
      </div>
    </el-card>
  </el-card>
</template>

<script setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useModelStore } from '../stores/modelStore'
import { ElNotification } from 'element-plus'

const modelStore = useModelStore()
const { isTraining } = storeToRefs(modelStore)

const inputQuestion = ref('')
const outputAnswer = ref('')

const handleTest = () => {
  if (!inputQuestion.value) {
    ElNotification({
      title: '提示',
      message: '请输入测试问题',
      type: 'warning'
    })
    return
  }

  try {
    outputAnswer.value = modelStore.testModel(inputQuestion.value)
    ElNotification.success({
      title: '测试成功',
      message: '已获取模型响应'
    })
  } catch (error) {
    ElNotification.error({
      title: '测试失败',
      message: '请先训练模型或检查输入格式'
    })
  }
}
</script>

<style scoped>
.test-card {
  margin: 20px;
  max-width: 800px;
}

.test-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.result-card {
  margin-top: 20px;
}

.answer-content {
  padding: 15px;
  font-size: 16px;
  color: #409eff;
}
</style>
