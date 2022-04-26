import React from 'react'
import {
  FormLabel,
  DatePicker,
  DatePickerInput,
  Tile,
  AspectRatio,
  Grid,
  Column,
  Dropdown,
} from 'carbon-components-react'
import { DonutChart } from '@carbon/charts-react'
import '@carbon/charts/styles.css'
import './_dashboard.scss'

// No olvidar descomentariar el <React.StrictMode> del index.js

const data = [
  {
    group: 'Out',
    value: 2099,
  },
  {
    group: 'In',
    value: 428,
  },
]

const options = {
  resizable: true,
  donut: {
    center: {
      label: 'Total devices',
    },
    alignment: 'center',
  },
  height: '400px',
}

const Dashboard = () => {
  return (
    <div>
      <Tile className="titleDashboard">Cuadro de Mando</Tile>
      <Grid className="bodyDashboard">
        <Column sm={1} md={3} lg={5}>
          <AspectRatio ratio="16x9" className="devices">
            <div id="deviceDistribution">
              <FormLabel className="titleDevices">
                Devices Distribution
              </FormLabel>
              <DatePicker className="datepicker" datePickerType="single">
                <DatePickerInput
                  placeholder="mm/dd/yyyy"
                  id="date-picker-single"
                  size="sm"
                />
              </DatePicker>
            </div>
            <AspectRatio ratio={'0.5x0.5'} className="chartDevices">
              <DonutChart data={data} options={options}></DonutChart>
            </AspectRatio>
          </AspectRatio>
        </Column>

        <Column sm={1} md={3} lg={5}>
          <AspectRatio ratio="16x9" className="devices">
            <FormLabel className="titleDevices">Devices Out</FormLabel>
            <DatePicker className="datepicker" datePickerType="single">
              <DatePickerInput
                placeholder="mm/dd/yyyy"
                id="date-picker-single"
                size="sm"
              />
            </DatePicker>
            <AspectRatio ratio={'0.5x0.5'} className="infoDevices">
              <Grid>
                <Column sm={4} className="numberDevices">
                  1
                </Column>
              </Grid>
            </AspectRatio>
          </AspectRatio>
        </Column>
        <Column sm={1} md={3} lg={5}>
          <AspectRatio ratio="16x9" className="devices">
            <FormLabel className="titleDevices">Devices In</FormLabel>
            <DatePicker className="datepicker" datePickerType="single">
              <DatePickerInput
                placeholder="mm/dd/yyyy"
                id="date-picker-single"
                size="sm"
              />
            </DatePicker>
            <AspectRatio ratio={'0.5x0.5'} className="infoDevices">
              <Grid>
                <Column sm={4} className="numberDevices">
                  0
                </Column>
                <Column sm={4} className="infoIn">
                  Sin datos
                </Column>
              </Grid>
            </AspectRatio>
          </AspectRatio>
        </Column>
      </Grid>
    </div>
  )
}

export default Dashboard
