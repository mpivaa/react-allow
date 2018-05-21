# React Allow

Multi level role based authorization

## Getting Started

This library is available as a NPM package, so you can install it as you would any other package:

```sh
npm install --save react-allow
```

## Usage

### React

__React Allow__ provides two main React components: `AllowContext.Provider` and `Allow`.

- `AllowContext.Provider` provides the context for the authorization through the component tree.
- `Allow` renders its children when the roles match with the context, can be anywhere inside provider tree.

#### Simple example
[![Edit ql666pw749](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/ql666pw749)

```jsx
import React from 'react'
import { render } from 'react-dom' 
import { Allow, AllowContext, setupAllow } from 'react-allow'

// Optional configuration, this are the defaults
setupAllow({
  levels: ['app'], // levels that are going to be used
  default: 'app', // see multi-level example
  aliases: {
    'a': 'app' // this way you can type just `a` instead of `app`
  }
})

/*
 * Context basic structure.
 * Usually comes from your api and is passed down as a prop.
 * Contains roles and current resources, like the user logged in
 */
const context = {
  user: { // current user
    roles: {
      app: 'user' // role for `app` level
    }
  }
}

function App({ context }) {
  return (
    <AllowContext.Provider context={context}>
      <Allow roles={['app:admin', 'app:user']}>
        This will render because matches with the second role `app:user`
      </Allow>
      <Allow roles={['app:admin']}>
        This will not render
      </Allow>
    </AllowContext.Provider>
  )
}

render(<App context={context} />, document.getElementById('root'))
```

#### Multi-level example

Imagine an app like Github, where the user has an specific role inside each organization and a system-wide role, like: `user` and `staff`.

We can setup a new level called `organization`, so we can authorize inside this context.

`AllowContext.Provider` can be nested, merging it's context with the parent, providing the tree with an updated context:

```js
{
  user: {
    roles: {
      app: 'user',
      organization: { 1: 'admin' }
    }
  },
  // current organization, the lib will look for `user.roles.organization[1]`
  organization: { id: 1 } 
}
```

[![Edit react-allow complex example](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/w7x5v9qy9l)
```jsx
import React from 'react'
import { render } from 'react-dom' 
import { Allow, AllowContext, setupAllow } from 'react-allow'

setupAllow({
  levels: ['app', 'organization'],
  default: 'app', // system-wide level
  aliases: {
    'a': 'app',
    'o': 'organization'
  }
})

const context = {
  user: {
    roles: {
      // the default level will always lookup `user.roles[level_name]` for the resolution
      app: 'user', 
      organization: { 1: 'admin' } // the role for all organizations the user belongs, as { [id: number | string]: string }
    }
  }
}

function Github({ context }) {
  const exampleOrganization = { id: 1 } // usually from api, needs an `id`
  return (
    <AllowContext.Provider context={context}>
      <OrganizationPage organization={exampleOrganization} />
      {/* This `Allow` will not use the updated context */}
      <Allow roles={['app:admin', 'organization:admin']}>
        This will not render
      </Allow>
    </AllowContext.Provider>
  )
}

function OrganizationPage({ organization }) {
  return (
    // Nested `AllowContext.Provider` merging the current organization to the context
    <AllowContext.Provider context={{ organization }}>
      {/* The `Allow` will use the updated context, anything outside the provider will use the previous context */}
      <Allow roles={['app:admin', 'organization:admin']}>
        This will render because `user.roles.organization[1] === 'admin'`
      </Allow>
    </AllowContext.Provider>
  )
}

render(<Github context={context} />, document.getElementById('root'))
```

#### Additional options

You can write the roles as:
 - `'app:admin'`: full version
 - `'a:admin'`: using it's alias
 - `'app:*'`: the pattern `*` means `any` role in the level
 
Use the current context anywhere, via `AuthContext.Consumer`
```jsx
function UserProfile(props) {
  return (
    <AuthContext.Consumer>
      {context => (
        <div>Name: {context.user.name}</div>
      )}
    </AuthContext.Consumer>
  )
}
```

Alternative render when not allowed
 ```jsx
 <Allow ifNotAllowed={NotAuthorizedPage} />
 ```

 Override provider context
 ```jsx
 <Allow overrideContext={otherContext} />
 ```

### JS

Same options and usage of the React, except context providers

```js
import { isAllowed } from 'react-allow'

const context = {
  user: {
    roles: {
      app: 'user'
    }
  }
}

isAllowed(context, ['app:admin']) // => false
isAllowed(context, ['app:user']) // => true
```

## TODO

- [ ] Easy the context creation based on common user/role patterns
- [ ] `['admin']` should lookup for `['<default>:admin']`
- [ ] Add `Deny` component
- [ ] Support React 15
- [ ] Support `updateContext` using render functions (maybe)
