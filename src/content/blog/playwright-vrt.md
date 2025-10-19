---
title: Playwright for visual regression testing in Storybook is stupid easy
description: It will exceed your wildest expectations, or your money back.
pubDate: 2022-10-18
categories: ['dev']
---

<a href="https://playwright.dev/">Playwright</a> is shaping up to be an invaluable tool for testing. Imagine if Puppeteer could also run Firefox, Safari, and more, and imagine it had an even better API (which is saying something, because its API is pretty good to begin with!).

It sounds too good to be true, but that’s what makes Playwright so amazing. Since implementing it on Snyk’s design system, it’s done a great job of not only providing visual regression testing (VRT), but catching _browser-specific_ regressions which has been invaluable.

In this example we’ll show how to get Playwright to take screenshots of <a href="https://storybook.js.org" target="_blank" rel="noreferrer">Storybook</a> stories to catch regressions. But nothing here is Storybook-dependent; if you had any other example of your components or pages you’d like to screenshot, anything will work (even your live production site, if you’d like).

Here’s the basic premise from a technical standpoint:

1. The components and/or pages we’d like to screenshot must be easily viewable in some way (e.g. Storybook)
1. We’ll create a static build of our components/pages both to test a “production” env as well as improve test speed
1. To load that static build, we’ll start up a local static file server
1. Playwright will then use our static file server to take screenshots

And from a workflow standpoint, here’s how you and your team would use VRT:

- Whenever a component and/or page is added, a VRT test is written and a screenshot is taken locally.
- Screenshots are committed to git locally as part of the PR.
- Visual changes are thus part of the PR review process (and GitHub has an <a href="https://blog.jakelee.co.uk/exploring-pull-requests-with-githubs-rich-diff-functionality/" target="_blank" rel="noreferrer">incredible image diff tool</a> built in to PR reviews!)
- Regressions are then caught in the offending PR, and must be resolved in the PR to get it passing again.

## Step one: setup

Install Playwright just like you would any other test runner: via npm:

```sh
npm i -D @playwright/test servor
```

<i>Note: this setup uses the super minimal <a href="https://www.npmjs.com/package/servor" target="_blank" rel="noreferrer">servor</a> for a static file server, but you can replace with any static file server instead.</i>

Next, add a `playwright.config.ts` file in your project root (this example uses Chrome, Firefox, and Safari, but <a href="https://playwright.dev/docs/emulation#devices" target="_blank" rel="noreferrer">even more are possible</a>):

```ts
import { type PlaywrightTestConfig, devices } from '@playwright/test';

// settings
const PORT = process.env.PORT || 5678;
const viewport = { width: 1280, height: 800 };
const deviceScaleFactor = 2;
const locale = 'en-us';

const config: PlaywrightTestConfig = {
  // note: full options are specified because \`devices\`
  // have inconsistent viewports, etc.
  projects: [
    {
      name: 'chromium',
      use: {
        userAgent: devices['Desktop Chrome'].userAgent,
        viewport,
        deviceScaleFactor,
        isMobile: false,
        hasTouch: false,
        defaultBrowserType: devices['Desktop Chrome'].defaultBrowserType,
        locale,
      },
    },
    {
      name: 'firefox',
      use: {
        userAgent: devices['Desktop Firefox'].userAgent,
        viewport,
        deviceScaleFactor,
        isMobile: false,
        hasTouch: false,
        defaultBrowserType: devices['Desktop Firefox'].defaultBrowserType,
        locale,
      },
    },
    {
      name: 'webkit',
      use: {
        userAgent: devices['Desktop Safari'].userAgent,
        viewport,
        deviceScaleFactor,
        isMobile: false,
        hasTouch: false,
        defaultBrowserType: devices['Desktop Safari'].defaultBrowserType,
        locale,
      },
    },
  ],
  webServer: {
    command: \`npx servor index.html \${PORT}\`,
    port: PORT,
  },
};

export default config;
```

Then we’ll set up our `test:vrt` script in `package.json<`:

```diff
  "scripts": {
+   "build:sb": "npx build-storybook && npx sb extract",
+   "test:vrt": "npm run build:sb && npx playwright test",
  }
```

