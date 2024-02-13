import aws from 'aws-sdk'

const config = new aws.ConfigService()
const ENVS = process.env.envs
export const handler = async (event) => {


    const eventData = event["invokingEvent"]
    const resultToken = event["resultToken"]
    const jsonData = JSON.parse(eventData)

    const [eventDiff, eventStatus] = [jsonData["configurationItemDiff"], jsonData["configurationItem"]]

    const { changeType } = eventDiff
    const { ARN, awsRegion, awsAccountId, tags, configurationItemStatus, resourceType, resourceId, resourceName, configuration } = eventStatus


    console.log(changeType, ARN, awsRegion, awsAccountId, tags, configurationItemStatus, resourceType, resourceId, resourceName)

    if (changeType === "CREATE" && !isExistForceToTags(tags)) {
        const evaluation = {
            ComplianceResourceType: resourceType,
            ComplianceResourceId: resourceId,
            ComplianceType: "NON_COMPLIANT"
        };

        const putEvaluationsRequest = {
            Evaluations: [evaluation],
            ResultToken: resultToken
        };

        await config.putEvaluationsRequest(putEvaluationsRequest).promise()
    }

    const response = {
        statusCode: 200,
        body: JSON.stringify('Hello from Lambda!'),
    };

    return response;
};

const isExistForceToTags = (tags) => Object.keys(tags).some((it) => ENVS.includes(it))

