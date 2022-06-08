import React, { useEffect, useState } from 'react'
import {
  TextInputSkeleton,
  Grid,
  Column,
  Button,
  ButtonSet,
  TextAreaSkeleton,
  InlineLoading,
  ToastNotification,
  Stack,
  ButtonSkeleton
} from 'carbon-components-react'
import { Download, Calendar } from '@carbon/icons-react'
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
  const [isLoadingData, setIsLoadingData] = useState(true)
  const [isDownloadingPeripheralsData, setIsDownloadingPeripheralsData] = useState(false)
  const [isDownloadingEventsHistory, setIsDownloadingEventsHistory] = useState(false)
  const [isErrorNotificationActive, setIsErrorNotificationActive] = useState(false)

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
    title: "Devices Distribution",
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
        setIsLoadingData(false)
      }).catch(({ error }) => {
        setIsErrorNotificationActive(true)
        setIsLoadingData(false)
      })
  }

  // Variable de tipo estado [Variable, función para cambiar el valor de Variable]
  const [startDate, setStartDate] = useState(new Date())

  const handleDate = (dateChange) => {
    setStartDate(dateChange)
    date = Moment(dateChange).format('YYYY-MM-DD')
    setIsLoadingData(true)
    getInsideOutDate()
  }

  function generateFilePeripheral() {
    setIsDownloadingPeripheralsData(true)
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
        setIsDownloadingPeripheralsData(false)
      }).catch(({ error }) => {
        setIsErrorNotificationActive(true)
        setIsDownloadingPeripheralsData(false)
      })
  }
  function generateFileRecord() {
    setIsDownloadingEventsHistory(true)
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
        setIsDownloadingEventsHistory(false)
      })
      .catch(({ error }) => {
        setIsErrorNotificationActive(true)
        setIsDownloadingEventsHistory(false)
      })
  }

  return (
    <>
      <Grid className="page-content">
        <Column sm={4} md={8} lg={16} className="dashboard-title-column">
          <h1 className="new-device-title">Dashboard</h1>
        </Column>
        <Column sm={4} md={8} lg={6}>
          {isLoadingData?
          <Stack>
            <TextInputSkeleton className='dashboard-skeleton'/>
            <TextInputSkeleton className='dashboard-skeleton'/>
            <TextInputSkeleton className='dashboard-skeleton'/>
            <div className='dashboard-skeleton'>
              <ButtonSkeleton />
              &nbsp;
              <ButtonSkeleton size="sm" />
            </div>
          </Stack>
          :
          <Stack>
            <div className="dashboard-date-picker-column">
              <div className="dashboard-date-picker">
                <p className="title">
                  Date
                </p>
                <div className='wrapper1'>
                  <div className="wrapper2">
                    <DatePicker
                      id="calendar"
                      selected={startDate}
                      onChange={handleDate}
                      maxDate={new Date(getDate())}
                      dateFormat="Y-MM-d"
                      showYearDropdown
                      scrollToYearDropdown
                      placeholderText="YYYY-MM-DD"
                    >
                    </DatePicker>
                    <Calendar className="calendar-icon"/>
                  </div>
                </div>
              </div>
            </div>
            <div className="dashboard-info-column">
              <Stack>
                <div className="devices-in">
                  <p className="title">
                    Devices In
                  </p>
                  <div className='wrapper'>
                    <div className='in-value'>
                      <div>{inValue}</div>
                    </div>
                  </div>
                </div>
                <div className="devices-out">
                  <p className="title">
                    Devices Out
                  </p>
                  <div className='wrapper'>
                    <div className='out-value'>
                      <div>{outValue}</div>
                    </div>
                  </div>
                </div>
              </Stack>
            </div>
            <div className="dashboard-button-set-column">
              <ButtonSet className="dashboard-button-set">
                {(sessionData.userType === 'admin' ||
                  sessionData.userType === 'focal') && (
                  <Button
                    onClick={generateFilePeripheral}
                    disabled={isDownloadingPeripheralsData}
                    renderIcon={Download}
                  >
                    {isDownloadingPeripheralsData ? <InlineLoading description="Downloading..."/> : 'Download peripherals data'}
                  </Button>
                )}
                {sessionData.userType === 'admin' && (
                  <Button 
                  onClick={generateFileRecord} 
                  disabled={isDownloadingEventsHistory}
                  renderIcon={Download}
                  >
                    {isDownloadingEventsHistory ? <InlineLoading description="Downloading..."/> : 'Download events history'}
                  </Button>
                )}
              </ButtonSet>
            </div> 
          </Stack>}
        </Column> 
        <Column sm={4} md={8} lg={10} className="dashboard-chart-column">
          {isLoadingData? <TextAreaSkeleton></TextAreaSkeleton>:
          <DonutChart data={data} options={options}></DonutChart>}
        </Column>
        
      </Grid>

      {isErrorNotificationActive ? 
      <div className="error-notification">
        <ToastNotification
          kind="error"
          lowContrast={true}
          title="Error"
          onClose={()=>{setIsErrorNotificationActive(false)}}
          timeout={5000}
          subtitle="Something went wrong, try it later"/>
      </div> : <div></div>}
    </>
  )
}

export default Dashboard
