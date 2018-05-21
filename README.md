# React Allow

Multi-level role based authorization for React

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

Imagine an app like Github, where the user has a specific role inside each organization, repo and a system-wide role.

- User A (id = 1): user
  - Organization A (id = 1): member
    - Repo A (id = 1): writer
    - Repo B (id = 2): reader
  - Organization B (id = 2): admin
    - Repo C (id = 3): writer
    - Repo D (id = 4): no role assigned

Where
- The user must be authenticated
- Users can see the organization if it's a member or admin
- Organization admins can edit the organization
- Organization admins can do anything with it's repos
- Repo writers can edit the repo
- Repo readers can only see the repo


See the following example:

[![Edit react-allow complex example](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/w7x5v9qy9l)
```jsx
import React from "react";
import { render } from "react-dom";
import { Allow, AllowContext, setupAllow } from "react-allow";

setupAllow({
  levels: ["app", "organization", "repo"], // setup the levels
  default: "app", // system-wide level
  aliases: {
    org: "organization"
  }
});

const context = {
  user: {
    id: 1, // optional
    name: "User A", // optional, you can pass any additional props for later use
    roles: {
      app: "user",
      organization: {
        1: "member", // { id: role }
        2: "admin"
      },
      repo: {
        1: "writer",
        2: "reader",
        3: "writer"
      }
    }
  }
};

function Github({ context }) {
  const organizationA = {
    // usually from api or a route, the `id` is required
    id: 1,
    name: "Organization A",
    repos: [{ id: 1, name: "Repo A" }, { id: 2, name: "Repo B" }]
  };

  const organizationB = {
    id: 2,
    name: "Organization B",
    repos: [{ id: 3, name: "Repo C" }, { id: 4, name: "Repo D" }]
  };

  return (
    <AllowContext.Provider context={context}>
      <Allow>
        {/* is authenticated */}
        <OrganizationPage organization={organizationA} />
        <OrganizationPage organization={organizationB} />
      </Allow>
    </AllowContext.Provider>
  );
}

function OrganizationPage({ organization }) {
  return (
    // Nesting `AllowContext.Provider` merges the current organization to the context
    <AllowContext.Provider context={{ organization }}>
      {/* The `Allow` will use the updated context,
        * anything outside the provider will use the previous context
        */}
      <Allow roles={["organization:*"]}>
        {/* `*` = any role */}
        <span className="organization-name">{organization.name}</span>
        <Allow roles={["organization:admin"]}>
          <button className="organization-edit">Edit Organization</button>
        </Allow>
        <RepoList repos={organization.repos} />
      </Allow>
    </AllowContext.Provider>
  );
}

function RepoList({ repos }) {
  return (
    <ul>
      {repos.map(repo => (
        <AllowContext.Provider context={{ repo }}>
          {/* context with current repo */}
          <Allow roles={["org:admin", "repo:*"]}>
            {/* using org alias */}
            <li>
              <span className="repo-name">{repo.name}</span>
              <Allow roles={["org:admin", "repo:writer"]}>
                <button className="repo-edit">Edit</button>
              </Allow>
              <Allow roles={["org:admin"]}>
                <button className="repo-delete">Delete</button>
              </Allow>
            </li>
          </Allow>
        </AllowContext.Provider>
      ))}
    </ul>
  );
}

render(<Github context={context} />, document.getElementById("root"));
```

`AllowContext.Provider` can be nested, merging it's context with the parent, providing the tree with an updated context:

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
