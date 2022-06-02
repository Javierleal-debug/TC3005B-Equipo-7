import React, { useState, useEffect } from 'react'

import { useSessionData } from '../../../global-context'

import { InlineLoading, Button, ButtonSet } from 'carbon-components-react'
import {
  Exit,
  Close,
  Friendship,
  Undo,
  Reset,
  TrashCan,
} from '@carbon/icons-react'

function ButtonBar({ currentAction, setCurrentAction, peripheralData }) {
  /**
   *
   * TODO: device status stored in peripheralData.availability
   *
   * Possible currentActions (Pop-Ups):
   *    'request'
   *    'delete'
   *    'reset'
   *    'return'
   *    'securityAuthorize'
   *    'securityDeny'
   */

  useEffect(() => {
    console.log(currentAction)
  }, [currentAction])

  const { sessionData } = useSessionData()

  const expectedUserTypes = (...userTypes) => {
    let valid = false
    userTypes.forEach((type) => {
      if (type === sessionData.userType) valid = true
    })
    return valid
  }

  const expectedAvailability = (...availability) => {
    let valid = false
    availability.forEach((a) => {
      if (a === peripheralData.availability) valid = true
    })
    return valid
  }

  return (
    <>
      {
        /**
         * Buttons for focal/admin's processes
         */
        expectedUserTypes('admin', 'focal') && (
          <>
            <span>Focal Actions</span>
            <ButtonSet stacked>
              {expectedAvailability('Available') && (
                <Button
                  renderIcon={Friendship}
                  onClick={() => setCurrentAction('request')}
                  disabled={!expectedAvailability('Available')}
                >
                  Lend device (Assign)
                </Button>
              )}
              {expectedAvailability('Requested') &&
                (peripheralData.acceptedConditions ? (
                  <span className="cds--btn">
                    &#9432; User agreement was accepted. Its user,{' '}
                    {peripheralData.employeeName}, may ask for security
                    authorization.
                  </span>
                ) : (
                  <span className="cds--btn">
                    &#9432; The user agreement email has been sent to{' '}
                    {peripheralData.employeeEmail}
                  </span>
                ))}
              {expectedAvailability('Borrowed') && (
                <Button
                  renderIcon={Undo}
                  onClick={() => setCurrentAction('return')}
                >
                  Return
                </Button>
              )}
              <Button
                renderIcon={Reset}
                kind={'secondary'}
                onClick={() => setCurrentAction('reset')}
              >
                Reset {expectedAvailability('Requested') && '(cancel request)'}
              </Button>
              {expectedAvailability('Available') && (
                <Button
                  renderIcon={TrashCan}
                  kind={'danger'}
                  disabled={!expectedAvailability('Available')}
                  onClick={() => setCurrentAction('delete')}
                >
                  Delete
                </Button>
              )}
            </ButtonSet>
          </>
        )
      }

      {
        /**
         * Security's actions
         */
        expectedUserTypes('admin', 'security') && (
          <>
            <span>Security Actions</span>
            <ButtonSet stacked>
              {expectedAvailability('Requested') &&
              peripheralData.acceptedConditions ? (
                <>
                  <Button
                    renderIcon={Exit}
                    disabled={
                      !expectedAvailability('Requested')
                      /*isRequestLoading*/
                    }
                    onClick={() => setCurrentAction('security')}
                  >
                    Authorize exit
                  </Button>
                </>
              ) : (
                <span className="cds--btn">
                  &#9432; This device can't be authorized because it has no
                  focal approvals.
                </span>
              )}
            </ButtonSet>
          </>
        )
      }
    </>
  )
}

export default ButtonBar
