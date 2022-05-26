//echarts按需引入
import * as _echarts from "echarts/core";
import { LineChart } from "echarts/charts";
import { TitleComponent, TooltipComponent, GridComponent } from "echarts/components";
import { LabelLayout, UniversalTransition } from "echarts/features";
import { CanvasRenderer } from "echarts/renderers";

_echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LineChart,
  LabelLayout,
  UniversalTransition,
  CanvasRenderer,
]);

export default _echarts;
