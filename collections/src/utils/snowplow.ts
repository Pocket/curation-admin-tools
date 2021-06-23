import { config } from '../config';

export function buildSnowplowEvent(trigger: string) {
  return {
    schema: config.snowplow.schemas.objectUpdate,
    data: {
      object: 'collection',
      trigger,
    },
  };
}

export function buildSnowplowEntity(version: 'new' | 'old', data: any) {
  let entity: any = {
    object_version: version,
    collection_id: data.externalId,
    slug: data.slug,
    status: data.status.toLowerCase(),
    title: data.title,
    excerpt: data.excerpt,
    intro: data.intro,
    authors: [],
    stories: [],
  };

  // we can't send a null value here, so make sure it exists before sending to snowplow
  if (data.imageUrl) {
    entity.imageUrl = data.imageUrl;
  }

  if (data.publishedAt) {
    // TODO: convert this string to a timestamp
    entity.published_at = data.publishedAt;
  }

  return {
    schema: config.snowplow.schemas.collection,
    data: entity,
  };
}
