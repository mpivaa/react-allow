// @flow
import * as React from 'react'
import type { Context } from '../types'
import { isFunction, isNil } from 'lodash'

type InitialValues = {
  context: ?Context
}

type Props = {
  children?: React.Node,
  context?: Context,
  defaultContext?: Context,
  onContextChange?: (context: ?Context) => void
}

type State = {
  context: ?Context
}

const initialValues = ({
  context: null
}: InitialValues)

const ReactContext  = React.createContext(initialValues)
const { Consumer } = ReactContext


class Provider extends React.Component<Props, State> {
  state = {
    context: this.props.defaultContext
  }

  getContext(parentContext: ?Context) {
    if(this.isControlled()) {
      if(parentContext) {
        return {
          ...parentContext,
          ...this.props.context
        }
      } else {
        return this.props.context
      }
    } else {
      return this.state.context
    }
  }

  isControlled() {
    // TODO: Remove uncontrolled options
    return true || !isNil(this.props.context)
  }

  getProviderValue(parentContext: ?Context) {
    return {
      context: this.getContext(parentContext),
      // TODO: updateContext
      // updateContext: (context: ?Context): void => {
      //   if(!this.isControlled()) {
      //     this.setState({ context })
      //   }
      //   if(isFunction(this.props.onContextChange)) {
      //     this.props.onContextChange(context)
      //   }
      // }
    }
  }

  render() {
    return (
      <ReactContext.Consumer>
        {({ context }): React.Node => {
          return (
            <ReactContext.Provider value={this.getProviderValue(context)}>
              {this.props.children}
            </ReactContext.Provider>
          )
        }}
      </ReactContext.Consumer>
    )
  }
}

export { Consumer, Provider }
export default { Consumer, Provider }
