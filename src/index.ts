import {ZBClient} from 'zeebe-node'
import {getInput, setFailed} from "@actions/core";
import fs from 'fs';
import * as path from "path";


// General inputs
const CONNECTION_TYPE = getInput('connection_type');
const ZEEBE_CLIENT_ID = getInput('zeebe_client_id')
const ZEEBE_CLIENT_SECRET = getInput('zeebe_client_secret')

// Self-managed inputs
const PORT = getInput('port');
const HOSTNAME = getInput('host_name');
const OAUTH_URL = getInput('oauth_url');
const AUDIENCE = getInput('audience');

// SaaS inputs
const CAMUNDA_CLUSTER_ID = getInput('cluster_id')
const SOURCE = getInput('source');

// let zbc: ZBClient | undefined;
//
// if (CONNECTION_TYPE === 'cloud') {
//     console.log('INSIDE CLOUD')
//
//     zbc = new ZBClient({
//         camundaCloud: {
//             clientId: ZEEBE_CLIENT_ID,
//             clientSecret: ZEEBE_CLIENT_SECRET,
//             clusterId: CAMUNDA_CLUSTER_ID,
//             clusterRegion: "bru-2",
//         },
//     });
// } else if (CONNECTION_TYPE === 'self-managed') {
//
//     console.log('INSIDE SELF -MANAGED')
//
//     zbc = new ZBClient({
//         oAuth: {
//             url: OAUTH_URL,
//             audience: AUDIENCE,
//             clientId: ZEEBE_CLIENT_ID,
//             clientSecret: ZEEBE_CLIENT_SECRET,
//         },
//         hostname: HOSTNAME,
//         port: PORT
//     });
//
// } else {
//     console.error('Invalid connection_type specified.');
//     process.exit(1);
// }

const zbc = new ZBClient({
    oAuth: {
        url: "https://akstest.apendo.se/auth/realms/camunda-platform/protocol/openid-connect/token",
        audience: "zeebe-api",
        clientId: "zeebe",
        clientSecret: "9fx1sSVZ4R",
    },
    hostname: "akstest.apendo.se",
    port: "443"
});

const getFilenamesInFolder = async (folderPath: string): Promise<string[]> => {
    try {

        const files = await fs.promises.readdir(folderPath);
        return files.filter((file) => file.endsWith('.bpmn') && file !== '.bpmnlintrc');
    } catch (error) {
        console.error('Error reading folder:', error);
        return [];
    }
};

const deployBpmnModel = async () => {
    try {

        const filenames = await getFilenamesInFolder(SOURCE);

        for (const file of filenames) {

            if (file.trim() !== '.bpmnlintrc') {
                // @ts-ignore
                const res = await zbc.deployProcess(path.join(SOURCE, file));
                console.log(res);
            }

        }


    } catch (error) {

        setFailed(error instanceof Error ? error.message : 'An error occurred');
    }
}


const runWorkflow = async () => {

    try {

        await deployBpmnModel();

    } catch (error) {
        setFailed(error instanceof Error ? error.message : 'An error occurred');
    }

}

runWorkflow()
    .then(() => {
        console.log("Workflow completed successfully.");
        // @ts-ignore
        zbc.close().then(r => {
        });
    })
    .catch((error) => {
        console.error("Workflow failed:", error)
        // @ts-ignore
        zbc.close().then(r => {
        });
    });