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
        <TextInput placeholder={device.type} labelText="Type" />
        <TextInput placeholder={device.brand} labelText="Brand" />
        <TextInput placeholder={device.model} labelText="Model" />
        <ButtonSet className="edit-mode-button-set">
          <Button
            onClick={disableEditMode}
            renderIcon={Misuse}
            kind="secondary"
          >
            Cancel
          </Button>
          <Button onClick={disableEditMode} renderIcon={TrashCan} kind="danger">
            Delete
          </Button>
          <Button renderIcon={Save} kind="primary" type="submit">
            Save
          </Button>
        </ButtonSet>
      </Stack>
    </Form>
  )
}

export default DeviceForm
