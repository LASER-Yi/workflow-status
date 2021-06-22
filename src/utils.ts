import * as core from '@actions/core';
import {WarningPrefix} from './constants';

export function logWarning(msg: string) {
  core.warning(`${WarningPrefix} ${msg}`);
}

export function getOptionalInput(
  name: string,
  options?: core.InputOptions
): string | undefined {
  const value = core.getInput(name, options);
  return value.length === 0 ? undefined : value;
}

export function getRepository(): string {
  const value = process.env['GITHUB_REPOSITORY'];
  if (value === undefined) {
    throw new Error('GITHUB_REPOSITORY is missing in PATH');
  }
  return value;
}

export function getOwnerAndRepo(full: string): [string, string] {
  const results = full.split('/');
  if (results.length !== 2) {
    throw new Error('Full repo is not vaild');
  }

  return results as [string, string];
}

export function getFirst<T>(arr: T[]): T | null {
  if (arr.length >= 1) {
    return arr[0];
  } else {
    return null;
  }
}
