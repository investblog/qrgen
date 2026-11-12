import { describe, expect, it } from 'vitest';
import config from '../wxt.config';

type Manifest = Record<string, any>;

// A toolbar popup takes precedence over browserAction.onClicked, so a default_popup would bring back the
// Firefox popup instead of the sidebar. Checks both the declared manifest and the post-generation hook.
describe('toolbar button has no popup', () => {
  it.each(['firefox', 'chrome', 'edge'])('%s manifest declares no default_popup', (browser) => {
    const manifest = (config.manifest as (env: Manifest) => Manifest)({ browser, manifestVersion: 3 });
    expect(manifest.action?.default_popup).toBeUndefined();
    expect(manifest.browser_action?.default_popup).toBeUndefined();
  });

  it('the Firefox manifest hook adds no popup and keeps the sidebar icon', () => {
    const hook = (config.hooks as Manifest)['build:manifestGenerated'] as (wxt: Manifest, m: Manifest) => void;
    const manifest: Manifest = {
      browser_action: { default_title: 'x' },
      action: { default_title: 'x' },
      sidebar_action: { default_panel: 'sidepanel.html' },
    };
    hook({ config: { browser: 'firefox' } }, manifest);
    expect(manifest.browser_action.default_popup).toBeUndefined();
    expect(manifest.action.default_popup).toBeUndefined();
    expect(manifest.sidebar_action.default_icon).toEqual({ 16: 'icons/16.png', 32: 'icons/32.png' });
  });
});
