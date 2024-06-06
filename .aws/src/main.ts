import { Construct } from 'constructs';
import { App, S3Backend, TerraformStack } from 'cdktf';
import { AwsProvider } from '@cdktf/provider-aws';
import { config } from './config';
import { PagerdutyProvider } from '@cdktf/provider-pagerduty';
import {
  createApplicationCodePipeline,
  createPocketAlbApplication,
} from './pocketAlbApplication';
import { LocalProvider } from '@cdktf/provider-local';
import { NullProvider } from '@cdktf/provider-null';

class CurationAdminTools extends TerraformStack {
  constructor(scope: Construct, name: string) {
    super(scope, name);

    new AwsProvider(this, 'aws', {
      region: 'us-east-1',
      defaultTags: { tags: config.tags },
    });

    new PagerdutyProvider(this, 'pagerduty_provider', { token: undefined });
    new LocalProvider(this, 'local_provider');
    new NullProvider(this, 'null_provider');

    new S3Backend(this, {
      bucket: `mozilla-content-team-${config.environment.toLowerCase()}-terraform-state`,
      dynamodbTable: `mozilla-content-team-${config.environment.toLowerCase()}-terraform-state`,
      key: config.name,
      region: 'us-east-1',
    });

    const pocketApp = createPocketAlbApplication(this);
    createApplicationCodePipeline(this, pocketApp);
  }
}

const app = new App();
new CurationAdminTools(app, 'curation-admin-tools');
app.synth();
