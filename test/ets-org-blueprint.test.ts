import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import * as EtsOrgBlueprint from '../lib/ets-org-blueprint-stack';

test('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new EtsOrgBlueprint.EtsOrgBlueprintStack(app, 'MyTestStack');
    // THEN
    expectCDK(stack).to(matchTemplate({
      "Resources": {}
    }, MatchStyle.EXACT))
});
