import React, { useState, useEffect } from 'react'

import { useSessionData } from '../../../global-context'

import { InlineLoading, Button, ButtonSet } from 'carbon-components-react'
import { Exit, Friendship, Undo, Reset, TrashCan } from '@carbon/icons-react'

function ButtonBar({ currentAction, setCurrentAction, peripheralData }) {
  /**
   *
   * TODO: device status stored in peripheralData.availability
   *
   * Possible currentActions (Pop-Ups):
   *    'request'
   *    'approveRequest'
   *    'cancelRequest'
   *    'delete'
   *    'reset'
   *    'return'
   *    'security'
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

  const expectedEmail = () => {
    return (
      peripheralData.employeeEmail === sessionData.email ||
      peripheralData.employeeEmail === ''
    )
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
         * Buttons for Requisitor's process
         */
        expectedUserTypes('admin', 'focal', 'requisitor') && (
          <>
            <span className="buttonset-title">Requisitor Actions</span>
            <ButtonSet stacked>
              {expectedEmail() ? (
                expectedAvailability('Available') ? (
                  <Button
                    renderIcon={Friendship}
                    disabled={!expectedAvailability('Available')}
                    onClick={() => setCurrentAction('request')}
                  >
                    Request
                  </Button>
                ) : (
                  <>
                    {expectedAvailability('Requested') ? (
                      <Button
                        renderIcon={Friendship}
                        disabled={
                          !expectedAvailability('Requested') ||
                          peripheralData.acceptedConditions
                        }
                        onClick={() => setCurrentAction('cancelRequest')}
                        kind="secondary"
                      >
                        Cancel request
                      </Button>
                    ) : (
                      <span className="cds--btn">
                        &#9432; If you wish to return this device, please
                        contact its corresponding Focal.
                      </span>
                    )}
                  </>
                )
              ) : (
                <span className="cds--btn">
                  &#9432; You cannot request this device because it is not
                  available.
                </span>
              )}
            </ButtonSet>
          </>
        )
      }

      {
        /**
         * Buttons for focal/admin's process
         */
        expectedUserTypes('admin', 'focal') && (
          <>
            <span>Focal Actions</span>
            <ButtonSet stacked>
              {expectedAvailability('Requested')
                ? !peripheralData.acceptedConditions && (
                    <Button
                      renderIcon={Friendship}
                      onClick={() => setCurrentAction('approveRequest')}
                      disabled={!expectedAvailability('Requested')}
                    >
                      Approve request
                    </Button>
                  )
                : !expectedAvailability('Borrowed') && (
                    <span className="cds--btn">
                      &#9432; This device has no requests at the moment.
                    </span>
                  )}
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
              ) : (
                <span className="cds--btn">
                  &#9432; This device has no approved requests at the moment.
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
