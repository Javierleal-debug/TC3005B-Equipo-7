import axios from 'axios'
import tableHeaders from './headers.json'
import React, { useState, useEffect } from 'react'
import { TrashCan, MobileAdd, FlagFilled } from '@carbon/icons-react'
import {
  Button,
  DataTableSkeleton,
  DataTable,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  TableToolbar,
  TableToolbarContent,
  TableToolbarSearch,
  TableBatchActions,
  TableBatchAction,
  TableSelectAll,
  TableSelectRow,
  Pagination,
  SkeletonText,
  Tag,
  Modal,
  TextArea,
  InlineLoading,
  ToastNotification,
  CodeSnippet,
} from 'carbon-components-react'

import { checkAuth, getDeviceStatus } from '../../util'

import { useSessionData } from '../../global-context'
import { useLocation } from 'react-router-dom'

const DeleteDevicePopUp = ({ open, setOpen, submit, isDataLoading, handleCommentChange }) => (
  <Modal
    open={open}
    modalLabel="Peripheral device"
    modalHeading="Delete"
    primaryButtonDisabled={isDataLoading}
    primaryButtonText={
      isDataLoading ? <InlineLoading description="Loading..." /> : 'Delete'
    }
    secondaryButtonText="Cancel"
    onSecondarySubmit={() => setOpen(false)}
    onRequestClose={() => setOpen(false)}
    onRequestSubmit={submit}
    danger
  >
    <p>
      By clicking "Delete", you understand that this device(s) will no longer be
      visible to users.
    </p>
    <TextArea
      labelText="Comments (optional)"
      onChange={handleCommentChange}
      helperText="Please add comments on why this device(s) is being deleted."
      cols={50}
      rows={4}
      id="text-area-1"
    />
  </Modal>
)

var devices = []
var comment

