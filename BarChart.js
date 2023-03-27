import React from 'react';
import { View, Text } from 'react-native';
import { Svg, Rect, Text as SvgText } from 'react-native-svg';

const BarChart = ({ data }) => {
  const barWidth = 40;
  const barMargin = 10;
  const chartWidth = data.length * (barWidth + barMargin) - barMargin;
  const chartHeight = 200;
  const maxCount = Math.max(...data.map((item) => item.count));

  return (
    <View style={{ alignItems: 'center', paddingTop:20 }}>
      <Svg width={chartWidth} height={chartHeight}>
        {data.map((item, index) => (
          <React.Fragment key={index}>
            <Rect
              x={index * (barWidth + barMargin)}
              y={chartHeight - (item.count / maxCount) * chartHeight}
              width={barWidth}
              height={(item.count / maxCount) * chartHeight}
              rx={5}
              fill="#e88017"
            />
            <SvgText
              x={index * (barWidth + barMargin) + barWidth / 2}
              
              y={item.count >= maxCount ? chartHeight - (item.count / maxCount) * chartHeight - barMargin / 2 + 20 : chartHeight - (item.count / maxCount) * chartHeight - barMargin / 2}

              fill={item.count >= maxCount ? "white" : "black"}
              textAnchor="middle"
            >
              {item.count}
            </SvgText>
          </React.Fragment>
        ))}
      </Svg>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          width: chartWidth - barWidth + barMargin,
        }}
      >
        {data.map((item, index) => (
          <Text key={index}>{item.grade}</Text>
        ))}
      </View>
    </View>
  );
};

export default BarChart;