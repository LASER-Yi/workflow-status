import * as core from '@actions/core';
import * as github from '@actions/github';
import {
  getFirst,
  getOptionalInput,
  getOwnerAndRepo,
  getRepository,
  logWarning
} from './utils';

async function run(): Promise<void> {
  try {
    const token = core.getInput('token', {required: true});
    const workflow = core.getInput('workflow', {required: true});
    const branch = core.getInput('branch');
    const event = getOptionalInput('event')
    let fullRepo = getOptionalInput('repo');
    if (fullRepo === undefined) {
      fullRepo = getRepository();
    }

    const [owner, repo] = getOwnerAndRepo(fullRepo);

    const octokit = github.getOctokit(token);
    const {
      data: {workflow_runs}
    } = await octokit.rest.actions.listWorkflowRuns({
      owner,
      repo,
      workflow_id: workflow,
      branch,
      event,
      per_page: 1,
    });

    const latest = getFirst(workflow_runs);

    if (latest !== null) {
      core.info(`status: ${latest.status} conclusion: ${latest.conclusion}`);
      core.setOutput('status', latest.status);
      core.setOutput('conclusion', latest.conclusion);
    } else {
      logWarning('Workflow run is missing');
    }
  } catch (err) {
    core.setFailed(`Failed with error: ${err.message}`);
  }
}

run();
