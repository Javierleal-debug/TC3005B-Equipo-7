import React from 'react'

// Carbon Design
import {
  Button,
  ButtonSet,
  Form,
  Stack,
  TextInput,
} from 'carbon-components-react'
import { Misuse, Save, TrashCan } from '@carbon/icons-react'

const DeviceForm = ({ device, disableEditMode }) => {
  return (
    <Form>
      <Stack gap={4}>
        <p>Solo cambiarán los datos cuyo campo haya sido llenado.</p>
        <TextInput placeholder={device.type} labelText="Tipo (nombre)" />
        <TextInput placeholder={device.brand} labelText="Marca" />
        <TextInput placeholder={device.model} labelText="Modelo" />
        <ButtonSet className="edit-mode-button-set">
          <Button
            onClick={disableEditMode}
            renderIcon={Misuse}
            kind="secondary"
          >
            Cancelar
          </Button>
          <Button onClick={disableEditMode} renderIcon={TrashCan} kind="danger">
            Eliminar dispositivo
          </Button>
          <Button renderIcon={Save} kind="primary" type="submit">
            Guardar
          </Button>
        </ButtonSet>
      </Stack>
    </Form>
  )
}

export default DeviceForm
