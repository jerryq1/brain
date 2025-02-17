<template>
  <el-container class="main-container">
    <el-header>
      <h1 class="title">🤖 Brain.js 智能问答系统</h1>
    </el-header>

    <el-main class="main-content">
      <div class="main">
        <training-form/>
        <test-form/>


        <div class="model-controls">
          <el-upload
              accept=".json"
              :show-file-list="false"
              :before-upload="handleModelUpload"
          >
            <el-button type="primary" icon="Upload">加载模型</el-button>
          </el-upload>

          <el-button
              type="success"
              icon="Download"
              @click="handleModelSave"
          >
            保存模型
          </el-button>
        </div>
      </div>

      <div class="main-right">
        <div class="main-right-title">神经网络结构图(训练完成可见)</div>
        <div id="networkVisualization">

        </div>
      </div>

    </el-main>

    <el-footer class="footer">
      <span>基于 Vue 3 + Brain.js 构建的演示系统</span>
    </el-footer>
  </el-container>
</template>

<script setup>
import {useModelStore} from './stores/modelstore.js'
import {ElMessage} from 'element-plus'

import TrainingForm from './components/TrainingForm.vue' // Adjust the path as needed
import TestForm from './components/TestForm.vue' // Adjust the path as needed


const modelStore = useModelStore()

const handleModelSave = () => {
  if (modelStore.trainingData.length === 0) {
    ElMessage.warning('请先训练模型再保存')
    return
  }
  modelStore.saveModel()
  ElMessage.success('模型保存成功')
}

const handleModelUpload = (file) => {
  modelStore.loadModel(file)
  ElMessage.success('模型加载成功')
  return false // 阻止默认上传行为
}
</script>

<style scoped>
.main-container {
  min-height: 100vh;
  width: 100vw;

}
.main-content{
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
}
.main-right{
  width: 100%;
  height: 100%;
  flex: 1;
}
.main-right-title{
  color: #409eff;
  text-align: center;
  margin: 20px 0;
  font-size: 20px ;
}

#networkVisualization {


}

.title {
  color: #409eff;
  text-align: center;
  margin: 20px 0;
}

.model-controls {
  margin: 20px;
  display: flex;
  gap: 20px;
  justify-content: center;
}

.footer {
  text-align: center;
  color: #666;
  padding: 20px;
}
</style>
