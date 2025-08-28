declare module 'react-plotly.js' {
  import { Component } from 'react';
  
  interface PlotProps {
    data: unknown[];
    layout: Record<string, unknown>;
    config?: Record<string, unknown>;
    frames?: unknown[];
    style?: Record<string, unknown>;
    className?: string;
    useResizeHandler?: boolean;
    debug?: boolean;
    onInitialized?: (figure: unknown) => void;
    onUpdate?: (figure: unknown) => void;
    onPurge?: (figure: unknown) => void;
    onClick?: (event: unknown) => void;
    onDoubleClick?: (event: unknown) => void;
    onHover?: (event: unknown) => void;
    onUnHover?: (event: unknown) => void;
    onSelected?: (event: unknown) => void;
    onDeselect?: (event: unknown) => void;
    onRelayout?: (event: unknown) => void;
    onRestyle?: (event: unknown) => void;
    onRedraw?: (event: unknown) => void;
    onAfterPlot?: (event: unknown) => void;
    onAnimated?: (event: unknown) => void;
    onAnimatingFrame?: (event: unknown) => void;
    onAnimationInterrupted?: (event: unknown) => void;
    onSliderChange?: (event: unknown) => void;
    onSliderEnd?: (event: unknown) => void;
    onSliderStart?: (event: unknown) => void;
    onSunburstClick?: (event: unknown) => void;
    onTreemapClick?: (event: unknown) => void;
    onLegendClick?: (event: unknown) => void;
    onLegendDoubleClick?: (event: unknown) => void;
    onMapboxClick?: (event: unknown) => void;
    onMapboxHover?: (event: unknown) => void;
    onMapboxUnHover?: (event: unknown) => void;
    onMapboxSelected?: (event: unknown) => void;
    onMapboxDeselect?: (event: unknown) => void;
    onMapboxRelayout?: (event: unknown) => void;
    onMapboxRestyle?: (event: unknown) => void;
    onMapboxRedraw?: (event: unknown) => void;
    onMapboxAfterPlot?: (event: unknown) => void;
    onMapboxAnimated?: (event: unknown) => void;
    onMapboxAnimatingFrame?: (event: unknown) => void;
    onMapboxAnimationInterrupted?: (event: unknown) => void;
    onMapboxSliderChange?: (event: unknown) => void;
    onMapboxSliderEnd?: (event: unknown) => void;
    onMapboxSliderStart?: (event: unknown) => void;
    onMapboxSunburstClick?: (event: unknown) => void;
    onMapboxTreemapClick?: (event: unknown) => void;
    onMapboxLegendClick?: (event: unknown) => void;
    onMapboxLegendDoubleClick?: (event: unknown) => void;
  }
  
  class Plot extends Component<PlotProps> {}
  
  export default Plot;
}
