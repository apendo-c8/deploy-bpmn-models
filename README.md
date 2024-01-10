### Description

Automate the process of deploying BPMN models to a Camunda cluster. This action is part of a suite of actions designed to streamline the CI/CD pipeline for managing BPMN process models.

### Usage

To use this action in your workflow, follow these steps:

**Set Up Camunda Cluster Access:**

Ensure you have the correct credentials for your Camunda cluster. [Zeebe client authorization](https://docs.camunda.io/docs/self-managed/zeebe-deployment/security/client-authorization/)

You can simply refer to this GitHub action in any GitHub workflow (note some of the inputs are cloud/self-manged specific and can be used/omitted accordingly):

```yaml
- name: Deploy BPMN models
  uses: apendo-c8/deploy-bpmn-models@v2
  with:
    connection_type: 'Choose: cloud or self-managed'
    bpmn_models_source: 'Path to BPMN models'
    zeebe_client_id: 'Zeebe client id'
    zeebe_client_secret: 'Zeebe client secret'
    cluster_id: 'Camunda cloud cluster id (Camunda cloud only)'
    cluster_region: 'Camunda cluster region (Camunda cloud only)'
    oauth_url: 'Authentication url (self-managed only)'
    host_name: 'Camunda cluster hostname (self-managed only)'
    port: 'Camunda cluster port (self-managed only - typically 443)'
    audience: 'Zeebe client audience (self-managed only)'

