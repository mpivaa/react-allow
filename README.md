# Allow

Multi level role based authorization

## Getting Started

This library is available as a NPM package (not yet), so you can install it as you would any other package:

```sh
npm install allow
```

## Usage

### React

`Allow` provides two main React components: `AllowContext.Provider` and `Allow`.

- `AllowContext.Provider` provides the context for the authorization through the component tree.
- `Allow` renders its children when the roles match with the context.

#### Simple example
```jsx
import React from 'react'
import { render } from 'react-dom' 
import { setupAllow } from 'allow'
import { Allow, AllowContext } from 'allow/react'

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
        This appears because matches with the second role `app:user`
      </Allow>
      <Allow roles={['app:admin']}>
        This does not appears
      </Allow>
    </AllowContext.Provider>
  )
}

render(<App context={context}>, document.getElementById('root'))
```

#### Multi-level example

Imagine an app like Github, where the user has an specific role inside each organization and a system-wide role, like: `user` and `staff`.

We can setup a new level called `organization`, so we can authorize inside this context

```jsx
import React from 'react'
import { setupAllow } from 'allow'
import { Allow, AllowContext } from 'allow/react'

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
      app: 'user', // system-wide role, doesn't need an additional `id` to be resolved
      organization: { 1: 'admin' } // the role for all organizations the user belongs
    }
  }
}

function OrganizationPage({ organization }) {
  return (
    {/*
      * `AllowContext.Provider` can be nested, merging it's context with the parent,
      * providing the tree with a context like this:
      * {
      *   user: {
      *     roles: {
      *       app: 'user',
      *       organization: { 1: 'admin' }
      *     }
      *   },
      *   // current organization, the lib will look for `user.roles.organization[1]`
      *   organization: { id: 1 } 
      * }
      */}
    <AllowContext.Provider context={{ organization }}>
      <Allow roles={['app:admin', 'organization:admin']}>
        This appears because user.roles.organization[1] === 'admin'
      </Allow>
    </AllowContext.Provider>
  )
}

function Github({ context }) {
  const exampleOrganization = { id: 1 } // usually from api, needs an `id`
  return (
    <AllowContext.Provider context={context}>
      <OrganizationPage organization={exampleOrganization} />
    </AllowContext.Provider>
  )
}

render(<Github context={context}>, document.getElementById('root'))
```

#### Additional options

You can write the roles as:
 - `'app:admin'`: full version
 - `'a:admin'`: using it's alias
 - `'app:*'`: the pattern `*` means `any` role in the level

Alternative render when not authorized
 ```jsx
 <Allow ifNotAuthorized={NotAuthorizedPage} />
 ```

 Override provider context
 ```jsx
 <Allow overrideContext={otherContext} />
 ```

### JS

Same options and usage of the React, except context providers

```js
import { isAllowed } from 'allow'

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