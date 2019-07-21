import tl = require('azure-pipelines-task-lib/task');
import tlr = require('azure-pipelines-task-lib/toolrunner');
import pp = require('./PipeLineCommon');

let testTask = {};
let input = new Map();
let sysVar = new Map();

input.set('OctaneService', 'Octane');
sysVar.set('System.TeamFoundationCollectionUri', 'https://dev.azure.com/octaneuser/');
sysVar.set('System.TeamProjectId', '86819eb3-d6b0-4490-ba8d-fe4d8e808656');
sysVar.set('System.TeamProject', 'myproject');

let auth = { parameters: { 'username': "sa@nga", 'password': "Welcome1" }, scheme: 'username' };

function initTl(testTask: any) {
    testTask.execSync = (tool: string, args: string | string[], options?: tlr.IExecSyncOptions) => {
        return tl.execSync(tool, args, options);
    };
    testTask.getEndpointUrl = (id: string, optional: boolean) => {
        return 'http://localhost:8080/ui/?p=1001/1002';
    };
    testTask.getInput = (name: string, required?: boolean) => {
        return input.get(name);
    };

    testTask.getEndpointAuthorization = (name: string, required?: boolean) => {
        return auth;
    };

    testTask.getEndpointDataParameter = (id: string, key: string, optional: boolean) => {
        return undefined;
    };

    testTask.getVariable = (name: string) => {
        return sysVar.get(name);
    };

    return testTask;
}

let task = initTl(testTask);
let result = task.execSync(`node`, `--version`);
console.log('node version = ' + result.stdout);

console.log(task.getInput('OctaneService'));
let endpointAuth = task.getEndpointAuthorization(task.getInput('OctaneService'), false);
let clientId = endpointAuth.parameters['username'];
let clientSecret = endpointAuth.parameters['password'];
console.log('clientId=' + clientId + " clientSecret=" + clientSecret);
process.env.HTTPS_PROXY = "";
process.env.https_proxy = "";
process.env.HTTP_PROXY = "";
process.env.http_proxy = "";
pp.run(task);
