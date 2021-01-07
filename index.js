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

        const {ok, error, ts, message} = await postToSlack(token, request, verbose);

        if (ok) {
            core.setOutput("ts", ts);
            core.setOutput("message", JSON.stringify(message));
        } else {
            console.error("Post to Slack Failed with error:", error);
            core.setOutput("error", error);
            core.setFailed(`Failed to post to slack. See "error" output for more info`);
        }
    } catch (err) {
        console.error("Unexpected Error:", err);
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

    const responseBody = await response.json();

    if (verbose) {
        console.info("Response Body:", JSON.stringify(reponseBody, null, 2));
    }

    return responseBody;
}

module.exports = {
    postToSlack,
}