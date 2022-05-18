import React from 'react'

// Carbon Design
import {
  Button,
  ButtonSet,
  Form,
  Stack,
  TextInput,
  TextArea,
  ComboBox,
  Toggle,
} from 'carbon-components-react'
import { Misuse, Save, TrashCan } from '@carbon/icons-react'

const DeviceForm = ({ device, disableEditMode }) => {
  const areas = ['Area A', 'Area B', 'Area C']

  return (
    <Form>
      <Stack gap={4}>
        <Toggle
          aria-label="toggle button"
          defaultToggled
          id="toggle-1"
          labelA="Unavailable"
          labelB="Available"
          labelText="Availability"
        />
        <TextInput placeholder={device.currentUser} labelText="Current user" />
        <ComboBox
          ariaLabel="ComboBox"
          id="carbon-combobox-example"
          items={areas}
          label="Combo box menu options"
          placeholder={device.location}
          titleText="Area"
        />
        <TextArea
          labelText="Comments"
          helperText="Please add comments on why these changes are being made."
          cols={50}
          rows={4}
          id="text-area-1"
        />
        <ButtonSet className="edit-mode-button-set">
          <Button
            onClick={disableEditMode}
            renderIcon={Misuse}
            kind="secondary"
          >
            Cancel
          </Button>
          <Button onClick={disableEditMode} renderIcon={TrashCan} kind="danger">
            Delete device
          </Button>
          <Button renderIcon={Save} kind="primary" type="submit">
            Apply changes
          </Button>
        </ButtonSet>
      </Stack>
    </Form>
  )
}

export default DeviceForm
