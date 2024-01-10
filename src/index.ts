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
const BPMN_MODEL_SOURCE = getInput('bpmn_models_source');
const REGION = getInput('cluster_region')

let zbc: ZBClient;

// Create and configure zeebe client correctly based on the connection_type input
if (CONNECTION_TYPE === 'cloud') {
    zbc = new ZBClient({
        camundaCloud: {
            clientId: ZEEBE_CLIENT_ID,
            clientSecret: ZEEBE_CLIENT_SECRET,
            clusterId: CAMUNDA_CLUSTER_ID,
            clusterRegion: REGION,
        },
    });
} else if (CONNECTION_TYPE === 'self-managed') {
    zbc = new ZBClient({
        oAuth: {
            url: OAUTH_URL,
            audience: AUDIENCE,
            clientId: ZEEBE_CLIENT_ID,
            clientSecret: ZEEBE_CLIENT_SECRET,
        },
        hostname: HOSTNAME,
        port: PORT
    });

} else {
    console.error('Invalid connection_type specified.');
    process.exit(1);
}


const getFilenamesInFolder = async (folderPath: string): Promise<string[]> => {
    try {
        const files = await fs.promises.readdir(folderPath);
        return files.filter((file) => file.endsWith('.bpmn') && file !== '.bpmnlintrc');
    } catch (error) {
        console.error('Error reading folder:', error);
        process.exit(1)
    }
};

const deployBpmnModel = async () => {
    try {

        const filenames = await getFilenamesInFolder(BPMN_MODEL_SOURCE);

        for (const file of filenames) {

            if (file.trim() !== '.bpmnlintrc') {
                const res = await zbc.deployProcess(path.join(BPMN_MODEL_SOURCE, file));
                console.log(res);
            }

        }


    } catch (error) {
        setFailed(error instanceof Error ? error.message : 'An error occurred');
    } finally {
        console.log('Closing Zeebe client.');
        await zbc.close();
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
        console.log("Workflow run completed.");
        zbc.close().then(r => {
        });
    })
    .catch((error) => {
        console.error("Workflow run failed:", error)
        zbc.close().then(r => {
        });
    });