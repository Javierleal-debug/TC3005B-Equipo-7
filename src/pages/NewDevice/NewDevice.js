import React from 'react'

import axios from "axios";

// Carbon Styling
import {
  Grid,
  Column,
  Button,
  ButtonSet,
  Form,
  Stack,
  TextInput,
} from 'carbon-components-react'
import { Misuse, Save } from '@carbon/icons-react'

const deviceData={
}

const NewDevice = () => {

  const handleTypeChange = (event) => {
    deviceData.type = event.target.value;
  }

  const handleBrandChange = (event) => {
    deviceData.brand = event.target.value;
  }

  const handleModelChange = (event) => {
    deviceData.model = event.target.value;
  }

  const handleSerialChange = (event) => {
    deviceData.serial = event.target.value;
  }

  const createItemRequest = () => {

    var userInfo = JSON.parse(localStorage.getItem('UserInfo'));
    let requestData = {
      type: deviceData.type,
      brand: deviceData.brand,
      model: deviceData.model,
      serialNumber: deviceData.serial,
      acceptedConditions: false,
      isInside: true,
      securityAuthorization: false
    };
    let requestHeaders = {
      headers: {
        'x-access-token': `${userInfo["accessToken"]}`,
        'Content-Type': 'application/json',
      }
    }
    
    axios.post("http://localhost:3001/peripheral", requestData, requestHeaders)
    .then(({ data }) => {
      window.location.hash="/devices";
    }).catch(error => {
      console.error(`There was an error!`, error);
    });
  }

  return (
    <>
      <Grid className="page-content">
        <Column sm={4} md={8} lg={16} className="table-block">
          <h1>New Device</h1>
          <Form>
            <Stack gap={4}>
              <TextInput id="Type" onChange={handleTypeChange} placeholder="Device Type" labelText="Type" />
              <TextInput id="Brand" onChange={handleBrandChange} placeholder="Device Brand" labelText="Brand" />
              <TextInput id="Model" onChange={handleModelChange} placeholder="Model" labelText="Model" />
              <TextInput id="Serial" onChange={handleSerialChange} placeholder="Serial Number" labelText="Serial" />
              <ButtonSet className="edit-mode-button-set">
                <Button
                  renderIcon={Misuse}
                  kind="secondary"
                  href="#/devices"
                >
                  Cancel
                </Button>
                <Button 
                  renderIcon={Save} 
                  kind="primary" 
                  type="button"
                  onClick={createItemRequest}
                >
                  Save
                </Button>
              </ButtonSet>
            </Stack>
          </Form>
        </Column>
      </Grid>
    </>
  )
}

export default NewDevice
