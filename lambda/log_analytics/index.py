import os
import time
from datetime import datetime, timedelta
from dataclasses import dataclass
import openai
import boto3

logs = boto3.client("logs")
cw = boto3.client("cloudwatch")
dynamodb = boto3.client('dynamodb')
sm = boto3.client('secretsmanager')
# CONFIG
PRODUCT = os.getenv("PRODUCT")
DB_NAME = os.getenv("DB_NAME")
SECRET_ID = os.getenv("SECRET_ID")
SCOPE = os.getenv("SCOPE")
LOG_GROUP = os.getenv("LOG_GROUP")
LAST_LOG_MINUTES = os.getenv("LAST_LOG_MINUTES")
SNS_ARN = os.environ.get("SNS_ARN", '')

client = boto3.client('secretsmanager')
openai.api_key = sm.get_secret_value(
    SecretId=SECRET_ID
)['SecretString']


@dataclass(slots=True)
# Define the model
class Item():
    ip: str
    product: str
    comment: str
    last_updated: str
    created: str
    request: str


def create_item(item: Item):
    # Function to create an item in DynamoDB
    current_time = datetime.now().isoformat()
    dynamodb.put_item(
        TableName=DB_NAME,
        Item={
            'ip': {'S': item.ip},
            'product': {'S': item.product},
            'comment': {'S': item.comment},
            'last_updated': {'S': current_time},
            'created': {'S': current_time},
            'request': {'S': item.request}
        }
    )


def get_item(ip: str, product: str):
    # Function to retrieve an item from DynamoDB
    response = dynamodb.get_item(
        TableName=DB_NAME,
        Key={'ip': {'S': ip}, 'product': {'S': product}}

    )
    if 'Item' in response:
        item = response['Item']
        return Item(
            ip=item['ip']['S'],
            product=item['product']['S'],
            comment=item['comment']['S'],
            last_updated=item['last_updated']['S'],
            created=item['created']['S'],
            request=item['request']['S']
        )
    else:
        return None


def update_item(item: Item):
    # Function to update an item in DynamoDB
    current_time = datetime.now().isoformat()
    dynamodb.update_item(
        TableName=DB_NAME,
        Key={'ip': {'S': item.ip}, 'product': {'S': item.product}},
        UpdateExpression='SET product = :p, comment = :c, last_updated = :lu',
        ExpressionAttributeValues={
            ':p': {'S': item.product},
            ':c': {'S': item.comment},
            ':lu': {'S': current_time},
            ':r': {'S': item.request}
        }
    )


def delete_item(ip: str, product: str):
    # Function to delete an item from DynamoDB
    dynamodb.delete_item(
        TableName=DB_NAME,
        Key={'ip': {'S': ip}, 'product': {'S': product}}
    )


def get_ip_list():
    # Function to retrieve a list of IP addresses from DynamoDB
    response = dynamodb.scan(
        TableName=DB_NAME,
        ProjectionExpression='ip'
    )
    ip_list = [item['ip']['S'] for item in response['Items']]
    return ip_list


def ask_chatgpt(question):
    # Define the prompt
    prompt = f"Question: {question}\nAnswer:"

    # Generate a response from ChatGPT
    response = openai.Completion.create(
        engine='gpt-4',
        prompt=prompt,
        max_tokens=150,
        n=1,
        stop=None,
        temperature=0.3,
    )

    # Extract the answer from the response
    answer = response.choices[0].text.strip()
    print(response["usage"])
    return answer


def query(logGroupName: str, query_string: str):
    start_query_response = logs.start_query(
        logGroupName=logGroupName,
        startTime=int(
            (datetime.now() - timedelta(minutes=int(LAST_LOG_MINUTES))).timestamp()),
        endTime=int(datetime.now().timestamp()),
        queryString=query_string,
    )

    query_id = start_query_response["queryId"]

    # Just polling the API. 5 seconds seems to be a good
    # compromise between not pestering the API and not paying
    # too much for the Lambda.
    response = None
    while response is None or response["status"] == "Running":
        print("waiting for query to complete ...")
        time.sleep(5)
        response = logs.get_query_results(queryId=query_id)

    # Data comes in a strange format, a dictionary of
    # {"field":name,"value":actual_value}, so this converts
    # it into something that can be accessed through keys
    data = []
    for d in response["results"]:
        sample = {}
        for i in d:
            field = i["field"]
            value = i["value"]

            sample[field] = value

        data.append(sample)
    return data


def GetTopIPs():
    ips = []
    top_ips_query = """filter action = "ALLOW" AND httpRequest.uri != '/'
| stats count(*) as ip by httpRequest.clientIp
| sort ip desc"""
    clientIps = query(logGroupName=LOG_GROUP, query_string=top_ips_query)
    for d in clientIps:
        ips.append(d['httpRequest.clientIp'])
    return ips


def GetCallsFromIP(ip):
    # Query every Top IP and see what they did
    query_string = f"""filter httpRequest.clientIp = '{ip}' AND httpRequest.uri != '/'
| fields httpRequest.uri as uri
| limit 10"""

    result = query(query_string=query_string, logGroupName=LOG_GROUP)
    uris = []
    for d in result:
        uris.append(d['uri'])

    uris = list(set(uris))
    print(f"Checking requests: {uris}")
    return uris


def AskChatGPTAboutTheUris(uris):
    question = f"""Can this requests to my web app be part of an attack? Give an brief explanation and respond with #YES# or #NO# if this should be blocked. These are the uri calls: {
        uris}"""

    print(f"Checking: {uris}")
    answer = ask_chatgpt(question)
    return answer


def make_message(item: Item):
    message = f"""🛑 URGENT: IP Added to BLOCKLIST 🛑

🔒 IP Address: {item.ip}
🌐 URL Call: {item.request}
🚫 Reason: {item.comment}"""
    return message


def send_sns(message: str):
    """
    Send an SNS message to the specified topic.
    """
    if SNS_ARN == "":
        return

    sns_client = boto3.client('sns')

    topic_arn = SNS_ARN
    response = sns_client.publish(
        TopicArn=topic_arn,
        Message=message
    )

    return response


def CheckAlreadyProcessedIPs(input_ips):
    already_seen_ips = get_ip_list()
    print("Filtering ips...")
    delta = [x for x in input_ips if x not in already_seen_ips]
    return delta


def block(item: Item):
    create_item(item)
    send_sns(message=make_message(item))


def ProcessChatGPTAnswer(answer: str, ip_involved: str, request: str):
    print(f"The ip {ip_involved}")
    answer = answer.strip()
    if "#YES#" in answer:
        answer = answer.replace("#YES#", '')
        print("Should be blocked.")
        if not get_item(ip=ip_involved, product=PRODUCT):
            item = Item(ip=ip_involved, product=PRODUCT,
                        comment=answer, last_updated=datetime.now().isoformat(), created=datetime.now().isoformat(), request=request)
            block(item=item)

    elif "#NO#" in answer:
        answer = answer.replace("#NO#", '')
        print("Should not be blocked.")


def handler(event, context):
    top_ips = GetTopIPs()
    top_ips = CheckAlreadyProcessedIPs(top_ips)
    print(top_ips)
    if top_ips:
        for ip in top_ips:
            calls_from_ip = GetCallsFromIP(ip)
            print(calls_from_ip)
            if calls_from_ip:
                chatgpt_answer = AskChatGPTAboutTheUris(calls_from_ip)
                ProcessChatGPTAnswer(answer=chatgpt_answer,
                                     ip_involved=ip, request=''.join(calls_from_ip))


if __name__ == '__main__':
    handler(None, None)
