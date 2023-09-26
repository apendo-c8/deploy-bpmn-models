### Description

Automate the process of deploying BPMN models to a Camunda cluster. This action is part of a suite of actions designed to streamline the CI/CD pipeline for managing BPMN process models.

### Usage

To use this action in your workflow, follow these steps:

**Set Up Camunda Cluster Access:**

Ensure you have the correct credentials for your Camunda cluster. [Zeebe client authorization](https://docs.camunda.io/docs/self-managed/zeebe-deployment/security/client-authorization/)

You can simply refer to this GitHub action in any GitHub workflow:

```yaml
- name: Deploy BPMN models
  uses: apendo-c8/deploy-bpmn-models@v1
  with:
    source: 'your-tag-name'
    client_id: 'Zeebe client id'
    client_secret: 'Zeebe client secret'
    cluster_id: 'Zeebe cluster id'
