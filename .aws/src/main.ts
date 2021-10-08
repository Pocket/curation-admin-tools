import { Construct } from 'constructs';
import { App, RemoteBackend, TerraformStack } from 'cdktf';
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

    new AwsProvider(this, 'aws', { region: 'us-east-1' });

    new PagerdutyProvider(this, 'pagerduty_provider', { token: undefined });
    new LocalProvider(this, 'local_provider');
    new NullProvider(this, 'null_provider');

    new RemoteBackend(this, {
      hostname: 'app.terraform.io',
      organization: 'Pocket',
      workspaces: [{ prefix: `${config.name}-` }],
    });

    const pocketApp = createPocketAlbApplication(this);
    createApplicationCodePipeline(this, pocketApp);
  }
}

const app = new App();
new CurationAdminTools(app, 'curation-admin-tools');
app.synth();
