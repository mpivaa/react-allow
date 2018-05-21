import { isAllowed, setupAllow } from '../allow'

setupAllow({
  levels: ['app'],
  default: 'app',
  aliases: {
    'a': 'app'
  }
})

test('isAllowed without context', () => {
  expect(isAllowed({}, ['system:any'])).toBe(false)
})


test('isAllowed on some level', () => {
  const ctx = {
    user: {
      roles: {
        app: 'admin'
      }
    }
  }

  expect(isAllowed(ctx, ['app:admin'])).toBe(true)
  expect(isAllowed(ctx, ['app:somerole'])).toBe(false)
})

test('isAllowed without roles checks if authenticated', () => {
  const ctx = {
    user: {
      roles: {
        app: 'anyrole'
      }
    }
  }

  expect(isAllowed(ctx)).toBe(true)
})

test('isAllowed with aliases', () => {
  const ctx = {
    user: {
      roles: {
        app: 'admin',
        organization: { '1': 'admin' },
        nodes: { '1': 'admin' }
      }
    },
    organization: { id: '1' },
    node: { id: '1' }
  }

  expect(isAllowed(ctx, ['a:admin'])).toBe(true)
  expect(isAllowed(ctx, ['a:somerole'])).toBe(false)
})


test('isAllowed with multiple roles', () => {
  const ctx = {
    user: {
      roles: {
        app: 'admin'
      }
    }
  }

  expect(isAllowed(ctx, ['somelevel:somerole', 'app:admin'])).toBe(true)
  expect(isAllowed(ctx, ['somelevel:admin', 'app:somerole'])).toBe(false)
})

test('isAllowed when * pattern is used', () => {
  const ctx = {
    user: {
      roles: {
        app: 'admin'
      }
    }
  }

  expect(isAllowed(ctx, ['app:*'])).toBe(true)
  expect(isAllowed(ctx, ['somelevel:*'])).toBe(false)
})