import axios from 'axios'
import tableHeaders from './headers.json'
import React, { useState, useEffect } from 'react'
import { UserFollow, Police, FaceCool, User } from '@carbon/icons-react'
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
  Pagination,
  SkeletonText,
  Tag,
  ToastNotification,
} from 'carbon-components-react'

import { checkAuth, redirectIfUserTypeIsNot } from '../../util'

import { useSessionData } from '../../global-context'
import { useLocation } from 'react-router-dom'


const users = [{}]
const userTypes = ['Admin','Focal','Security']; 

const UserManagement = () => {
  const [loadingData, setLoadingData] = useState(true)
  const [searchingData, setSearchingData] = useState(false)
  const [headers, setHeaders] = useState(tableHeaders)
  const [isNotificationErrorActive, setIsNotificationErrorActive] = useState(false)
  const [isNotificationSuccessActive, setIsNotificationSuccessActive] = useState(false)
  const [isNotificationEmptyActive, setIsNotificationEmptyActive] = useState(false)

  const [rows, setRows] = useState(null)

  let itemsPerPage = 10
  let pageNumber = 1
  const [pageConfig, setPageConfig] = useState([itemsPerPage, pageNumber])

  const loadRows = (
    firstItemIndex = itemsPerPage * (pageNumber - 1),
    lastItemIndex = itemsPerPage * pageNumber
  ) => {
    /*let firstItemIndex = (itemsPerPage)*(pageNumber-1);
    let lastItemIndex = itemsPerPage*pageNumber;*/
    if (lastItemIndex > users.length) {
      lastItemIndex = users.length
    }
    const subArray = users.slice(firstItemIndex, lastItemIndex)

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
        'http://peripheralsloanbackend.mybluemix.net/user/',
        requestRowData
      )
      .then(({ data }) => {
        console.log(data)
        for (var i = 0; i < data.length; i++) {
          var newRow = {
            id: (i + 1).toString(),
            name: data[i].employeeName,
            email: data[i].employeeEmail,
            serialNumber: data[i].serial,
            area: data[i].area,
            mngrName: data[i].mngrName,
            mngrEmail: data[i].mngrEmail,
            userType: userTypes[data[i].userType]
          }
          users[i] = newRow
        }
        if(users.length === 0){
          setIsNotificationEmptyActive(true);
        }
        loadRows()
      })
  }

  const { sessionData, setSessionData } = useSessionData()
  const location = useLocation()

  useEffect(() => {
    if (sessionData.userType) {
      redirectIfUserTypeIsNot(sessionData, 'admin')
    }
    try {
      JSON.parse(localStorage.getItem('UserInfo'))
      checkAuth(sessionData, setSessionData, location.pathname)
      getItemsRequest()
    } catch (e) {
      window.location.hash = '/login'
    }
    // eslint-disable-next-line
  }, [])

  function handleChangeItemsPerPage(event) {
    itemsPerPage = event.pageSize
    pageNumber = event.page
    setPageConfig([itemsPerPage, pageNumber])
    loadRows()
  }

  const createCellOfType = (cell, row) => {
    if ('name' === cell.id.split(':')[1]) {
      //var pathString = '#/users/' + row.cells[2].value //--> GetUser backend function not ready
      var email = row.cells[2].value
      var encodedEmail = encodeURIComponent(email)
      let pathString = "#/users/"+encodedEmail

      return <a href={pathString}>{cell.value}</a>
    }
    if ('userType' === cell.id.split(':')[1]) {
      if (cell.value === 'Admin') {
        return (
          <Tag renderIcon={FaceCool} size="md" className='icon-user'>
            {cell.value}
          </Tag>
        )
      } else if (cell.value === 'Focal' ) {
        return (
          <Tag renderIcon={User} size="md" className='icon-user'>
            {cell.value}
          </Tag>
        )
      } else if (cell.value === 'Security') {
        return (
          <Tag renderIcon={Police} size="md" className='icon-user'>
            {cell.value}
          </Tag>
        )
      }
    }
    return cell.value
  }

  return loadingData === true ? (
    <div className="loadingComponent">
      <DataTableSkeleton columnCount={7} rowCount={10} />
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
          onCloseButtonClick={()=>{setIsNotificationEmptyActive(false)}}
          subtitle="When you create a new device, your Device List will grow."/>
      </div> : <div></div>}
      {isNotificationErrorActive ? 
      <div className="error-notification">
        <ToastNotification
          kind="error"
          lowContrast={true}
          title="Error"
          onCloseButtonClick={()=>{setIsNotificationErrorActive(false)}}
          subtitle="Something went wrong, try it later"/>
      </div> : <div></div>}

      {isNotificationSuccessActive ? 
      <div className="error-notification">
        <ToastNotification
          kind="success"
          lowContrast={true}
          title="Success!"
          onCloseButtonClick={()=>{setIsNotificationSuccessActive(false)}}
          subtitle="Devices 'deleted' successfully"/>
      </div> : <div></div>}
      
      
      <DataTable
        rows={rows}
        headers={headers}
        render={({
          rows,
          headers,
          getHeaderProps,
          getToolbarProps,
          getRowProps,
          onInputChange,
          selectedRows,
          getTableProps,
          getTableContainerProps,
        }) => (
          <TableContainer title="User List" {...getTableContainerProps()}>
            <TableToolbar {...getToolbarProps()}>

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
                      loadRows(0, users.length)
                    }
                    onInputChange(event)
                  }}
                />
                <Button href="#/users/new-user" renderIcon={UserFollow}>
                  Create User
                </Button>
              </TableToolbarContent>
            </TableToolbar>

            <Table {...getTableProps()}>
              <TableHead>
                <TableRow>
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
                      {row.cells.map((cell) => (
                        <TableCell key={cell.id} className="user-cell">
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
                totalItems={users.length}
              />
            )}
          </TableContainer>
        )}
      />
    </>
  )
}

export default UserManagement