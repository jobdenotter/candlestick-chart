import React, { Component } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceArea } from 'recharts';
import CandleStick from './candleStick';

// pricedata in format { date:date, low:low, high:high, open:open, close:close }
class CandleStickChart extends Component {
  state = {
    zoomStart: null,
    zoomEnd: null,
    dataStart: null,
    dataEnd: null,
  };

  prepareData = (data) => {
    const { dataStart, dataEnd } = this.state;
    if (dataStart && dataEnd) {
      data = data.slice(dataStart, dataEnd);
    }
    return data.map(({ open, close, ...other }) => {
      return {
        ...other,
        openClose: [open, close],
      };
    });
  };

  onMouseDown = (e) => {
    this.setState({ zoomStart: e.activeLabel });
  };

  onMouseMove = (e) => {
    if (this.state.zoomStart) {
      this.setState({ zoomEnd: e.activeLabel });
    }
  };

  onMouseUp = (e, data) => {
    let { zoomStart, zoomEnd } = this.state;
    if (zoomStart === zoomEnd) {
      this.setState({ zoomStart: null, zoomEnd: null });
    } else if (zoomStart && !zoomEnd) {
      this.setState({ zoomStart: null });
    } else if (zoomStart && zoomEnd) {
      if (zoomEnd < zoomStart) [zoomStart, zoomEnd] = [zoomEnd, zoomStart];
      const dates = data.map((d) => d.date);
      const dataStart = dates.indexOf(zoomStart);
      const dataEnd = dates.indexOf(zoomEnd);
      this.setState({ dataStart, dataEnd, zoomStart: null, zoomEnd: null });
    }
  };

  render() {
    let { data } = this.props;
    if (!data) return;

    const { zoomStart, zoomEnd } = this.state;

    data = this.prepareData(data);

    const minValue = Math.round(Math.min(...data.map((d) => d.low)));
    const maxValue = Math.ceil(Math.max(...data.map((d) => d.high)));

    return (
      <div style={{ userSelect: 'none', width: '100%' }}>
        <ResponsiveContainer width='100%' height={400}>
          <BarChart
            width={1000}
            height={500}
            data={data}
            margin={{ top: 10, left: 10 }}
            onMouseDown={this.onMouseDown}
            onMouseMove={this.onMouseMove}
            onMouseUp={(e) => this.onMouseUp(e, data)}
          >
            <XAxis dataKey='date' />
            <YAxis domain={[minValue, maxValue]} />
            <CartesianGrid strokeDasharray='3 3' />
            <Tooltip />
            <Bar dataKey='openClose' shape={<CandleStick />} />
            {zoomStart && zoomEnd ? <ReferenceArea x1={zoomStart} x2={zoomEnd} strokeOpacity={0.3} /> : null}
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }
}

export default CandleStickChart;
