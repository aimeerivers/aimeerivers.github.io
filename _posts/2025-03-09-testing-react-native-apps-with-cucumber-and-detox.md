---
layout: default
title: Testing React-Native apps with Cucumber and Detox
description: A working guide as of March 2025
image: https://www.aimeerivers.com/assets/images/react-native-cucumber-detox/og-image.png
---

## Introduction

I am a test engineer with a strong focus on backend systems, APIs, and databases. For over a decade, my testing tool of choice has been Cucumber, thanks to its ability to express test scenarios in a language that anyone can understand and, if needed, repeat manually.

When I set out to write user-focused, end-to-end flow tests for a mobile app, I was determined to use Cucumber if possible. It quickly became clear that Detox was the right framework for driving mobile simulators, but it strongly favors Jest as its test runner.

Switching the test runner from `jest` to `cucumber-js` is possible, but the available documentation is often outdated or incomplete.

Here’s how I got Detox to play nicely with Cucumber and TypeScript.

## Versions

I quickly learned that versions matter, so let me state up front the versions I’m using:

- `cucumber` 11.2.0 - March 2025
- `detox` 20.34.4 - March 2025
- `detox-cli` 20.0.0 - November 2022
- `tsx` 4.19.3 - February 2025

## Install Dependencies

To get started, install the required development dependencies using either `yarn` or `npm`:

```bash
yarn add --dev @cucumber/cucumber detox tsx
```

or

```bash
npm install --save-dev @cucumber/cucumber detox tsx
```

You will also need `detox-cli` installed globally.

```bash
npm install --global detox-cli
```

## Initialize Detox

If you haven’t already initialized Detox, run:

```bash
detox init
```

You can skip this step if Detox is already set up in your project.

## Switch Detox Test Runner to use cucumber-js

By default, Detox assumes you’ll use `jest` as your test runner. To switch to `cucumber-js`, update the `.detoxrc.js` file. It should start like this:

`./.detoxrc.js`

```javascript
module.exports = {
  testRunner: {
    args: {
      $0: "cucumber-js",
      config: "e2e/cucumber.config.js",
    },
  },
  ...
```

## Update Detox App Configs

Detox builds and runs binary versions of your app for testing. If you haven’t set this up yet, now is the time to configure the `build` and `binaryPath` settings for your app.

If you’re unsure how to do this, refer to the [Detox Project Setup guide](https://wix.github.io/Detox/docs/introduction/project-setup).

## Build the App

Once your Detox configuration is set, build the app with:

```bash
detox build
```

This will generate a binary version of your app that Detox can use for testing.

## Replace the Detox Template Files

Detox likely generated some Jest-based test templates, which you won’t need. You can safely remove them. In my case, these were:

- `e2e/jest.config.js`
- `e2e/starter.test.js`

Instead, you’ll create a few files to configure Cucumber and bootstrap Detox.

### 1. Configure Cucumber

Create `e2e/cucumber.config.js` to tell Cucumber where to find your feature files and step definitions:

`e2e/cucumber.config.js`

```javascript
module.exports = {
  default: {
    format: ["progress"],
    requireModule: ["tsx/register"],
    require: [
      "./e2e/features/support/world.ts",
      "./e2e/features/support/hooks.ts",
      "./e2e/features/step_definitions/**/*.ts",
    ],
    paths: ["e2e/features/**/*.feature"],
  },
};
```

### 2. Define the Cucumber World

Cucumber uses a "World" to share context between steps. Set this up in `e2e/features/support/world.ts`:

`e2e/features/support/world.ts`

```typescript
import { setDefaultTimeout, setWorldConstructor, World } from "@cucumber/cucumber";

setDefaultTimeout(60 * 1000);

export class CustomWorld extends World {
  appLaunched = false;
}

setWorldConstructor(CustomWorld);
```

### 3. Set Up Hooks for Detox Lifecycle

Now, create `e2e/features/support/hooks.ts` to handle Detox initialization, app launch, and cleanup:

`e2e/features/support/hooks.ts`

```typescript
import { AfterAll, Before, BeforeAll } from "@cucumber/cucumber";
import { device } from "detox";
import { cleanup, init } from "detox/internals";

BeforeAll({ timeout: 30 * 1000 }, async () => {
  await init();
});

Before({ timeout: 30 * 1000 }, async () => {
  await device.launchApp({ delete: true, newInstance: true });
});

AfterAll({ timeout: 30 * 1000 }, async () => {
  await cleanup();
});
```

## Write Cucumber features and step definitions

You'll write feature files in Gherkin syntax, and step definitions in TypeScript, making use of Detox. Here's a simple idea to get you started.

`e2e/features/Greeting.feature`

```gherkin
Feature: Greeting

  Scenario: User enters their name and sees a greeting
    Given the app is launched
    When the user enters their name "chunky tofu"
    Then they should see the greeting "Hello, chunky tofu!"
```

`e2e/features/step_definitions/greeting.ts`

```typescript
import { Given, Then, When } from "@cucumber/cucumber";
import { by, device, element, expect, waitFor } from "detox";

import { CustomWorld } from "../support/world";

Given("the app is launched", async function (this: CustomWorld) {
  await waitFor(element(by.text("Welcome")))
    .toBeVisible()
    .withTimeout(1000);
  this.appLaunched = true;
});

When("the user enters their name {string}", async function (this: CustomWorld, name: string) {
  await element(by.id("nameInput")).typeText(name);
  await element(by.id("submitButton")).tap();
});

Then("they should see the greeting {string}", async function (this: CustomWorld, expectedGreeting: string) {
  await expect(element(by.text(expectedGreeting))).toBeVisible();
});
```

## Run Your Tests!

You are now ready to begin running your Cucumber scenarios through Detox.

```bash
detox test
```

Or, if you want to specify a particular configuration:

```bash
detox test --configuration "ios.sim.staging"
```

This should launch an iOS simulator, load your app, and start running your Cucumber scenarios.

If you encounter issues with `tsx/register`, you can work around them by running Detox with this command:

```bash
NODE_OPTIONS="--import tsx" detox test
```

## Credit and appreciation

Thanks to the following people for their help:

- [Jaydon Peters](https://medium.com/@peters.jaydon) for the post [React Native, Detox, and Cucumber](https://medium.com/@peters.jaydon/react-native-detox-and-cucumber-c2164a6eebd5) which, while now outdated, gave me the hope that this could be done.
- [Chris Rosendorf](https://github.com/ExoMemphiz) for a lot of help figuring out the `tsx` things and wrangling the Detox internals. This would never have happened without all your help!
- [ChatGPT, powered by OpenAI](https://openai.com/) for providing helpful suggestions, tips, and guidance throughout the process.

Any questions? Feedback? Find me on Mastodon: [@aimeerivers@queer.party](https://queer.party/@aimeerivers)
