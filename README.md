# workflow-status

[![build-test](https://github.com/LASER-Yi/workflow-status/actions/workflows/test.yml/badge.svg)](https://github.com/LASER-Yi/workflow-status/actions/workflows/test.yml)

A Github Action that checks another workflow's latest status

## Usage

### Inputs

* `token` - Your Github API token. You can just use `${{ secrets.GITHUB_TOKEN }}`
* `workflow` - The **filename** of the workflow to check
* `branch` - Branch name to check. Defaults to `main`
* `repo` - (Optional) Repository to check
* `event` - (Optional) Event to validate, see [Events that trigger workflows](https://docs.github.com/en/actions/reference/events-that-trigger-workflows) to get the full list

### Outputs

* `status` & `conclusion` - Result of Github API. For a list of the possible `status` and `conclusion` options, see [Create a check run](https://docs.github.com/rest/reference/checks#create-a-check-run)

## Example Workflow

```yaml
name: 'release-version'
on:
  workflow_dispatch:

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v2
        
      - name: Build
        run: # Build scripts
        
      - name: Check CI
      	id: check-ci
      	uses: LASER-Yi/workflow-status@v0.0.2
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
          workflow: ci.yml
          event: push
          branch: development
          
      - name: Release
      	if: ${{ steps.check-ci.outputs.conclusion == 'success' }}
        run: # Release scripts
```

## License

The scripts and documentation in this project are released under the [MIT License](https://github.com/LASER-Yi/workflow-status/blob/main/LICENSE)