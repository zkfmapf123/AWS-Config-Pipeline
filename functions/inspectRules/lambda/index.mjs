import aws from "aws-sdk";

const config = new aws.ConfigService();
const ENVS = process.env.ENVS;

const CONFIG_FLAGS = {
  MATCH: "COMPLIANT", // 준수
  NOTMATCH: "NON_COMPLIANT", // 미준수
};

export const handler = async (event) => {
  console.log(JSON.stringify(event, null, 4));
  const [eventData, resultToken] = [
    event["invokingEvent"],
    event["resultToken"],
  ];

  const jsonData = JSON.parse(eventData);
  const [eventDiff, eventStatus] = [
    jsonData["configurationItemDiff"],
    jsonData["configurationItem"],
  ];

  const {
    ARN,
    awsRegion,
    awsAccountId,
    tags,
    configurationItemStatus,
    resourceType,
    resourceId,
    resourceName,
    configuration,
    configurationItemCaptureTime,
  } = eventStatus;

  const evaluation = {
    ComplianceResourceType: resourceType,
    ComplianceResourceId: resourceId,
    ComplianceType: CONFIG_FLAGS.MATCH,
    OrderingTimestamp: configurationItemCaptureTime,
  };

  if (!isExistForceToTagKeys(tags)) {
    evaluation.ComplianceType = CONFIG_FLAGS.NOTMATCH;
  }

  const putEvaluationsRequest = {
    Evaluations: [evaluation],
    ResultToken: resultToken,
  };

  await config.putEvaluations(putEvaluationsRequest).promise();
};

// Envs에 있는 태그들이 모두 있어야 함
const isExistForceToTagKeys = (tags) => {
  const envString = ENVS.split(",");
  const matchTags = Object.keys(tags).filter((it) => envString.includes(it));

  return envString.length === matchTags.length;
};
