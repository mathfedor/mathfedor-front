declare module 'react-plotly.js' {
  import { Component } from 'react';
  
  interface PlotProps {
    data: any[];
    layout: any;
    config?: any;
    frames?: any[];
    style?: any;
    className?: string;
    useResizeHandler?: boolean;
    debug?: boolean;
    onInitialized?: (figure: any) => void;
    onUpdate?: (figure: any) => void;
    onPurge?: (figure: any) => void;
    onClick?: (event: any) => void;
    onDoubleClick?: (event: any) => void;
    onHover?: (event: any) => void;
    onUnHover?: (event: any) => void;
    onSelected?: (event: any) => void;
    onDeselect?: (event: any) => void;
    onRelayout?: (event: any) => void;
    onRestyle?: (event: any) => void;
    onRedraw?: (event: any) => void;
    onAfterPlot?: (event: any) => void;
    onAnimated?: (event: any) => void;
    onAnimatingFrame?: (event: any) => void;
    onAnimationInterrupted?: (event: any) => void;
    onSliderChange?: (event: any) => void;
    onSliderEnd?: (event: any) => void;
    onSliderStart?: (event: any) => void;
    onSunburstClick?: (event: any) => void;
    onTreemapClick?: (event: any) => void;
    onLegendClick?: (event: any) => void;
    onLegendDoubleClick?: (event: any) => void;
    onMapboxClick?: (event: any) => void;
    onMapboxHover?: (event: any) => void;
    onMapboxUnHover?: (event: any) => void;
    onMapboxSelected?: (event: any) => void;
    onMapboxDeselect?: (event: any) => void;
    onMapboxRelayout?: (event: any) => void;
    onMapboxRestyle?: (event: any) => void;
    onMapboxRedraw?: (event: any) => void;
    onMapboxAfterPlot?: (event: any) => void;
    onMapboxAnimated?: (event: any) => void;
    onMapboxAnimatingFrame?: (event: any) => void;
    onMapboxAnimationInterrupted?: (event: any) => void;
    onMapboxSliderChange?: (event: any) => void;
    onMapboxSliderEnd?: (event: any) => void;
    onMapboxSliderStart?: (event: any) => void;
    onMapboxSunburstClick?: (event: any) => void;
    onMapboxTreemapClick?: (event: any) => void;
    onMapboxLegendClick?: (event: any) => void;
    onMapboxLegendDoubleClick?: (event: any) => void;
  }
  
  class Plot extends Component<PlotProps> {}
  
  export default Plot;
}
