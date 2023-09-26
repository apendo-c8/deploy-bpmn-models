import {ZBClient} from 'zeebe-node'
import {getInput, setFailed} from "@actions/core";
import fs from 'fs';
import * as path from "path";

const ZEEBE_CLIENT_ID = getInput('client_id')
const ZEEBE_CLIENT_SECRET = getInput('client_secret')
const CAMUNDA_CLUSTER_ID = getInput('cluster_id')
const SOURCE = getInput('source');

const zbc = new ZBClient({
    camundaCloud: {
        clientId: ZEEBE_CLIENT_ID,
        clientSecret: ZEEBE_CLIENT_SECRET,
        clusterId: CAMUNDA_CLUSTER_ID,
        clusterRegion: "bru-2",
    },
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
            console.log("File: " + file)

            if (file.trim() !== '.bpmnlintrc') {
                console.log("Files. " + file);
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
        zbc.close().then(r => {
        });
    })
    .catch((error) => {
        console.error("Workflow failed:", error)
        zbc.close().then(r => {
        });
    });