import React from 'react'
import AllowContext from '../react/context'
import { Allow } from '../react/allow'
import { setupAllow } from '../allow'
import renderer from 'react-test-renderer'

setupAllow({
  levels: ['app', 'organization'],
  default: 'app',
  aliases: {
    'a': 'app'
  }
})

const ctx = {
  user: {
    roles: {
      app: 'admin',
      organization: { '1': 'admin' }
    }
  }
}

test('Render children when is allowed', () => {
  const component = renderer.create(
    <Allow roles={['app:admin']} overrideContext={ctx}>
      This should appear
    </Allow>
  )

  const tree = component.toJSON()
  expect(tree).toMatchSnapshot()
})

test('Render nothing when is not allowed', () => {
  const component = renderer.create(
    <Allow roles={['app:somerole']} overrideContext={ctx}>
      This should not appear
    </Allow>
  )

  const tree = component.toJSON()
  expect(tree).toMatchSnapshot()
})

test('Use context to allow', () => {
  const component = renderer.create(
    <AllowContext.Provider context={ctx}>
      <Allow roles={['app:admin']}>
        This should appear
      </Allow>
    </AllowContext.Provider>
  )

  const tree = component.toJSON()
  expect(tree).toMatchSnapshot()
})

test('Render ifNotAllowed', () => {
  const component = renderer.create(
    <AllowContext.Provider context={ctx}>
      <Allow roles={['app:somerole']} ifNotAllowed={(props) => '404'}>
        This should not appear
      </Allow>
    </AllowContext.Provider>
  )

  const tree = component.toJSON()
  expect(tree).toMatchSnapshot()
})

test('Nested provider should override parent', () => {
  const organization = { id: 1 }
  const component = renderer.create(
    <AllowContext.Provider context={ctx}>
      <AllowContext.Provider context={{ organization }}>
        <Allow roles={['organization:admin']}>
          This should appear
        </Allow>
      </AllowContext.Provider>
    </AllowContext.Provider>
  )

  const tree = component.toJSON()
  expect(tree).toMatchSnapshot()
})

test('Nested provider should not affect outer components', () => {
  const organization = { id: 1 }
  const component = renderer.create(
    <AllowContext.Provider context={ctx}>
      <AllowContext.Provider context={{ organization }}>
        <Allow roles={['organization:admin']}>
          This should appear
        </Allow>
      </AllowContext.Provider>

      <Allow roles={['organization:admin']}>
        This should not appear
      </Allow>
    </AllowContext.Provider>
  )

  const tree = component.toJSON()
  expect(tree).toMatchSnapshot()
})