<div align="center">
  <img src="https://raw.githubusercontent.com/xbauquet/ginny/main/src/assets/logo.png" width="80px">
  <h1 style="color:#FD943C">
    Ginny
  </h1>
</div>

[https://ginny-ci.com/](https://ginny-ci.com/)

Get the best of your Github actions with Ginny.
> Ginny is still a project under development

- **Web app**: nothing to install.
- **Black and White**: available in light or dark mode.
- **No server**: Ginny does not store any of your information on any server. Everything stays on your device.
- **Just a token**: Use [your Github token](#getting-the-right-token) to connect Ginny to Github.

What can you do with Ginny: 
- [Organise your repositories in Workspaces](#organise-your-repositories-in-workspaces)
- [Monitor your actions](#monitor-your-actions) 
- [Run your actions](#run-your-actions)
- [Create multi-repo pipelines](#create-multi-repo-pipelines)
- [Monitor your usage](#monitor-your-usage)

## Getting the right token

Ginny simply works with a github personal access token with the scopes `repo`, `workflow` and `user`.
>Find more information on how to manage your personal access tokens on the [Github documentation.](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens)

## Organise your repositories in Workspaces

Organise your personal repositories and repositories from your organisations in **Workspaces**.
And change **Workspace** with a single click.

## Monitor your actions

Use Ginny to 
- see the status of the last run of your Github actions.
- open the repository on Github.
- open the logs of the last run on Github.
- run 'dispatchable' Github Actions.

## Run your actions

With Ginny you can easily run any Github Action that includes a `workflow_dispatch` triggering event.
>Find more information on how to use `workflow_dispatch` on the [Github documentation](https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows#workflow_dispatch).

## Create multi-repo pipelines

Create multi-repository pipelines and choose your input parameters for each action in the pipeline.

## Monitor your usage

Use Ginny to monitor your Github action usage across your organisations.
