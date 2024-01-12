import { Box, Heading, Stack, ResponsiveContext } from "grommet";
import { VictoryLine, VictoryChart, VictoryArea, VictoryAxis } from "victory";
import { useContext } from "react";
import { MainComponentContext } from "../contexts/MainComponentContext";

const MainCrashed = () => {
  const size = useContext(ResponsiveContext);
  const { data, crashPoint } = useContext(MainComponentContext);

  return (
    <>
      {size === "small" && (
        <Box
          gridArea="chart"
          background="#171717"
          align="center"
          fill={true}
          pad="small"
          round="xsmall"
          border={{ color: "#1B1B1B", size: "large" }}
        >
          <Stack anchor="center" fill>
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
                  data: { stroke: "#6FFFB0", strokeWidth: 5, border: "10px" },
                  parent: { border: "50px solid #fff" },
                }}
                data={data}
                interpolation="natural"
              />
            </VictoryChart>
            <Box animation={{ type: "zoomOut", duration: 100, size: "large" }}>
              <Heading
                size="medium"
                color="#FF4040"
                alignSelf="center"
                margin="none"
                textAlign="center"
              >
                CRASHED <br /> @{crashPoint}x
              </Heading>
            </Box>
          </Stack>
        </Box>
      )}
      {size === "medium" && (
        <Box
          gridArea="chart"
          background="#171717"
          align="center"
          fill={true}
          pad="small"
          round="xsmall"
          border={{ color: "#1B1B1B", size: "large" }}
        >
          <Stack anchor="center" fill>
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
                  data: { stroke: "#6FFFB0", strokeWidth: 5, border: "10px" },
                  parent: { border: "50px solid #fff" },
                }}
                data={data}
                interpolation="natural"
              />
            </VictoryChart>
            <Box animation={{ type: "zoomOut", duration: 100, size: "large" }}>
              <Heading
                size="medium"
                color="#FF4040"
                alignSelf="center"
                margin="none"
                textAlign="center"
              >
                CRASHED <br /> @{crashPoint}x
              </Heading>
            </Box>
          </Stack>
        </Box>
      )}
      {(size === "large" || size === "xlarge") && (
        <Box
          gridArea="chart"
          background="#171717"
          align="center"
          fill={true}
          pad="small"
          round="xsmall"
          border={{ color: "#1B1B1B", size: "large" }}
        >
          <Stack anchor="center" fill>
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
                  data: { stroke: "#6FFFB0", strokeWidth: 5, border: "10px" },
                  parent: { border: "50px solid #fff" },
                }}
                data={data}
                interpolation="natural"
              />
            </VictoryChart>
            <Box animation={{ type: "zoomOut", duration: 100, size: "large" }}>
              <Heading
                size="large"
                color="#FF4040"
                alignSelf="center"
                margin="none"
                textAlign="center"
              >
                CRASHED <br /> @{crashPoint}x
              </Heading>
            </Box>
          </Stack>
        </Box>
      )}
    </>
  );
};

export default MainCrashed;
