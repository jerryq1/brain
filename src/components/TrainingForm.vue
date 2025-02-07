<template>
  <el-card class="training-card">
    <template #header>
      <div class="card-header">
        <span>训练数据管理</span>
        <el-button type="primary" @click="addDataRow">添加数据行</el-button>
      </div>

      <div>
        <span>训练次数:默认1000</span>
        <el-input-number
            v-model="iterations"
            placeholder="输入问题"
            :controls="false"
            style="width: 100px; margin-right: 20px;"
        />

        <span>允许错误率:默认0.01就是1%</span>
        <el-input-number
            v-model="errorThresh"
            :max="1"
            :min="0.001"
            :controls="false"
            placeholder="输入问题"
            style="width: 100px; margin-right: 10px;"
        />

        <el-button type="primary" @click="changeOptions">修改配置</el-button>

      </div>
    </template>


    <el-form label-width="100px">
      <el-form-item
          v-for="(data, index) in trainingData"
          :key="index"
          :label="`样本 ${index + 1}`"
      >
        <el-input
            v-model="data.input"
            placeholder="输入问题"
            style="width: 300px; margin-right: 10px;"
        />
        <el-input
            v-model="data.output"
            placeholder="输入答案"
            style="width: 200px; margin-right: 10px;"
        />
        <el-button
            type="danger"
            :icon="Delete"
            circle
            @click="removeDataRow(index)"
        />
      </el-form-item>
    </el-form>

    <el-divider/>

    <div class="training-controls">
      <el-progress
          :percentage="trainingProgress"
          :status="!isTraining && trainingProgress? 'success' : ''"
          style="width: 300px; margin-bottom: 5px;"
      />

      <div style="margin-bottom: 5px;" v-show="comErrorThresh">当前训练错误率:{{ comErrorThresh }}</div>

      <el-button
          type="primary"
          :loading="isTraining"
          :disabled="trainingData.length === 0"
          @click="startTraining"
      >
        {{ isTraining ? `训练中 (${trainingProgress}%)` : '开始训练' }}
      </el-button>
    </div>
  </el-card>
</template>

<script setup>
import {storeToRefs} from 'pinia'
import {useModelStore} from '../stores/modelstore.js'
import {ElMessage} from 'element-plus'
import {
  Delete,
} from '@element-plus/icons-vue'
import {computed, onBeforeUnmount} from 'vue';

const modelStore = useModelStore()
const {trainingData, isTraining, trainingProgress, iterations, errorThresh, errorThreshNow} = storeToRefs(modelStore)
// 组件卸载时清理 Worker
onBeforeUnmount(() => {
  modelStore.cleanup();
});
const addDataRow = () => {
  modelStore.addTrainingData('', '')
}

const removeDataRow = (index) => {
  modelStore.trainingData.splice(index, 1)
}

const startTraining = async () => {
  if (trainingData.value.some(item => !item.input || !item.output)) {
    ElMessage.error('请填写完整的训练数据！')
    return
  }

  await modelStore.trainModel()
}
const changeOptions = () => {
  modelStore.changeOptions(iterations.value, errorThresh.value)
}

const comErrorThresh = computed(() => {
  return errorThreshNow.value && typeof errorThreshNow.value === 'number' ? ((errorThreshNow.value * 100).toFixed(2)) + '%' : errorThreshNow.value;
})
</script>

<style scoped>
.training-card {
  margin: 20px;
  max-width: 800px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.training-controls {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
