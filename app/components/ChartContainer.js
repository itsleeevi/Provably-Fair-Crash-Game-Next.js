import React, { useState, useEffect, useContext } from "react";
import { VictoryLine, VictoryChart, VictoryArea, VictoryAxis } from "victory";
import { Box, Heading, Stack, ResponsiveContext } from "grommet";
import { CrashContext } from "../contexts/CrashContext";

const ChartContainer = ({ socket, color }) => {
  const [data, setData] = useState([{ x: 0, y: 1 }]);
  const [maxX, setMaxX] = useState(0.69314);
  const [maxY, setMaxY] = useState(2);
  const [loaded, setLoaded] = useState(false);
  const [hasCrashed, setHasCrashed] = useState(false); // Flag to indicate crash
  const { setExitMultiplier, initiatedCashOut } = useContext(CrashContext);
  const size = useContext(ResponsiveContext);

  useEffect(() => {
    socket.on("chartArray", (receivedChartArray) => {
      if (!loaded) {
        setData(receivedChartArray);

        setLoaded(true);
      }
    });

    socket.on("newChartPoint", (newPoint) => {
      if (!hasCrashed) {
        setData((prevData) => [...prevData, newPoint]);
        //setCurrentMultiplier(newPoint.y.toFixed(2));
        setMaxX((prevMaxX) => Math.max(prevMaxX, newPoint.x));
        setMaxY((prevMaxY) => Math.max(prevMaxY, newPoint.y));
      }
    });

    socket.on("crashEvent", () => {
      setHasCrashed(true);
      setData([{ x: 0, y: 1 }]);
    });
    if (initiatedCashOut) setExitMultiplier(data[data.length - 1].y.toFixed(2));
    // Cleanup function
    return () => {
      socket.off("chartArray");
      socket.off("newChartPoint");
      socket.off("crashEvent");
    };
  }, [socket, loaded, hasCrashed]);

  const renderChart = () => {
    return (
      <Box
        gridArea="chart"
        background="#171717"
        fill={true}
        pad="small"
        round="xsmall"
        responsive={true}
        border={{ color: "#1B1B1B", size: "large" }}
      >
        <Stack anchor="center" fill>
          <VictoryChart
            maxDomain={{ x: maxX, y: maxY }}
            minDomain={{ x: 0, y: 1 }}
            height={700}
            width={1390}
          >
            <VictoryAxis
              dependentAxis
              orientation="left"
              style={{
                axis: { stroke: "#AAAAAA", strokeWidth: 1 },
                tickLabels: {
                  fill: "#AAAAAA",
                  fontSize: size === "small" ? 19 : 28,
                  fontFamily: "HelveticaNeueBd",
                },
              }}
              tickFormat={(t) => `${t}x`}
            />
            <VictoryAxis
              orientation="bottom"
              style={{
                axis: { stroke: "#AAAAAA", strokeWidth: 1 },
                tickLabels: {
                  fill: "#AAAAAA",
                  strokeWidth: 2,
                  fontSize: size === "small" ? 19 : 28,
                  fontFamily: "HelveticaNeueBd",
                },
              }}
              tickFormat={(t) => `${t * 10}`}
            />
            <VictoryArea data={data} />
            <svg>
              <defs>
                <linearGradient
                  id="myGradient"
                  x1="0%"
                  y1="0%"
                  x2="0%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#FFCA58" />
                  <stop offset="100%" stopColor={color} />
                </linearGradient>
              </defs>
            </svg>
            <VictoryLine
              style={{
                data: {
                  stroke: "url(#myGradient)",
                  strokeWidth: 15,
                  border: "10px",
                },
                parent: { border: "50px solid #fff" },
              }}
              data={data} //props.data
              interpolation="natural"
            />
          </VictoryChart>
          <Box
            animation={{
              type: "zoomOut",
              duration: 50,
              size: "large",
            }}
          >
            <Heading
              size="large"
              color={color}
              alignSelf="center"
              margin="none"
            >
              <>{data[data.length - 1].y.toFixed(2) + "x"}</>
            </Heading>
          </Box>
        </Stack>
      </Box>
    );
  };

  return (
    <>
      {size === "small" && renderChart()}
      {size === "medium" && renderChart()}
      {(size === "large" || size === "xlarge") && renderChart()}
    </>
  );
};

export default ChartContainer;
