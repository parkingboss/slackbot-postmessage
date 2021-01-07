const fetch = require('node-fetch'),
      core = require('@actions/core');


if (require.main === module) {
    main();
}

async function main() {
    try {
        const token = core.getInput('token', { required: true }),
              request = core.getInput('request', { required: true }),
              verbose = core.getInput('verbose');

        const {status, response} = await postToSlack(token, request, verbose);

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

async function postToSlack(token, body, verbose) {
    if (verbose) {
        console.log("Posting to slack:", body);
    }
    const response = await fetch('https://slack.com/api/chat.postMessage', {
        method: 'POST',
        headers: {
            'Content-type': "application/json; charset=utf8",
            "Authorization": `Bearer ${token}`,
        },
        body,
      });

    const reponseBody = await response.text();

    if (verbose) {
        console.info("Status:", status);
        console.info("Response Body:", formatIfJson(reponseBody));
    }

    return {
        status: response.status,
        body: reponseBody,
    };
}

function formatIfJson(body) {
    try {
        return JSON.stringify(JSON.parse(body), null, 2);
    } catch (err) {
        return body;
    }
}

module.exports = {
    postToSlack,
}