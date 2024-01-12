import { Box, Heading, Stack, ResponsiveContext } from "grommet";
import { VictoryLine, VictoryChart, VictoryArea, VictoryAxis } from "victory";
import Countdown from "react-countdown";
import { useContext } from "react";
import { MainComponentContext } from "../contexts/MainComponentContext";

// Timer
const renderer = ({ seconds, milliseconds }) => {
  milliseconds /= 100;
  return (
    <span>
      {seconds}.{milliseconds}
    </span>
  );
};

const MainBetting = () => {
  const size = useContext(ResponsiveContext);
  const { data, gameStartTime } = useContext(MainComponentContext);
  const date = Math.abs(gameStartTime - Date.now());

  return (
    <>
      {size === "small" && (
        <>
          <Box
            gridArea="chart"
            background="#171717"
            fill={true}
            pad="small"
            round="xsmall"
            responsive={true}
            border={{ color: "#1B1B1B", size: "large" }}
          >
            <Stack anchor="center" fill={true}>
              <VictoryChart
                maxDomain={{ x: 0.69314, y: 2 }}
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
                      fontSize: 19,
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
                      fontSize: 19,
                      fontFamily: "HelveticaNeueBd",
                    },
                  }}
                  tickFormat={(t) => `${t * 10}`}
                />
                <VictoryArea data={data} />
                <VictoryLine
                  style={{
                    data: { stroke: "#6FFFB0", strokeWidth: 5 },
                    parent: { border: "20px solid #fff" },
                  }}
                  data={data}
                  interpolation="natural"
                />
              </VictoryChart>
              <Box
                animation={{ type: "zoomIn", duration: 300, size: "medium" }}
              >
                <Heading
                  size="small"
                  alignSelf="center"
                  textAlign="center"
                  margin="none"
                >
                  Next Round In{" "}
                  <Countdown
                    date={Date.now() + date}
                    intervalDelay={0}
                    precision={1}
                    renderer={renderer}
                  />
                  s
                </Heading>
              </Box>
            </Stack>
          </Box>
        </>
      )}
      {size === "medium" && (
        <>
          <Box
            gridArea="chart"
            background="#171717"
            fill={true}
            pad="small"
            round="xsmall"
            responsive={true}
            border={{ color: "#1B1B1B", size: "large" }}
          >
            <Stack anchor="center" fill={true}>
              <VictoryChart
                maxDomain={{ x: 0.69314, y: 2 }}
                minDomain={{ x: 0, y: 1 }}
                height={700}
                width={1390}
              >
                <VictoryAxis
                  dependentAxis
                  orientation="left"
                  style={{
                    axis: { stroke: "#AAAAAA", strokeWidth: 1.5 },
                    tickLabels: {
                      fill: "#AAAAAA",
                      fontSize: 28,
                      fontFamily: "HelveticaNeueBd",
                    },
                  }}
                  tickFormat={(t) => `${t}x`}
                />
                <VictoryAxis
                  orientation="bottom"
                  style={{
                    axis: { stroke: "#AAAAAA", strokeWidth: 1.5 },
                    tickLabels: {
                      fill: "#AAAAAA",
                      strokeWidth: 2,
                      fontSize: 28,
                      fontFamily: "HelveticaNeueBd",
                    },
                  }}
                  tickFormat={(t) => `${t * 10}`}
                />
                <VictoryArea data={data} />
                <VictoryLine
                  style={{
                    data: { stroke: "#6FFFB0", strokeWidth: 5 },
                    parent: { border: "20px solid #fff" },
                  }}
                  data={data}
                  interpolation="natural"
                />
              </VictoryChart>
              <Box
                animation={{ type: "zoomIn", duration: 300, size: "medium" }}
              >
                <Heading
                  size="small"
                  alignSelf="center"
                  textAlign="center"
                  margin="none"
                >
                  Next Round In{" "}
                  <Countdown
                    date={Date.now() + date}
                    intervalDelay={0}
                    precision={1}
                    renderer={renderer}
                  />
                  s
                </Heading>
              </Box>
            </Stack>
          </Box>
        </>
      )}
      {(size === "large" || size === "xlarge") && (
        <>
          <Box
            gridArea="chart"
            background="#171717"
            fill={true}
            pad="small"
            round="xsmall"
            responsive={true}
            border={{ color: "#1B1B1B", size: "large" }}
          >
            <Stack anchor="center" fill={true}>
              <VictoryChart
                maxDomain={{ x: 0.69314, y: 2 }}
                minDomain={{ x: 0, y: 1 }}
                height={700}
                width={1390}
              >
                <VictoryAxis
                  dependentAxis
                  orientation="left"
                  style={{
                    axis: { stroke: "#AAAAAA", strokeWidth: 2 },
                    tickLabels: {
                      fill: "#AAAAAA",
                      fontSize: 30,
                      fontFamily: "HelveticaNeueBd",
                    },
                  }}
                  tickFormat={(t) => `${t}x`}
                />
                <VictoryAxis
                  orientation="bottom"
                  style={{
                    axis: { stroke: "#AAAAAA", strokeWidth: 2 },
                    tickLabels: {
                      fill: "#AAAAAA",
                      strokeWidth: 2,
                      fontSize: 30,
                      fontFamily: "HelveticaNeueBd",
                    },
                  }}
                  tickFormat={(t) => `${t * 10}`}
                />
                <VictoryArea data={data} />
                <VictoryLine
                  style={{
                    data: { stroke: "#6FFFB0", strokeWidth: 5 },
                    parent: { border: "20px solid #fff" },
                  }}
                  data={data}
                  interpolation="natural"
                />
              </VictoryChart>
              <Box
                animation={{ type: "zoomIn", duration: 300, size: "medium" }}
              >
                <Heading
                  size="medium"
                  alignSelf="center"
                  textAlign="center"
                  margin="none"
                >
                  Next Round In{" "}
                  <Countdown
                    date={Date.now() + date}
                    intervalDelay={0}
                    precision={1}
                    renderer={renderer}
                  />
                  s
                </Heading>
              </Box>
            </Stack>
          </Box>
        </>
      )}
    </>
  );
};

export default MainBetting;
