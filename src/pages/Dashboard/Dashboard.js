import React, { useEffect, useState } from 'react'
import {
  FormLabel,
  Tile,
  AspectRatio,
  Grid,
  Column,
  Button,
  ButtonSet,
} from 'carbon-components-react'
import { Download } from '@carbon/icons-react'
import { DonutChart } from '@carbon/charts-react'
import '@carbon/charts/styles.css'
import axios from 'axios'

import Moment from 'moment'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

import { checkAuth, redirectIfUserTypeIsNot } from '../../util'
import { useSessionData } from '../../global-context'
import { useLocation } from 'react-router-dom'

// No olvidar descomentariar el <React.StrictMode> del index.js

function getDate() {
  const date = new Date()
  const day = date.getDate()
  const month = date.getMonth() + 1
  const year = date.getFullYear()

  return year + '/' + month + '/' + day
}

var date = ''

const Dashboard = () => {
  const { sessionData, setSessionData } = useSessionData()
  const location = useLocation()

  useEffect(() => {
    checkAuth(sessionData, setSessionData, location.pathname)
    if (localStorage.getItem('UserInfo')) getInsideOutDate()
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    if (sessionData.userType) {
      redirectIfUserTypeIsNot(sessionData, 'admin', 'focal', 'security')
    }
  }, [sessionData])

  var [outValue, setOutValue] = useState(0)
  var [inValue, setInValue] = useState(0)

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
  var totalDevices = parseInt(outValue) + parseInt(inValue)
  const options = {
    resizable: true,
    donut: {
      center: {
        label: 'Total devices',
        number: totalDevices,
      },
      alignment: 'center',
    },
    height: '400px',
  }

  const getInsideOutDate = () => {
    setOutValue('')
    setInValue('')
    var userInfo = JSON.parse(localStorage.getItem('UserInfo'))
    if (date.length > 0) {
      var requestData = {
        date: date,
      }
    } else {
      var requestData = {
        date: Moment(startDate).format('YYYY-MM-DD'),
      }
    }
    let requestHeaders = {
      headers: {
        'x-access-token': `${userInfo['accessToken']}`,
        'Content-Type': 'application/json',
      },
    }
    axios
      .post(
        'https://peripheralsloanbackend.mybluemix.net/peripheral/inOutDate',
        requestData,
        requestHeaders
      )
      .then(({ data }) => {
        setInValue(data.valueIn)
        setOutValue(data.valueOut)
      })
  }

  // Variable de tipo estado [Variable, función para cambiar el valor de Variable]
  const [startDate, setStartDate] = useState(new Date())

  const handleDate = (dateChange) => {
    setStartDate(dateChange)
    date = Moment(dateChange).format('YYYY-MM-DD')
    getInsideOutDate()
  }

  function generateFilePeripheral() {
    var userInfo = JSON.parse(localStorage.getItem('UserInfo'))
    if (date.length > 0) {
      var requestData = {
        date: date,
      }
    } else {
      var requestData = {
        date: Moment(startDate).format('YYYY-MM-DD'),
      }
    }
    let requestHeaders = {
      headers: {
        'x-access-token': `${userInfo['accessToken']}`,
        'Content-Type': 'application/json',
      },
    }
    axios
      .post(
        'https://peripheralsloanbackend.mybluemix.net/peripheral/inOutDateData',
        requestData,
        requestHeaders
      )
      .then(({ data }) => {
        let csvContent = 'data:text/csv;charset=utf-8,'
        data.forEach(function (rowArray) {
          let row =
            rowArray.type +
            ',' +
            rowArray.brand +
            ',' +
            rowArray.model +
            ',' +
            rowArray.serialNumber +
            ',' +
            rowArray.acceptedConditions +
            ',' +
            rowArray.isInside +
            ',' +
            rowArray.securityAuthorization +
            ',' +
            rowArray.employeeName +
            ',' +
            rowArray.employeeEmail +
            ',' +
            rowArray.employeeSerial +
            ',' +
            rowArray.area +
            ',' +
            rowArray.mngrName +
            ',' +
            rowArray.mngrEmail +
            ',' +
            rowArray.date +
            ',' +
            rowArray.comment +
            ',' +
            rowArray.hidden
          csvContent += row + '\r\n'
        })
        var encodedUri = encodeURI(csvContent)
        window.open(encodedUri)
        var encodedUri = encodeURI(csvContent)
        var link = document.createElement('a')
        link.setAttribute('href', encodedUri)
        link.setAttribute('download', 'peripherals.csv')
        document.body.appendChild(link)
        link.click()
      })
  }
  function generateFileRecord() {
    var userInfo = JSON.parse(localStorage.getItem('UserInfo'))
    if (date.length > 0) {
      var requestData = {
        date: date,
      }
    } else {
      var requestData = {
        date: Moment(startDate).format('YYYY-MM-DD'),
      }
    }
    let requestHeaders = {
      headers: {
        'x-access-token': `${userInfo['accessToken']}`,
        'Content-Type': 'application/json',
      },
    }
    axios
      .post(
        'https://peripheralsloanbackend.mybluemix.net/record',
        requestData,
        requestHeaders
      )
      .then(({ data }) => {
        let csvContent = 'data:text/csv;charset=utf-8,'
        data.forEach(function (rowArray) {
          let row =
            rowArray.recordId +
            ',' +
            rowArray.type +
            ',' +
            rowArray.brand +
            ',' +
            rowArray.model +
            ',' +
            rowArray.serialNumber +
            ',' +
            rowArray.acceptedConditions +
            ',' +
            rowArray.isInside +
            ',' +
            rowArray.securityAuthorization +
            ',' +
            rowArray.employeeName +
            ',' +
            rowArray.employeeEmail +
            ',' +
            rowArray.employeeSerial +
            ',' +
            rowArray.area +
            ',' +
            rowArray.mngrName +
            ',' +
            rowArray.mngrEmail +
            ',' +
            rowArray.date +
            ',' +
            rowArray.actionType +
            ',' +
            rowArray.comment
          csvContent += row + '\r\n'
        })
        var encodedUri = encodeURI(csvContent)
        window.open(encodedUri)
        var encodedUri = encodeURI(csvContent)
        var link = document.createElement('a')
        link.setAttribute('href', encodedUri)
        link.setAttribute('download', 'records.csv')
        document.body.appendChild(link)
        link.click()
      })
  }

  return (
    <>
      <Tile className="titleDashboard">Dashboard</Tile>

      <div className="background-dashboard">
        <Grid className="bodyDashboard">
          <Column sm={4} md={8} lg={16}>
            <div className="btn-area-container">
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
              <ButtonSet>
                {(sessionData.userType === 'admin' ||
                  sessionData.userType === 'focal') && (
                  <Button
                    onClick={generateFilePeripheral}
                    renderIcon={Download}
                  >
                    Download peripherals data
                  </Button>
                )}
                {sessionData.userType === 'admin' && (
                  <Button onClick={generateFileRecord} renderIcon={Download}>
                    Download events history
                  </Button>
                )}
              </ButtonSet>
            </div>
          </Column>
          <Column sm={1} md={3} lg={6}>
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
    </>
  )
}

export default Dashboard
