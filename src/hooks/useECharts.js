import _echarts from "@/utils/echarts";
import { tryOnBeforeUnmount, tryOnMounted } from "@vueuse/core";
import throttle from "lodash/throttle";
import elementResizeDetectorMaker from "element-resize-detector";
import { unref } from "vue";

export const useEcharts = (element, options) => {
  let chartInstance = null;
  const resizeMaker = elementResizeDetectorMaker();

  tryOnMounted(() => {
    if (!element) {
      return;
    }
    chartInstance = _echarts.init(unref(element));
    chartInstance.setOption(options);
    resizeMaker.listenTo(
      { callOnAdd: false },
      unref(element),
      throttle(() => {
        chartInstance.resize();
      }, 300)
    );
  });

  tryOnBeforeUnmount(() => {
    resizeMaker.uninstall(unref(element));
  });
  const updateOptions = (options) => {
    chartInstance && chartInstance.setOption(options);
  };
  return {
    _echarts,
    updateOptions,
  };
};
