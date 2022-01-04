import {test, expect, jest, beforeAll} from '@jest/globals'
import {
  getProjectFilePath,
  getPackageJson,
  getRepository,
  getPullNumber,
  getPrCommitId,
  getPrCommits,
  getUpdatePrUrl,
  getCommentsPrUrl,
  getGithubToken,
  getClosePrAxiosProps,
  getCommentPrProps
} from '../index'

jest.mock('@actions/github', () => ({
  context: {
    payload: {
      number: 'number',
      after: 'after',
      commits: 'commits'
    }
  }
}))

jest.mock('@actions/core', () => ({
  getInput: (i: any) => i
}))

beforeAll(() => {
  Object.assign(process.env, {
    GITHUB_WORKSPACE: '',
    GITHUB_REPOSITORY: 'a/b/c'
  })
})

test('src/utils/index.ts getProjectFilePath', () => {
  expect(getProjectFilePath('package.json').indexOf('/package.json') > 0).toBe(
    true
  )
})

test('src/utils/index.ts getPackageJson', async () => {
  const json = await getPackageJson()
  console.log('json', json)
  const {name} = json || {}

  expect(name).toBe('change_log_action')
})

test('src/utils/index.ts getRepository', () => {
  expect(getRepository()).toBe('a/b')
})

test('src/utils/index.ts getPullNumber', () => {
  expect(getPullNumber()).toBe('number')
})

test('src/utils/index.ts getPrCommitId', () => {
  expect(getPrCommitId()).toBe('after')
})

test('src/utils/index.ts getPrCommits', () => {
  expect(getPrCommits()).toBe('commits')
})

test('src/utils/index.ts getUpdatePrUrl', () => {
  expect(getUpdatePrUrl()).toBe('https://api.github.com/repos/a/b/pulls/number')
})

test('src/utils/index.ts getCommentsPrUrl', () => {
  expect(getCommentsPrUrl()).toBe(
    'https://api.github.com/repos/a/b/pulls/number/comments'
  )
})

test('src/utils/index.ts getGithubToken', () => {
  expect(getGithubToken()).toBe('githubToken')
})

test('src/utils/index.ts getClosePrAxiosProps', () => {
  expect(JSON.stringify(getClosePrAxiosProps('title', 'body'))).toBe(
    JSON.stringify({
      method: 'PATCH',
      headers: {
        Accept: 'application/vnd.github.v3+json',
        'content-type': 'application/json',
        Authorization: `Bearer githubToken`
      },
      url: 'https://api.github.com/repos/a/b/pulls/number',
      data: {
        title: 'title',
        body: 'body',
        state: 'close'
      }
    })
  )
})

test('src/utils/index.ts getCommentPrProps', () => {
  expect(JSON.stringify(getCommentPrProps('body', {test: 'test'}))).toBe(
    JSON.stringify({
      method: 'POST',
      headers: {
        Accept: 'application/vnd.github.v3+json',
        'content-type': 'application/json',
        Authorization: `Bearer githubToken`
      },
      url: 'https://api.github.com/repos/a/b/pulls/number/comments',
      data: {
        start_side: 'RIGHT',
        commit_id: 'after',
        body: 'body',
        test: 'test'
      }
    })
  )
})