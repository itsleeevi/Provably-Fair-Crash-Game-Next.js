import {
  Box,
  DataTable,
  Text,
  Meter,
  ResponsiveContext,
  Tab,
  Tabs,
  TextInput,
} from "grommet";
import { Achievement, Shield } from "grommet-icons";
import { useContext } from "react";
import { CrashContext } from "../contexts/CrashContext";
import { MainComponentContext } from "../contexts/MainComponentContext";

const ResultTable = () => {
  const size = useContext(ResponsiveContext);
  const { resultTableAll, historyAll } = useContext(MainComponentContext);
  const { color } = useContext(CrashContext);

  // Define the properties that change based on the size.
  const textSize =
    size === "small" ? "8px" : size === "medium" ? "xsmall" : "small";
  const meterSize = size === "small" ? "xxsmall" : "small";

  // Define the sort state inline, since it's not being changed dynamically here.
  const sort = {
    property: "bet",
    direction: "desc",
  };

  // Define a single set of column definitions that can be reused.
  const columns = [
    {
      property: "user",
      header: (
        <Text weight="bold" size={textSize}>
          USER
        </Text>
      ),
      primary: true,
      verticalAlign: "middle",
      render: (datum) => (
        <Text truncate weight="bold" color="#EDEDED" size={textSize}>
          {datum.user}
        </Text>
      ),
    },
    {
      property: "at",
      header: (
        <Text weight="bold" size={textSize}>
          @
        </Text>
      ),
      primary: false,
      verticalAlign: "middle",
      render: function (datum) {
        if (datum.profit >= 0) {
          return (
            <Text truncate weight="bold" color="#00C781" size={textSize}>
              {datum.at}
            </Text>
          );
        } else {
          return (
            <Text truncate weight="bold" color="#FF4040" size={textSize}>
              {datum.at}
            </Text>
          );
        }
      },
    },
    {
      property: "bet",
      header: (
        <Text weight="bold" size={textSize}>
          BET
        </Text>
      ),
      primary: false,
      verticalAlign: "middle",
      render: function (datum) {
        return (
          <Text truncate weight="bold" color="#EDEDED" size={textSize}>
            {datum.bet}
          </Text>
        );
      },
    },
    {
      property: "profit",
      header: (
        <Text weight="bold" size={textSize}>
          PROFIT
        </Text>
      ),
      primary: false,
      verticalAlign: "middle",
      render: function (datum) {
        if (datum.profit >= 0) {
          return (
            <Text truncate weight="bold" color="#00C781" size={textSize}>
              {datum.profit && datum.profit.toFixed(2)}
            </Text>
          );
        } else {
          return (
            <Text truncate weight="bold" color="#FF4040" size={textSize}>
              {datum.profit && datum.profit.toFixed(2)}
            </Text>
          );
        }
      },
    },
    {
      property: "bravery",
      header: (
        <Text weight="bold" size={textSize}>
          BRAVERY
        </Text>
      ),
      verticalAlign: "middle",
      render: (datum) => (
        <Box pad={{ vertical: "xsmall" }}>
          <Meter
            values={[{ value: datum.bravery, color }]}
            thickness="small"
            size={meterSize}
            background="#1B1B1B"
          />
        </Box>
      ),
    },
  ];

  const columnsHistory = [
    {
      property: "hashedServerSeed",
      header: (
        <Text weight="bold" size={textSize}>
          HASH
        </Text>
      ),
      primary: false,
      verticalAlign: "middle",
      render: function (datum) {
        return <TextInput value={datum.hashedServerSeed} size={textSize} />;
      },
    },
    {
      property: "serverSeed",
      header: (
        <Text weight="bold" size={textSize}>
          SEED
        </Text>
      ),
      primary: false,
      verticalAlign: "middle",
      render: function (datum) {
        if (datum.serverSeed === null)
          return <TextInput value={"SECRET"} size={textSize} />;
        else return <TextInput value={datum.serverSeed} size={textSize} />;
      },
    },
    {
      property: "nonce",
      header: (
        <Text weight="bold" size={textSize}>
          NONCE
        </Text>
      ),
      primary: false,
      verticalAlign: "middle",
      render: function (datum) {
        return <Text size={textSize}>{datum.nonce ? datum.nonce : "?"}</Text>;
      },
    },
    {
      property: "crashPoint",
      header: (
        <Text weight="bold" size={textSize}>
          CRASH
        </Text>
      ),
      verticalAlign: "middle",
      render: (datum) => (
        <Text weight="bold" size={textSize} color={color}>
          {datum.crashPoint ? datum.crashPoint + "x" : "?"}
        </Text>
      ),
    },
    {
      property: "maxMultiplier",
      header: (
        <Text weight="bold" size={textSize}>
          MAX
        </Text>
      ),
      verticalAlign: "middle",
      render: (datum) => (
        <Text weight="bold" size={textSize} color={color}>
          {datum.maxMultiplier ? datum.maxMultiplier + "x" : "?"}
        </Text>
      ),
    },
  ];

  return (
    <Box
      gridArea="resultTable"
      background="#1B1B1B"
      align="center"
      pad="small"
      round="xsmall"
      animation={{ type: "fadeIn", duration: 390 }}
    >
      <Tabs fill={true} flex="grow" justify="center">
        <Tab title="Leaderboard" icon={<Achievement />} flex="grow">
          <Box overflow="auto" fill={true} background="#171717">
            <DataTable
              alignSelf="center"
              step={50}
              show={10}
              sort={sort}
              onSort={() => {}}
              background={{
                header: { color: "#171717", opacity: "medium" },
                body: ["#171717", "#1E1E1E"],
                footer: { color: "dark-3", opacity: "strong" },
              }}
              columns={columns}
              data={resultTableAll}
            />
          </Box>
        </Tab>
        <Tab title="Crash History" icon={<Shield />} flex="grow">
          <Box fill={true} background="#171717">
            <DataTable
              size="520px"
              alignSelf="center"
              step={50}
              show={10}
              background={{
                header: { color: "#171717", opacity: "medium" },
                body: ["#171717", "#1E1E1E"],
                footer: { color: "dark-3", opacity: "strong" },
              }}
              columns={columnsHistory}
              data={historyAll}
              fill
            />
          </Box>
        </Tab>
      </Tabs>
    </Box>
  );
};

export default ResultTable;