const Devices = () => {
  const [loadingData, setLoadingData] = useState(true)
  const [searchingData, setSearchingData] = useState(false)
  const [deleteDevicePopUpOpen, setDeleteDevicePopUpOpen] = useState(false)
  const [isRequestLoading, setIsRequestLoading] = useState(false)
  const [serialNumbersToDelete, setSerialNumbersToDelete] = useState([])
  const [headers, setHeaders] = useState(tableHeaders)
  const [isNotificationErrorActive, setIsNotificationErrorActive] = useState(false)
  const [isNotificationSuccessActive, setIsNotificationSuccessActive] = useState(false)
  const [isNotificationEmptyActive, setIsNotificationEmptyActive] = useState(false)

  const [rows, setRows] = useState(null)

  let itemsPerPage = 10
  let pageNumber = 1
  const [pageConfig, setPageConfig] = useState([itemsPerPage, pageNumber])

  const handleCommentChange = (event) => {
    comment = event.target.value
  }

  const postDeleteDevices = async () => {
    setIsRequestLoading(true)
    var userInfo = JSON.parse(localStorage.getItem('UserInfo'))
    var requestData = {
      headers: {
        'x-access-token': `${userInfo['accessToken']}`,
      },
      data: {
        array: serialNumbersToDelete,
        comment: comment
      },
    }
    axios
      .delete(
        'https://peripheralsloanbackend.mybluemix.net/peripheral/',
        requestData
      )
      .then(({ data }) => {
        setDeleteDevicePopUpOpen(false)
        setIsRequestLoading(false)
        setIsNotificationSuccessActive(true)
        getItemsRequest()
      })
      .catch(function (error) {
        console.log("error")
        setDeleteDevicePopUpOpen(false)
        setIsRequestLoading(false)
        setIsNotificationErrorActive(true)
      })
  }

  const loadRows = (
    firstItemIndex = itemsPerPage * (pageNumber - 1),
    lastItemIndex = itemsPerPage * pageNumber
  ) => {
    /*let firstItemIndex = (itemsPerPage)*(pageNumber-1);
    let lastItemIndex = itemsPerPage*pageNumber;*/
    if (lastItemIndex > devices.length) {
      lastItemIndex = devices.length
    }
    const subArray = devices.slice(firstItemIndex, lastItemIndex)

    setRows(subArray)
    setLoadingData(false)
  }

  const getItemsRequest = () => {
    var userInfo = JSON.parse(localStorage.getItem('UserInfo'))
    var requestRowData = {
      headers: {
        'x-access-token': `${userInfo['accessToken']}`,
      },
    }

    axios
      .get(
        'https://peripheralsloanbackend.mybluemix.net/peripheral/',
        requestRowData
      )
      .then(({ data }) => {
        devices = []
        for (var i = 0; i < data.length; i++) {
          var newRow = {
            id: (i + 1).toString(),
            type: data[i].type,
            brand: data[i].brand,
            model: data[i].model,
            serialNumber: data[i].serialNumber,
            status: `${getDeviceStatus(
              data[i].acceptedConditions,
              data[i].isInside,
              data[i].securityAuthorization,
              data[i].employeeName
            )}`,
            currentUser: `${
              data[i].employeeName === ''
                ? (data[i].employeeName = 'No one')
                : data[i].employeeName
            }`,
          }
          devices[i] = newRow
        }
        if(data.length === 0){
          setIsNotificationEmptyActive(true);
        }
        loadRows()
      }).catch((error)=>{
        setIsNotificationErrorActive(true);
      })
  }

  const { sessionData, setSessionData } = useSessionData()
  const location = useLocation()

  useEffect(() => {
    if (sessionData.userType === 'security') {
      const newHeaders = headers.filter((header) => {
        return header.key !== 'currentUser'
      })
      setHeaders(newHeaders)
    }
    try {
      JSON.parse(localStorage.getItem('UserInfo'))
      checkAuth(sessionData, setSessionData, location.pathname)
      getItemsRequest()
    } catch (e) {
      window.location.href = '/?#/login'
    }
    // eslint-disable-next-line
  }, [])

  function handleChangeItemsPerPage(event) {
    itemsPerPage = event.pageSize
    pageNumber = event.page
    setPageConfig([itemsPerPage, pageNumber])
    loadRows()
  }

  const batchActionClick = (selectedRows) => {
    let serialNumbers = []
    selectedRows.forEach((i) => {
      let serialNumber = i.cells[3].value
      serialNumbers.push(serialNumber)
    })
    setSerialNumbersToDelete(serialNumbers)

    setDeleteDevicePopUpOpen(true)
  }

  const createCellOfType = (cell, row) => {
    if (cell.value === 'Available') {
      return (
        <div>
          <Tag renderIcon={FlagFilled} size="md" className="icon-check">
            {cell.value}
          </Tag>
        </div>
      )
    } else if (cell.value === 'Borrowed') {
      return (
        <div>
          <Tag renderIcon={FlagFilled} size="md" className="icon-fail">
            {cell.value}
          </Tag>
        </div>
      )
    } else if (cell.value === 'Requested') {
      return (
        <div>
          <Tag renderIcon={FlagFilled} size="md" className="icon-warning">
            {cell.value}
          </Tag>
        </div>
      )
    } else if (cell.value === 'Invalid') {
      return (
        <div>
          <Tag renderIcon={FlagFilled} size="md" className="icon-invalid">
            {cell.value}
          </Tag>
        </div>
      )
    } else {
      if ('type' === cell.id.split(':')[1]) {
        var pathString = '#/devices/' + row.cells[3].value
        return <a href={pathString}>{cell.value}</a>
      }
      if ('currentUser' === cell.id.split(':')[1]) {
        return <div>{cell.value}</div>
      }
      if ('serialNumber' === cell.id.split(':')[1]) {
        return <CodeSnippet type='inline' light className='copyButton'>{cell.value}</CodeSnippet>
      }
      return cell.value
    }
  }

  return loadingData === true ? (
    <div className="loadingComponent">
      <DataTableSkeleton columnCount={6} rowCount={10} />
      <SkeletonText heading={true} />
    </div>
  ) : (
    <>
      {isNotificationEmptyActive ? 
      <div className="error-notification">
        <ToastNotification
          kind="info"
          lowContrast={true}
          title="There are no peripherals registered!"
          onClose={()=>{setIsNotificationEmptyActive(false)}}
          timeout={5000}
          subtitle="When you create a new device, your Device List will grow."/>
      </div> : <div></div>}
      {isNotificationErrorActive ? 
      <div className="error-notification">
        <ToastNotification
          kind="error"
          lowContrast={true}
          title="Error"
          onClose={()=>{setIsNotificationErrorActive(false)}}
          timeout={5000}
          subtitle="Something went wrong, try it later"/>
      </div> : <div></div>}

      {isNotificationSuccessActive ? 
      <div className="error-notification">
        <ToastNotification
          kind="success"
          lowContrast={true}
          title="Success!"
          onClose={()=>{setIsNotificationSuccessActive(false)}}
          timeout={5000}
          subtitle="Devices 'deleted' successfully"/>
      </div> : <div></div>}
      
      <DeleteDevicePopUp
        open={deleteDevicePopUpOpen}
        setOpen={setDeleteDevicePopUpOpen}
        submit={postDeleteDevices}
        isDataLoading={isRequestLoading}
        handleCommentChange={handleCommentChange}
      />
      <DataTable
        rows={rows}
        headers={headers}
        render={({
          rows,
          headers,
          getHeaderProps,
          getSelectionProps,
          getToolbarProps,
          getBatchActionProps,
          getRowProps,
          onInputChange,
          selectedRows,
          getTableProps,
          getTableContainerProps,
        }) => (
          <TableContainer title="Device List" {...getTableContainerProps()}>
            <TableToolbar {...getToolbarProps()}>
              <TableBatchActions {...getBatchActionProps()}>
                <TableBatchAction
                  renderIcon={TrashCan}
                  iconDescription="Delete the selected rows"
                  onClick={() => {
                    batchActionClick(selectedRows)
                  }}
                >
                  Delete
                </TableBatchAction>
              </TableBatchActions>

              <TableToolbarContent>
                <TableToolbarSearch
                  onChange={(event) => {
                    if (event.target.value === '') {
                      itemsPerPage = pageConfig[0]
                      pageNumber = pageConfig[1]
                      setSearchingData(false)
                      loadRows()
                    } else {
                      setSearchingData(true)
                      loadRows(0, devices.length)
                    }
                    onInputChange(event)
                  }}
                />
                {(sessionData.userType === 'admin' ||
                  sessionData.userType === 'focal') && (
                  <Button 
                    onClick={()=>{
                      window.location.hash = '/devices/new-device'
                    }}
                    renderIcon={MobileAdd}>
                    New Device
                  </Button>
                )}
              </TableToolbarContent>
            </TableToolbar>

            <Table {...getTableProps()}>
              <TableHead>
                <TableRow>
                  {(sessionData.userType === 'admin' || sessionData.userType === 'focal') && (<TableSelectAll {...getSelectionProps()} />)}
                  {headers.map((header) => (
                    <TableHeader
                      key={header.key}
                      {...getHeaderProps({ header })}
                    >
                      <div className={'table-header' + header.key}>
                        {header.header}
                      </div>
                    </TableHeader>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {rows.map((row) => (
                  <React.Fragment key={row.id}>
                    <TableRow {...getRowProps({ row })} className="table-row">
                      {(sessionData.userType === 'admin' || sessionData.userType === 'focal') && (<TableSelectRow {...getSelectionProps({ row })} />)}
                      {row.cells.map((cell) => (
                        <TableCell key={cell.id} className="cellValue">
                          {createCellOfType(cell, row)}
                        </TableCell>
                      ))}
                    </TableRow>
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
            {searchingData ? (
              () => {}
            ) : (
              <Pagination
                backwardText="Previous page"
                forwardText="Next page"
                itemsPerPageText="Items per page:"
                onChange={handleChangeItemsPerPage}
                page={pageConfig[1]}
                pageSize={pageConfig[0]}
                pageSizes={[10, 20, 30, 40, 50, 100]}
                size="md"
                totalItems={devices.length}
              />
            )}
          </TableContainer>
        )}
      />
    </>
  )
}

export default Devices
