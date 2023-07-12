from datetime import datetime
from dataclasses import dataclass
import boto3
import os


waf = boto3.client('wafv2')
dynamodb = boto3.client('dynamodb')

# CONFIG
IP_SET_NAME = os.getenv("IP_SET_NAME")
PRODUCT = os.getenv("PRODUCT")
DB_NAME = os.getenv("DB_NAME")
SCOPE = os.getenv("SCOPE")


@dataclass(slots=True)
# Define the model
class Item():
    ip: str
    product: str
    comment: str
    last_updated: str
    created: str


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
            'created': {'S': current_time}
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
            created=item['created']['S']
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
            ':lu': {'S': current_time}
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
    print(f"Received ips from DynamoDB: {ip_list}")
    return ip_list


def create_ip_set(ips):
    return waf.create_ip_set(
        Name=IP_SET_NAME,
        Scope=SCOPE,
        IPAddressVersion='IPV4',
        Addresses=ips
    )


def update_ip_set(ip_set, ips, lock_token):
    print(f"Updating ip set {ip_set} with {ips}.")
    waf.update_ip_set(
        Name=ip_set['Name'],
        Scope=SCOPE,
        Id=ip_set['Id'],
        Addresses=ips,
        LockToken=lock_token
    )


def update_create_ip_set(ips):
    ip_sets = waf.list_ip_sets(
        Scope=SCOPE
    )
    if not ip_sets['IPSets']:
        return create_ip_set(ips=ips)

    for ip_set in ip_sets['IPSets']:
        if ip_set["Name"] == IP_SET_NAME:
            lock_token = ip_set["LockToken"]
            update_ip_set(ip_set=ip_set, ips=ips, lock_token=lock_token)
            return
    print(f"Cant find ip-set {IP_SET_NAME}")


def update_dynamodb():
    ips = get_ip_list()

    ip_set_ips = []
    for ip in ips:
        ip_set_ips.append(f'{ip}/32')

    update_create_ip_set(ip_set_ips)


def handler(event, context):
    update_dynamodb()


if __name__ == '__main__':
    handler(None, None)
