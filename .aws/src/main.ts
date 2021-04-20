import { Construct } from 'constructs';
import { App, RemoteBackend, TerraformStack } from 'cdktf';
import { AwsProvider } from '../.gen/providers/aws';
import { config } from './config';
import { PagerdutyProvider } from '../.gen/providers/pagerduty';
import { createPocketAlbApplication } from './pocketAlbApplication';

class CurationAdminTools extends TerraformStack {
  constructor(scope: Construct, name: string) {
    super(scope, name);

    new AwsProvider(this, 'aws', { region: 'us-east-1' });

    new PagerdutyProvider(this, 'pagerduty_provider', { token: undefined });

    new RemoteBackend(this, {
      hostname: 'app.terraform.io',
      organization: 'Pocket',
      workspaces: [{ prefix: `${config.name}-` }],
    });

    createPocketAlbApplication(this);
  }
}

const app = new App();
new CurationAdminTools(app, 'curation-admin-tools');
app.synth();
