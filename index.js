const fetch = require('node-fetch'),
      core = require('@actions/core');


if (require.main === module) {
    main();
}

async function main() {
    try {
        const token = core.getInput('token', { required: true }),
              request = core.getInput('request', { required: true });

        const {status, response} = await postToSlack(token, request);

        core.setOutput('status', status);
        core.setOutput('response', response);
        if (status >= 400) {
            core.setFailed(`Slack responded with a failure code: ${status}`);
        }
    } catch (err) {
        console.error(err);
        core.setFailed(err.message);
    }
}

async function postToSlack(token, body) {
    const response = await fetch('https://slack.com/api/chat.postMessage', {
        method: 'POST',
        headers: {
            'Content-type': "application/json; charset=utf8",
            "Authorization": `Bearer ${token}`,
        },
        body,
      });
    return {
        status: response.status,
        body: await response.text(),
    };
}

module.exports = {
    postToSlack,
}