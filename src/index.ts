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
    const event = getOptionalInput('event');
    let run = getOptionalInput('run') === undefined ? 0 : parseInt(getOptionalInput('run') as string);

    let fullRepo = getOptionalInput('repo');
    if (fullRepo === undefined) {
      fullRepo = getRepository();
    }

    const [owner, repo] = getOwnerAndRepo(fullRepo);

    core.info(`Checking ${workflow}'s result from ${fullRepo}:${branch} run ${run}`)

    const octokit = github.getOctokit(token);
    const {
      data: {workflow_runs}
    } = await octokit.rest.actions.listWorkflowRuns({
      owner,
      repo,
      workflow_id: workflow,
      branch,
      event,
      per_page: 3,
    });
    core.info(`runs ${JSON.stringify(workflow_runs)}`);
    const latest = getFirst(workflow_runs, run);

    if (latest !== null) {
      core.info(`status: ${latest.status}`);
      core.info(`conclusion: ${latest.conclusion}`)

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
