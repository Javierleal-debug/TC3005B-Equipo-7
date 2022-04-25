import React from 'react'
import { Tile, AspectRatio, Grid, Column, Dropdown } from 'carbon-components-react'
import { DonutChart } from "@carbon/charts-react";
import "@carbon/charts/styles.css";
import "./_dashboard.scss";

// No olvidar descomentariar el <React.StrictMode> del index.js

const items = [
  {
    id: 'today',
    label: 'Hoy',
  },
  {
    id: 'day1',
    label: '1 días',
  },
  {
    id: 'day2',
    label: '2 días',
  },
  {
    id: 'day3',
    label: '3 días',
  },
  {
    id: 'day4',
    label: '4 días',
  },
  {
    id: 'day5',
    label: '5 días',
  },
];

const data = [
  {
    group: "Out",
    value: 2099
  },
  {
    group: "In",
    value: 428
  }
]

const options = {
  resizable: true,
  donut: {
    center: {
      label: "Total devices"
    },
    alignment: "center"
  },
  height: "400px"
}

const Dashboard = () => {
  return (
    <AspectRatio>
      <Tile className="titleDashboard">
        Cuadro de Mando
      </Tile>
      <Grid className="bodyDashboard">
        <Column sm={1} md={2} lg={5}>
          <AspectRatio ratio="16x9" className="devices">
            <Grid>
              <Column sm={2} 
                className="titleDevices"
              >
                Devices Distribution
              </Column>
              <Column sm={2}>
                <Dropdown
                  className="dropwdownDays"
                  items={items}
                  initialSelectedItem={items[0]}
                  size="sm"
                />
              </Column>
            </Grid>
            <AspectRatio 
              ratio={'0.5x0.5'} 
              className= "chartDevices"
            >
              <DonutChart
                data={data}
                options={options}
              ></DonutChart>
            </AspectRatio>
          </AspectRatio>
        </Column>

        <Column sm={1} md={2} lg={5}>
          <AspectRatio ratio="16x9" className="devices">
            <Grid>
              <Column sm={2} className="titleDevices">
                Devices Out
              </Column>
              <Column sm={2}>
                <Dropdown
                  className="dropwdownDays"
                  items={items}
                  initialSelectedItem={items[0]}
                  size="sm"
                />
              </Column>
              <Column sm={3} className="numberDevicesOut">
                1
              </Column>
            </Grid>
          </AspectRatio>
        </Column>
        <Column sm={1} md={2} lg={5}>
          <AspectRatio ratio="16x9" className="devices">
            <Grid>
              <Column sm={2} className="titleDevices">
                Devices In
              </Column>
              <Column sm={2} className="dropwdownDays">
                <Dropdown
                  items={items}
                  initialSelectedItem={items[0]}
                  size="sm"
                />
              </Column>
              <Column sm={4}>
                0
              </Column>
              <Column sm={4}>
                Sin datos
              </Column>
            </Grid>

          </AspectRatio>
        </Column>
      </Grid>
    </AspectRatio>
  )
}

export default Dashboard
