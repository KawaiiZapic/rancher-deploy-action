# Rancher Deploy Action

Deploys a new image to a k8s deployment using Rancher v2 API

## Inputs

### `host`

**Required** Rancher server host

### `api-username`

**Required** Rancher API username

### `api-password`

**Required** Rancher API password

### `cluster-id`

**Required** Target cluster id

### `project-id`

**Required** Target Project id

### `namespace`

**Required** Target namespace

### `workload`

**Required** Target workload name

### `image`

**Required** Image to be deployed

### `slack-hook-url`

Slack hook to post notifications to

## Example usage

```yaml
- uses: actions/rancher-deploy-action@v0.1.0
  with:
    host: 'https://rancher.example.com/v3
    api-username: 'xxxxxxxxxxxxxxx'
    api-password: 'xxxxxxxxxxxxxxx'
    cluster-id: 'c-xxxxx'
    project-id: 'p-xxxxx'
    namespace: 'my-namespace'
    workload: 'my-workload'
    image: 'my-image:latest'
    slack-hook-url: 'https:my-slack-hook-url'
```