This shows the most basic setup where a fresh Storybook build is done before every test run. This can get pretty slow, so adjust to taste if you find yourself wanting to run VRT on its own. You can (and should!) go beyond this post and configure your test setup to whatever works best for you.

Lastly, you’ll want to install all the browser binaries necessary to run your tests:

```sh
npx playwright install
```

From time to time you’ll need to run `npx playwright install` again as Playwright updates and newer browser binaries are available. But it’s not something you have to think about; Playwright will give you a friendly reminder in its test output when it’s necessary to do so.

After you’ve read this blog post and kicked the tires a bit, you may come back to adding <a href="https://playwright.dev/docs/test-configuration" target="_blank" rel="noreferrer">additional setup</a> here or adding creature comforts like <a href="https://playwright.dev/docs/getting-started-vscode" target="_blank" rel="noreferrer">the VS Code Extension</a>. Playwright has built a wonderful little ecosystem of fun things to explore that may be huge timesavers for you and/or your team (and for as hard as testwriting can be, every little thing helps!).

## Step two: writing a test

If you’ve written tests for a Puppeteer, Cypress, or some other similar browser-based test runner, you’ll find lots of similarities to Playwright in the general _load browser → navigate to URL → write assertions_ workflow. But even if you haven’t, Playwright is the friendliest introduction to browser-based testing I’ve ever seen.

Since we’re using Storybook, we’ll write a `loadStory` function to make Storybook loading easier. You’ll definitely want to move this into a **common utilities file**.

```ts
// src/test/utils.ts

import * as Playwright from '@playwright/test';
import fs from 'fs';

// config
const PROJECT_ROOT = new URL('../../', import.meta.url);
const STORYBOOK_DIR = new URL('./storybook-static/', PROJECT_ROOT);

/** Load Storybook story for Playwright testing */
export async function loadStory(page: Playwright.Page, storyID: string) {
  // load stories.json
  const storiesManifestLoc = new URL('stories.json', STORYBOOK_DIR);
  if (!fs.existsSync(storiesManifestLoc)) {
    console.error('✘ Could not find storybook-static/stories.json. Try rebuilding with \`npm run build:sb\`');
    process.exit(1);
  }
  const storiesManifest = JSON.parse(fs.readFileSync(storiesManifestLoc, 'utf8'));

  // load specific story
  const storyMeta = storiesManifest.stories[storyID];
  if (!storyMeta) {
    console.error(\`✘ Could not find story ID "\${storyID}". Try rebuilding with \\\`npm run build:sb\\\`\`);
    process.exit(1);
  }
  const search = new URLSearchParams({ viewMode: 'story', id: storyMeta.id });
  await page.goto(\`iframe.html?\${search.toString()}\`, { waitUntil: 'networkidle' });

  // wait for page to finish rendering before starting test
  await page.waitForSelector('#root');
}
```

Here’s the main gist of what this is doing:

- `stories.json` was made from the `npx sb extract` command earlier. We use this to load stories.
- `await page.goto(…)` tells Playwright to visit a specific story URL (in the isolated iframe mode)
- `{'{'} waitUntil: 'networkidle' {'}'}` is a handy little command to tell Playwright to wait for all assets to load before beginning the test
- `await page.waitForSelector('#root')` is the final piece needed to ensure Playwright doesn’t get too antsy and start taking screenshots of pages before any components rendered
- There are a few friendly `console.error` messages in places to help debugging

With setup out of the way, we’ll write our first test. Let’s pretend we want to take a screenshot of our button story, which lives at `/story/components-button--default`. Strap in—it’s going to be a real doozy:

```ts
// src/components/button/button.test.ts

import { expect, test } from '@playwright/test';
import { loadStory } from '../../test/utils.js';

test('Button: default', async ({ page }) => {
  await loadStory(page, 'components-button--default');
  await expect(page).toHaveScreenshot();
});
```

Just kidding—that’s it! 🎉 In two lines, we can load a page and take a screenshot. When you run `npm run test:vrt` the first time it will create PNGs from the screenshots it took:

