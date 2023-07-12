import { CdkCustomResourceEvent } from 'aws-lambda';


export async function scheduledEvent(event: CdkCustomResourceEvent) {
  console.log('Event 👉', event);
}
