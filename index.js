const axios = require('axios').default;
const core = require('@actions/core');
//const https = require('https');

const host = core.getInput('host');
const apiUser = core.getInput('api-username');
const apiPw = core.getInput('api-password');
const cluster = core.getInput('cluster-id');
const project = core.getInput('project-id');
const namespace = core.getInput('namespace');
const workload = core.getInput('workload');
const image = core.getInput('image');
const slackHookUrl = core.getInput('slack-hook-url');

const githubRepo = process.env.GITHUB_REPOSITORY;
const githubRunId = process.env.GITHUB_RUN_ID;
const jobUrl = `https://github.com/${githubRepo}/actions/runs/${githubRunId}`;
const api = `${host}/project/${cluster}:${project}/workloads/deployment:${namespace}:${workload}`;

console.log(`
Deploying image:
${image}
to Rancher at url:
${api}
`);

process.on('unhandledRejection', error => {
  if (slackHookUrl) {
    axios.post(slackHookUrl, {
      text: `Oh no, il deployment di ${image} si è rotto!\n<${jobUrl}|Clicca qui> per vedere il log.`,
    });
  }
  core.setFailed(error.message);
});

(async () => {
  const config = {
    auth: {
      username: apiUser,
      password: apiPw,
    },
    //httpsAgent: new https.Agent({
      //rejectUnauthorized: false,
    //}),
  };

  console.log('Getting containers info...');
  const {
    data: { actions, containers, links },
  } = await axios.get(api, config);
  console.log('Got containers info...');
  console.log(containers);

  let needsRedeploy = false;
  const newContainers = containers.map(cont => {
    if (cont.image === image) {
      // images are equal when using the 'latest' tag, e.g. in staging
      needsRedeploy = true;
    }
    return {
      ...cont,
      image,
    };
  });

  console.log('Pushing new containers info...');
  console.log(newContainers);
  const res = await axios.put(
    links.update,
    { containers: newContainers },
    config,
  );
  console.log(res.status, ' - ', res.statusText);

  if (needsRedeploy) {
    await axios.post(actions.redeploy, null, config);
  }

  if (slackHookUrl) {
    console.log(`Logging deployment to ${slackHookUrl}`);
    axios.post(slackHookUrl, {
      text: `Il deployment di ${image} è stato completato con successo! 🎉`,
    });
  }
})();

