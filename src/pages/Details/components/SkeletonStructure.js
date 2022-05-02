import React from 'react'
import {SkeletonPlaceholder, ButtonSkeleton, DropdownSkeleton, DataTableSkeleton, SkeletonText} from 'carbon-components-react'
import {Grid, Column} from 'carbon-components-react'

const SkeletonStructure = ({ device, disableEditMode }) => {
  return (
    <Grid className="page-content">
      <Column sm={4} md={8} lg={4} className="actions-block">
        <SkeletonText heading={true}/>
        <DropdownSkeleton/>
        <br />
        <ButtonSkeleton />
        <ButtonSkeleton />
        <div className="qr-code-area">
          <SkeletonText/>
          <SkeletonPlaceholder/>
        </div>
      </Column>
      <Column sm={4} md={8} lg={12} className="table-block">
        <DataTableSkeleton columnCount={2} rowCount={7} showHeader={false} showToolbar={false} />
      </Column>
    </Grid>
  )
}

export default SkeletonStructure