```diff
  src/components/button/button.jsx
  src/components/button/button.test.ts
+ src/components/button/button.test.ts-snapshots/Button-default-chromium-darwin.png
+ src/components/button/button.test.ts-snapshots/Button-default-firefox-darwin.png
+ src/components/button/button.test.ts-snapshots/Button-default-webkit-darwin.png
```

Commit these to your project. It will then compare against these files in future runs, and if the pixel diff is significant enough Playwright will throw the test suite.

> ✨Tip: our example is given the default `.test.ts` extension, but if you’re also using another test runner for unit testing like <a href="/blog/vitest">Vitest</a>, you’ll have conflicts. Consider using something like an `.e2e.ts` extension for Playwright tests, which you can set via the <a href="https://playwright.dev/docs/test-configuration" target="_blank" rel="noreferrer">testMatch</a> config option.

To run tests again, run `npm run test:vrt` locally to run the full suite. Any regressions should be either fixed, or have updated screenshots with `npx playwright test --update-snapshots`.

## Step three: writing a behavioral test

The real win in using Playwright is testing component interactivity cross-browser, and ensuring it behaves as expected. Let’s expand our button tests with one testing the focus state:

```ts
// src/components/button/button.test.ts

import { expect, test } from '@playwright/test';
import { loadStory } from '../../test/utils.js';

test('Button: default', async ({ page }) => {
  // …
});

test('Button: focus', async ({ page }) => {
  await loadStory(page, 'components-action-button--default');

  // focus on button (note: Storybook has several hidden buttons; select ours with text “Button”)
  await page.locator('text=button').first().focus();

  await expect(page).toHaveScreenshot();
});
```

Because we’re using _actual_ browsers, we can simply select an element and call `.focus()`. This is powerful, getting to test accessibility compliance automatically across multiple browsers. And there’s so much more you could test, such as:

- Testing forms show <a href="https://www.nngroup.com/articles/errors-forms-design-guidelines/" target="_blank" rel="noreferrer">validation errors after blur</a>, etc.
- Testing dialogs open as expected
- Testing keyboard functionality on complex components (e.g. comboboxes)
- Responsive testing using <a href="https://playwright.dev/docs/api/class-page#page-set-viewport-size" target="_blank" rel="noreferrer">page.setViewport()</a>

If you’re testing accessibility of a website such as visible focus ring, the only real way to test this is using VRT. And it couldn’t be easier to do than with Playwright.

## Step four: Playwright VRT in CI

Of course, what good is VRT if it’s not baked into continuous integration? Tests are worthless if they’re never run, after all.

It’s worth noting that for VRT to work, **the test environment must match the environment that took the screenshots**. Meaning, if you and your team take screenshots on a Mac, VRT in CI needs to run on a Mac. We’ll come back to the scenario where this isn’t possible for you, and why paid VRT tools do it differently. But for now we’ll run with the assumption committing screenshots to git as part of a pull request works best for you and your team.

We’ll set up our VRT suite using GitHub Actions, but this can be done in any CI setup. We’ll create our `/.github/workflows/ci.yml` file along with a `vrt` job that runs our script:

```yaml
on:
  push:
    branches:
      - main
  pull_request:
  workflow_dispatch:

jobs:
  vrt:
    runs-on: macos-12 # note: "macos-latest" is 11.x
    concurrency:
      group: \${{ github.ref }}/vrt
      cancel-in-progress: true
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm ci --ignore-scripts
      - run: npx playwright install --with-deps
      - run: npm run test:vrt
      - name: Upload failures
        if: \${{ failure() }}
        uses: actions/upload-artifact@v3
        with:
          name: Playwright Failure
          path: test-results/
```

This will run in GitHub Actions on every PR, and report any failures that happened. Playwright will list out the specific tests that failed in its error logs, but to see the actual diff you’ll need to <a href="https://docs.github.com/en/actions/managing-workflow-runs/downloading-workflow-artifacts" target="_blank" rel="noreferrer">download the artifact</a> it generated. But assuming it was an actual regression and not a flaky test, the PR diff itself will give pretty strong hints as to what caused the regression.

