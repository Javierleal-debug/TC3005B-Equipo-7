import axios from 'axios'
import tableHeaders from './headers.json'
import React, { useState, useEffect } from 'react'
import { FlagFilled } from '@carbon/icons-react'
import {
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
} from 'carbon-components-react'

import { checkAuth, getDeviceStatus } from '../../util'

import { useSessionData } from '../../global-context'

const devices = [{}]

const MyLoans = () => {
  const [loadingData, setLoadingData] = useState(true)
  const [searchingData, setSearchingData] = useState(false)

  const [rows, setRows] = useState(null)
  const headers = tableHeaders

  let itemsPerPage = 10
  let pageNumber = 1
  const [pageConfig, setPageConfig] = useState([itemsPerPage, pageNumber])

  const loadRows = (
    firstItemIndex = itemsPerPage * (pageNumber - 1),
    lastItemIndex = itemsPerPage * pageNumber
  ) => {
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
      .post(
        'https://peripheralsloanbackend.mybluemix.net/peripheral/byEmail',
        {},
        requestRowData
      )
      .then(({ data }) => {
        console.log(data);
        for (var i = 0; i < data.length; i++) {
          var newRow = {
            id: (i + 1).toString(),
            type: data[i].type,
            brand: data[i].brand,
            model: data[i].model,
            serialNumber: data[i].serialNumber,
            loanStatus: `${getDeviceStatus(
              data[i].acceptedConditions,
              data[i].isInside,
              data[i].securityAuthorization,
              data[i].employeeName
            )}`,
            date: data[i].date,
          }
          devices[i] = newRow
        }
        loadRows()
      })
  }

  const { sessionData, setSessionData } = useSessionData()

  useEffect(() => {
    try {
      JSON.parse(localStorage.getItem('UserInfo'))
      checkAuth(sessionData, setSessionData)
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
      return cell.value
    }
  }

  return loadingData === true ? (
    <div className="loadingComponent">
      <DataTableSkeleton columnCount={6} rowCount={10} />
      <SkeletonText heading={true} />
    </div>
  ) : (
    <DataTable
      rows={rows}
      headers={headers}
      isSortable
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
        <TableContainer title="My Device List" {...getTableContainerProps()}>
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
                    loadRows(0, devices.length)
                  }
                  onInputChange(event)
                }}
              />
            </TableToolbarContent>
          </TableToolbar>

          <Table {...getTableProps()}>
            <TableHead>
              <TableRow className="table-row">
                {headers.map((header) => (
                  <TableHeader
                    className="header"
                    key={header.key}
                    {...getHeaderProps({ header })}
                  >
                    <div className="table-header">{header.header}</div>
                  </TableHeader>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {rows.map((row) => (
                <React.Fragment key={row.id}>
                  <TableRow {...getRowProps({ row })} className="table-row">
                    {row.cells.map((cell) => (
                      <TableCell key={cell.id} className="my-loans-cell">
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
  )
}

export default MyLoans
