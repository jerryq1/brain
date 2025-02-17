import {defineStore} from 'pinia';
import {recurrent} from 'brain.js';
import {ElMessage} from 'element-plus'


export const useModelStore = defineStore('model', {
  state: () => ({
    net: new recurrent.LSTM(
      {
        hiddenLayers: [64, 64],  // 双隐藏层增强表达能力
        learningRate: 0.01
      }
    ), // 神经网络实例
    trainingData: [
      {"input": "自定义表单验证", "output": "frontend"}, // 前端任务
      {"input": "实现 WebSocket 进行实时通信", "output": "backend"}, // 后端任务
      {"input": "视差滚动效果", "output": "frontend"}, // 前端任务
      {"input": "安全存储用户密码", "output": "backend"}, // 后端任务
      {"input": "创建主题切换器（深色/浅色模式)", "output": "frontend"}, // 前端任务
      {"input": "高流量负载均衡", "output": "backend"}, // 后端任务
      {"input": "为残疾用户提供的无障碍功能", "output": "frontend"}, // 前端任务
      {"input": "可扩展架构以应对增长的用户基础", "output": "backend"} // 后端任务 ];


    ],         // 训练数据
    isTraining: false,        // 是否正在训练
    trainingProgress: 0,      // 训练进度
    iterations: 1000,
    errorThresh: 0.01,
    worker: null, // 添加 worker 引用
    errorThreshNow: null

  }),
  actions: {
    // 初始化 Worker
    initWorker() {
      if (!this.worker) {
        this.worker = new Worker(new URL('./model/worker.js', import.meta.url), {
          type: 'module'
        });

        this.worker.onmessage = (e) => {

          console.log(e, 'eee');
          const msg = e.data;
          switch (msg.type) {
            case 'progress':
              if (msg.progress) this.trainingProgress = msg.progress;
              if (msg.errorThreshNow) this.errorThreshNow = msg.errorThreshNow
              break;
            case 'complete':
              this.net.fromJSON(msg.model);
              this.isTraining = false;
              this.trainingProgress = 100;
              ElMessage.success(`训练完成！`);
              break;
            case 'error':
              this.isTraining = false;
              ElMessage.error(`训练失败: ${msg.error}`);
              break;
            case 'svg':
              document.getElementById('networkVisualization').innerHTML = msg.svg;
            break;

          }
        };
      }
    },
    // 修改后的训练方法
    async trainModel() {
      if (!this.worker) this.initWorker();

      this.isTraining = true;
      this.trainingProgress = 0;

      this.worker.postMessage({
        trainingData: JSON.parse(JSON.stringify(this.trainingData)),
        iterations: this.iterations,
        errorThresh: this.errorThresh
      });
    },

    // 销毁 Worker 防止内存泄漏
    cleanup() {
      if (this.worker) {
        this.worker.terminate();
        this.worker = null;
      }
    },

    // 添加训练数据
    addTrainingData(input, output) {
      this.trainingData.push({input, output});
    },
    changeOptions(iterations, errorThresh) {
      this.errorThresh = errorThresh
      this.iterations = iterations
      ElMessage.success('修改配置成功！')
      console.log(this);
    },
    // 训练模型
    // async trainModel() {
    //   console.log('执行');
    //   this.isTraining = true;
    //   console.log(this.isTraining, 'isTraining');
    //   this.net.train(this.trainingData, {
    //     iterations: this.iterations,
    //     errorThresh: this.errorThresh, // the acceptable error percentage from training data --> number between 0 and 1
    //     log: true,
    //     learningRate: 0.3, //随着delta的缩放以影响训练率-->介于0和1之间的数字动量
    //     logPeriod: 100,
    //     callbackPeriod: 100,
    //     callback: () => {
    //       console.log('callback');
    //       this.trainingProgress += 1
    //       console.log(this.trainingProgress, 'this.trainingProgress');
    //     }
    //   });
    //   this.isTraining = false;
    //   this.trainingProgress = 100
    //   console.log(this.isTraining, 'isTraining');
    //
    //   console.log(this.trainingProgress, 'this.trainingProgress');
    //
    // },
    // 测试模型
    testModel(input) {
      return this.net.run(input);
    },
    // 保存模型
    saveModel() {
      const modelJson = this.net.toJSON();
      const blob = new Blob([JSON.stringify(modelJson)], {type: 'application/json'});
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'model.json';
      a.click();
    },
    // 加载模型
    loadModel(file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const modelJson = JSON.parse(e.target.result);
        this.net.fromJSON(modelJson);
      };
      reader.readAsText(file);
    },
  },
});
