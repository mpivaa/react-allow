// @flow
import * as React from 'react'
import type { Context, ComposedRole } from '../types'
import { isAllowed } from '../allow'
import AllowContext from './context'

type Props = {
  children?: React.Node,
  roles: [ComposedRole],
  ifNotAllowed?: React.ComponentType<any>,
  overrideContext?: Context
}

type ConsumerValue = {
  context: ?Context
}

export function Allow({
  children,
  roles,
  ifNotAllowed: IfNotAllowed,
  overrideContext
}: Props) {

  return (
    <AllowContext.Consumer>
      {({ context: appContext }: ConsumerValue): React.Node => {
        const ctx = overrideContext || appContext
        if(isAllowed(ctx, roles)) {
          return children
        } else if(IfNotAllowed) {
          return <IfNotAllowed />
        } else {
          return null
        }
      }}
    </AllowContext.Consumer>
  )
}