<figure>
  <img src="/assets/posts/playwright-vrt/github-image-diff.png" alt="GitHub’s image diff tool" />
  <figcaption>GitHub has powerful image diff tools like sliders and onion skinning available in the “Files changed” tab. What more could you want for inspecting screenshot changes? (© GitHub)</figcaption>
</figure>

You could get even fancier with this like <a href="https://github.com/marketplace/actions/create-or-update-comment" target="_blank">using GitHub’s comment API</a> to post the image diffs in a PR comment. But this is just a basic setup which took very little time to create, and is about as low-cost as you can get.

That’s all there is to it! 😎 This is all you need to get up-and-running with Playwright VRT for the low, low cost of _free_. And Playwright provides some exciting tools to iterate on this foundation to best meet your team’s needs.

### Sidenote: when local screenshots aren’t possible

Back to the problem mentioned earlier of creating/updating screenshots locally: <i>when does that fall apart?</i> You may need an alternate approach if:

- It isn’t possible for your CI environment to match your local machine
- The people that need to update screenshots use different OS
- You’re finding local screenshots are too flaky and/or too inconsistent between machines

The solution for all of the following is to **move screenshot creation into CI**. But this raises other questions, such as <i>When should this happen?</i> <i>Who has the authority to approve this?</i> <i>How can changes be tracked?</i>

The simplest solution is to <a href="https://docs.github.com/en/actions/managing-workflow-runs/manually-running-a-workflow" target="_blank" rel="noreferrer">create a manual workflow</a> that can be run from the GitHub UI inside each PR. You’ll have to make sure the action <a href="https://github.com/marketplace/actions/add-commit" target="_blank" rel="noreferrer">makes a commit</a> in the right place, and follows all guidelines you have in place. But there are dozens of other ways to solve this problem that will differ based on team and project needs.

There are also additional problems to solve by moving screenshot creation to CI, such as:

- The VRT tests now can’t be run locally
- The dev workflow now requires usage of an external website
- Diffs/regressions will be extremely annoying to look at
- The mechanism to update screenshots now has to be maintained

Solving all those problems will either take a decent investment or buying into one of the many paid VRT SaaS products that handles everything for you. At this point it’s up to you to decide what’s best. But arguably the best approach to using Playwright is the local screenshots/local testing approach outlined in the previous steps. So try to exhaust every option to make that possible before trying to generate screenshots in CI.

## Additional tips

- Sadly, dialing in tests to reduce flakiness is just part of VRT. Even paid VRT products struggle with this. Fortunately, you can set sensible defaults in your <a href="https://playwright.dev/docs/api/class-testconfig#test-config-expect" target="_blank" rel="noreferrer">global config</a> as well as using overrides in <a href="https://playwright.dev/docs/test-assertions#page-assertions-to-have-screenshot-2" target="_blank" rel="noreferrer">individual tests</a> (but worth noting that Playwright has pretty great defaults out-of-the-box that are neither too strict nor too lax).
- Allow for some margin of error with text antialiasing (⚠️ warning: trying to get perfect results <a href="https://github.com/microsoft/playwright/issues/7548#issuecomment-881897256" target="_blank" rel="noreferrer">is a rabbit hole</a>)
- `maxDiffPixels` and `maxDiffPixelRatio` can be hard to choose between. Whereas `maxDiffPixels` is great at catching precise regressions such as a thin border change, it also increases test flakiness by not dealing well with text antialiasing noise. Likewise, `maxDiffPixelRatio` is ideal for text-heavy screenshots, but it can sometimes be too loose when it comes to catching subtle pixel regressions for larger components/pages. Knowing when to use one over the other will take experimentation and distinguishing between the goals of what you’re trying to capture in your VRT.
- Screenshots have too much whitespace? Try the <a href="https://playwright.dev/docs/test-assertions#page-assertions-to-have-screenshot-2" target="_blank" rel="noreferrer">clip option</a>
- Add a <a href="https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/configuring-pull-request-merges/managing-suggestions-to-update-pull-request-branches" target="_blank" rel="noreferrer">suggestion to update branches</a> if possible. This helps eliminate the possibility of a VRT failure caused merging an out-of-date PR.
