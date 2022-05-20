import axios from 'axios'
import tableHeaders from './headers.json'
import React, { useState, useEffect } from 'react'
import {
  CheckmarkFilled,
  Misuse,
  TrashCan,
  MobileAdd,
  WarningFilled,
  FlagFilled
} from '@carbon/icons-react'
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
  Tag
} from 'carbon-components-react'

import { checkAuth } from '../../util'

const devices = [{}]

const Devices = () => {
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
        for (var i = 0; i < data.length; i++) {
          var newRow = {
            id: (i + 1).toString(),
            type: data[i][0],
            brand: data[i][1],
            model: data[i][2],
            serialNumber: data[i][3],
            status: getDeviceStatus(data[i][4], data[i][5], data[i][6]),
            currentUser: data[i][7],
          }
          devices[i] = newRow
        }
        console.log(devices);
        loadRows()
      })
  }

  useEffect(() => {
    try {
      JSON.parse(localStorage.getItem('UserInfo'))
      checkAuth()
      getItemsRequest()
    } catch (e) {
      window.location.hash = '/login'
    }
  }, []) //funcion que corre al cargar la pagina, despues de mostrar lo que está en el return

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
    console.log(serialNumbers)

    var userInfo = JSON.parse(localStorage.getItem('UserInfo'))
    var requestData = {
      headers: {
        'x-access-token': `${userInfo['accessToken']}`,
      },
      data: {
        array: serialNumbers,
      },
    }
    axios
      .delete(
        'https://peripheralsloanbackend.mybluemix.net/peripheral/',
        requestData
      )
      .then(({ data }) => {
        window.location.reload()
      })
  }

  const getDeviceStatus = (conditions, inside, security) => {
    if(conditions === 'false' && inside === 'true' && security === 'false'){
      return "Available";
    }else if(conditions === 'true' && inside === 'true' && security === 'false'){
      return "Requested";
    }else if(conditions === 'true' && inside === 'false' && security === 'true'){
      return "Borrowed";
    }else {return "Invalid";} 
  }

  const createCellOfType = (cell, row) => {
    if (cell.value === "Available") {
      return (
        <div><Tag renderIcon={FlagFilled} size='md' className='icon-check'>{cell.value}</Tag></div>
      )
    } else if (cell.value === "Borrowed") {
      return (
        <div><Tag renderIcon={FlagFilled} size='md' className='icon-fail'>{cell.value}</Tag></div>
      )
    } else if(cell.value === "Requested") {
      return (
        <div><Tag renderIcon={FlagFilled} size='md' className='icon-warning'>{cell.value}</Tag></div>
      )
    } else if(cell.value === "") {
      return (<div>No one</div>)
    } else {
      if ('type' === cell.id.split(':')[1]) {
        var pathString = '#/devices/' + row.cells[3].value
        return <a href={pathString}>{cell.value}</a>
      }
      if ('currentUser' === cell.id.split(":")[1]) {
        return (<div>{cell.value}</div>)
      }
      return cell.value
    }
  }

  return loadingData === true ? (
    <div className="loadingComponent">
      <DataTableSkeleton columnCount={8} rowCount={10} />
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
              <Button href="#/devices/new-device" renderIcon={MobileAdd}>
                New Device
              </Button>
            </TableToolbarContent>
          </TableToolbar>

          <Table {...getTableProps()}>
            <TableHead>
              <TableRow className='table-row'>
                <TableSelectAll {...getSelectionProps()} />
                {headers.map((header) => (
                  <TableHeader className='header' key={header.key} {...getHeaderProps({ header })}>
                    <div className="table-header">{header.header}</div>
                  </TableHeader>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {rows.map((row) => (
                <React.Fragment key={row.id}>
                  <TableRow {...getRowProps({ row })} className="table-row">
                    <TableSelectRow {...getSelectionProps({ row })} />
                    {row.cells.map((cell) => (
                      <TableCell key={cell.id} className="cell">
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

export default Devices
