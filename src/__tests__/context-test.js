import { buildAuthContext } from '../context'

test('buildAuthContext', () => {
  const ctx = {
    user: {
      id: '1',
      roles: {
        app: 'admin',
        organization: { '1': 'admin' },
        node: { '1': 'admin' }
      }
    },
    organization: { id: '1' },
    node: { id: '1' }
  }

  expect(buildAuthContext(ctx)).toEqual(ctx)
})