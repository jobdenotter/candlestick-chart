// note: pixels are counted from the top
const CandleStick = (props) => {
  const {
    x,
    y,
    width,
    height,
    low,
    high,
    openClose: [open, close],
  } = props;

  const isGrowing = open < close;
  const color = isGrowing ? 'green' : 'red';

  const absHeight = Math.abs(height);

  const candleLeft = x;
  const candleBottom = isGrowing ? y + absHeight : y;
  const candleTop = isGrowing ? y : y - absHeight;
  const candleHorizontalMiddle = candleLeft + width / 2;

  const pixelValueRatio = absHeight / Math.abs(open - close);
  const bottomLineLength = (Math.min(close, open) - low) * pixelValueRatio;
  const topLineLength = (high - Math.max(close, open)) * pixelValueRatio;

  return (
    <g stroke={color} fill={color} strokeWidth='2'>
      <rect x={candleLeft} y={candleTop} height={absHeight} width={width} />
      <line
        x1={candleHorizontalMiddle}
        x2={candleHorizontalMiddle}
        y1={candleBottom}
        y2={candleBottom + bottomLineLength}
      />
      <line x1={candleHorizontalMiddle} x2={candleHorizontalMiddle} y1={candleTop} y2={candleTop - topLineLength} />
    </g>
  );
};

export default CandleStick;
