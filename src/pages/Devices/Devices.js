import React from 'react'
import { Link } from 'react-router-dom'


import {
  Button,
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
  TableSelectRow
} from 'carbon-components-react';

import { CheckmarkFilled, Misuse, TrashCan} from '@carbon/icons-react'

const rows = [
  {
    id: 1,
    type: 'Monitor',
    brand: 'Lenovo',
    model: 'ThinkVision',
    serialNumber: 'TVD',
    acceptedConditions: false,
    isInside: true,
    securityAuthorization: false,
  },
  {
    id: 2,
    type: 'Teclado',
    brand: 'Apple',
    model: 'ML22E/A',
    serialNumber: 'FOTO50300H9JL3LYAH',
    acceptedConditions: true,
    isInside: false,
    securityAuthorization: true,
  },
  {
    id: 3,
    type: 'Adaptador 1',
    brand: 'Startech',
    model: 'Multiport Adapter',
    serialNumber: 'DKT30CHD156',
    acceptedConditions: true,
    isInside: false,
    securityAuthorization: true,
  },
  {
    id: 4,
    type: 'Monitor',
    brand: 'Lenovo',
    model: 'ThinkVision',
    serialNumber: 'TVD',
    acceptedConditions: false,
    isInside: true,
    securityAuthorization: false,
  },
  {
    id: 5,
    type: 'Teclado',
    brand: 'Apple',
    model: 'ML22E/A',
    serialNumber: 'FOTO50300H9JL3LYAH',
    acceptedConditions: true,
    isInside: false,
    securityAuthorization: true,
  },
  {
    id: 6,
    type: 'Adaptador 1',
    brand: 'Startech',
    model: 'Multiport Adapter',
    serialNumber: 'DKT30CHD156',
    acceptedConditions: true,
    isInside: false,
    securityAuthorization: true,
  },
];

const headers = [
  {
    key: 'type',
    header: 'Tipo de dispositivo',
  },
  {
    key: 'brand',
    header: 'Marca',
  },
  {
    key: 'model',
    header: 'Modelo',
  },
  {
    key: 'serialNumber',
    header: 'Serial',
  },
  {
    key: 'acceptedConditions',
    header: 'Condiciones aceptadas',
  },
  {
    key: 'isInside',
    header: '¿Está dentro?',
  },
  {
    key: 'securityAuthorization',
    header: 'Autorización de seguridad',
  }
];

const Devices = () => {

  class DynamicRows extends React.Component {
    state = {
      rows,
      headers: headers,
      id: 0,
    };

    render() {
      function batchActionClick(selectedRows){
      }
      const checkBoolean = (cell) => {
        if(cell.value === true){
          return <div><CheckmarkFilled className="icon-check" /></div>
        }else if(cell.value === false){
          return <div><Misuse className="icon-fail"/></div>
        }else {
          if("type" === cell.id.split(":")[1]){
            return <a href="/details">{cell.value}</a>
          }
          return cell.value;
        }
      }

      return (
        <DataTable
          rows={this.state.rows}
          headers={this.state.headers}
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
            <TableContainer
              title="Dispositivos periféricos"
              {...getTableContainerProps()}>
              <TableToolbar {...getToolbarProps()}>
                <TableBatchActions {...getBatchActionProps()}>
                  <TableBatchAction
                    renderIcon={TrashCan}
                    iconDescription="Delete the selected rows"
                    onClick={batchActionClick(selectedRows)}>
                    Delete
                  </TableBatchAction>
                </TableBatchActions>
                <TableToolbarContent>
                  <TableToolbarSearch onChange={onInputChange} />
                  <Button /*onClick={action('Button click')}*/>Crear dispositivo</Button>
                </TableToolbarContent>
              </TableToolbar>
              <Table {...getTableProps()}>
                <TableHead>
                  <TableRow>
                    <TableSelectAll {...getSelectionProps()} />
                    {headers.map((header, i) => (
                      <TableHeader key={i} {...getHeaderProps({ header })}>
                        <div className='table-header'>{header.header}</div>
                      </TableHeader>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row) => (
                    <React.Fragment key={row.id}>
                      <TableRow {...getRowProps({ row })} className='table-row' >
                        <TableSelectRow {...getSelectionProps({ row })} />
                        {row.cells.map((cell) => (
                          <TableCell key={cell.id} className='cell'>
                            {checkBoolean(cell)}
                          </TableCell>
                        ))}
                      </TableRow>
                    </React.Fragment>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        />
      );
    }
  }
  return <DynamicRows />;
}

export default Devices
