import React, { useEffect, useState } from 'react'
import {
  FormLabel,
  Tile,
  AspectRatio,
  Grid,
  Column,
} from 'carbon-components-react'
import { DonutChart } from '@carbon/charts-react'
import '@carbon/charts/styles.css'
import axios from 'axios'

import Moment from 'moment'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

import { checkAuth } from '../../util'
import { useSessionData } from '../../global-context'

// No olvidar descomentariar el <React.StrictMode> del index.js

let outValue = 0
let inValue = 0

const data = [
  {
    group: 'Out',
    value: outValue,
  },
  {
    group: 'In',
    value: inValue,
  },
]

function getDate() {
  const date = new Date()
  const day = date.getDate()
  const month = date.getMonth() + 1
  const year = date.getFullYear()

  return year + '/' + month + '/' + day
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
  const getInsideDate = () => {
    var userInfo = JSON.parse(localStorage.getItem('UserInfo'))
    var requestData = {
      date: startDate,
    }
    let requestHeaders = {
      headers: {
        'x-access-token': `${userInfo['accessToken']}`,
        'Content-Type': 'application/json',
      },
    }
    axios
      .get(
        'http://localhost:3001/peripheral/insideDate',
        requestData,
        requestHeaders
      )
      .then(({ data }) => {
        inValue = data.value
        console.log('value In:' + data.value)
      })
  }

  const getOutDate = () => {
    var userInfo = JSON.parse(localStorage.getItem('UserInfo'))
    var requestData = {
      date: '2022-05-18',
    }
    let requestHeaders = {
      headers: {
        'x-access-token': `${userInfo['accessToken']}`,
        'Content-Type': 'application/json',
      },
    }
    axios
      .get(
        'http://localhost:3001/peripheral/outsideDate',
        requestData,
        requestHeaders
      )
      .then(({ data }) => {
        outValue = data.value
        console.log('value Out:' + data)
      })
  }

  const { sessionData, setSessionData } = useSessionData()

  useEffect(() => {
    try {
      checkAuth(sessionData, setSessionData)
      getOutDate()
      getInsideDate()
    } catch (e) {
      window.location.hash = '/login'
    }
  }, [])

  // Variable de tipo estado [Variable, función para cambiar el valor de Variable]
  const [startDate, setStartDate] = useState(new Date())

  const handleDate = (date) => {
    setStartDate(date)
    console.log('value:' + Moment(date).format('YYYY-MM-DD'))
    console.log('value S:' + Moment(startDate).format('YYYY-MM-DD'))
    getOutDate()
    //getInsideDate()
  }

  return (
    <div>
      <Tile className="titleDashboard">
        Dashboard
        <DatePicker
          id="calendar"
          selected={startDate}
          onChange={handleDate}
          maxDate={new Date(getDate())}
          dateFormat="Y-MM-d"
          showYearDropdown
          scrollToYearDropdown
          placeholderText="YYYY-MM-DD"
        ></DatePicker>
      </Tile>
      <Grid className="bodyDashboard">
        <Column sm={1} md={3} lg={5}>
          <AspectRatio ratio="16x9" className="devices">
            <div id="deviceDistribution">
              <FormLabel className="titleDevices">
                Devices Distribution
              </FormLabel>
            </div>
            <AspectRatio ratio={'0.5x0.5'} className="chartDevices">
              <DonutChart data={data} options={options}></DonutChart>
            </AspectRatio>
          </AspectRatio>
        </Column>

        <Column sm={1} md={3} lg={5}>
          <AspectRatio ratio="16x9" className="devices">
            <FormLabel className="titleDevices">Devices Out</FormLabel>

            <AspectRatio ratio={'0.5x0.5'} className="infoDevices">
              <Grid>
                <Column sm={4} className="numberDevices">
                  {outValue}
                </Column>
              </Grid>
            </AspectRatio>
          </AspectRatio>
        </Column>
        <Column sm={1} md={3} lg={5}>
          <AspectRatio ratio="16x9" className="devices">
            <FormLabel className="titleDevices">Devices In</FormLabel>
            <AspectRatio ratio={'0.5x0.5'} className="infoDevices">
              <Grid>
                <Column sm={4} className="numberDevices">
                  {inValue}
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
