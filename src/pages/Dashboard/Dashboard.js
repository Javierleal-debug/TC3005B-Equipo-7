import React, { useEffect } from 'react'
import {
  FormLabel,
  DatePicker,
  DatePickerInput,
  Tile,
  AspectRatio,
  Grid,
  Column,
} from 'carbon-components-react'
import { DonutChart } from '@carbon/charts-react'
import '@carbon/charts/styles.css'

import { checkAuth } from '../../util'

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

function getDate() {
  const date = new Date()
  const day = date.getDate()
  const month = date.getMonth() + 1
  const year = date.getFullYear()

  return month + '/' + day + '/' + year
}

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
  useEffect(() => {
    try {
      checkAuth()
    } catch (e) {
      window.location.hash = '/login'
    }
  }, [])

  return (
    <div>
      <Tile className="titleDashboard">Dashboard</Tile>
      <Grid className="bodyDashboard">
        <Column sm={1} md={3} lg={5}>
          <AspectRatio ratio="16x9" className="devices">
            <div id="deviceDistribution">
              <FormLabel className="titleDevices">
                Devices Distribution
              </FormLabel>
              <DatePicker
                className="datepicker"
                datePickerType="single"
                maxDate={getDate()}
              >
                <DatePickerInput
                  id="date-picker-single"
                  size="sm"
                  value={getDate()}
                  placeholder="mm/dd/yyyy"
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
            <DatePicker
              className="datepicker"
              datePickerType="single"
              maxDate={getDate()}
            >
              <DatePickerInput
                id="date-picker-single"
                size="sm"
                value={getDate()}
                placeholder="mm/dd/yyyy"
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
            <DatePicker
              className="datepicker"
              datePickerType="single"
              maxDate={getDate()}
            >
              <DatePickerInput
                id="date-picker-single"
                size="sm"
                value={getDate()}
                placeholder="mm/dd/yyyy"
              />
            </DatePicker>
            <AspectRatio ratio={'0.5x0.5'} className="infoDevices">
              <Grid>
                <Column sm={4} className="numberDevices">
                  0
                </Column>
                <Column sm={4} className="infoIn">
                  No data
                </Column>
              </Grid>
            </AspectRatio>
          </AspectRatio>
        </Column>
      </Grid>
    </div>
  )
}
console.log(getDate())
export default Dashboard
