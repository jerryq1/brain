// model.worker.js
import {recurrent,utilities} from 'brain.js';

self.addEventListener('message', async (e) => {
  const {trainingData, iterations, errorThresh} = e.data;

  // 创建独立网络实例
  const net = new recurrent.LSTM({
    hiddenLayers: [64, 64],  // 双隐藏层增强表达能力
    learningRate: 0.01
  });

  try {
    self.postMessage('进入worker');
    const model = net.train(trainingData, {
      iterations,
      errorThresh,
      log: true,
      learningRate: 0.01,
      logPeriod: 100,
      callbackPeriod: 100,
      callback: (status) => {
        // 发送训练进度
        if ( status && typeof status.iterations === "number" && status.iterations < iterations) {
          self.postMessage({
            type: 'progress',
            progress: (status.iterations / iterations * 100),
            errorThreshNow:status.error
          });
        }

      }
    });

    // 训练完成发送结果

    // 下面这行必须要,否则会因为训练成果序列化(net.toJSON())报错
    net.trainOpts.callback = null
    self.postMessage({
      type: 'complete',
      model: net.toJSON(),
    });
    const svg = utilities.toSVG(net,{
      width:800,
      height:500
    });
    self.postMessage({
      type: 'svg',
      svg
    });

  } catch (error) {
    self.postMessage({
      type: 'error',
      error: error.message
    });
  }
});
