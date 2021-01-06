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
    if (response.status >= 400) {
        throw new Error(await response.json());
    }
    return {
        status: response.status,
        body: await response.json(),
    };
}

module.exports = {
    postToSlack,
}