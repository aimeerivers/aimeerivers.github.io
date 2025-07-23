---
layout: default
title: "Xray + Cucumber: Better Than You Think"
description: Moving your Cucumber scenarios into Jira makes automated testing accessible to everyone on your team
image: /assets/images/xray-cucumber/og-image.png
---

# How Xray + Cucumber Transformed My Team's Testing

For years, i've been passionate about making automated testing accessible to everyone. Cucumber has always been a huge part of that mission: it puts testing into plain English, creates beautifully readable reports, and (thanks to some [AI analysis](/2025/07/12/ai-analysis-for-failing-cucumber-scenarios/) work i've done recently) can even make test failures more understandable. I love seeing automated test results displayed prominently on dashboards where the whole team can see them.

But there was always one missing piece that frustrated me: **the ability for anyone to write a new test and schedule it for execution**.

When your test scenarios live in a code repository, you need a text editor, knowledge of Git, and familiarity with pull requests just to try out a new test. In practice, this meant i was the only one writing Cucumber scenarios.

_Note: This blog post assumes you're using Jira and Xray Cloud, and have some sort of CI setup (GitHub Actions, Jenkins, Travis CI, etc)._

## The Bold Move: Put Your Scenarios in Jira

Here's the thing about Xray and Cucumber that most people don't realise: _they work extremely well together_, but only if you're willing to make a bold architectural decision. You have to move your test scenarios out of your code repository and into Jira.

To be clear: i'm only talking about moving Gherkin `.feature` files. Your step definitions, page objects, test utilities, and all other supporting code stay exactly where they are in your repository. These count as code, and are always version-controlled and code-reviewed. But the mind-shift is realising that test scenarios are not code. They are _documentation_, which happens to be testable.

When you move test scenarios into Jira using Xray, suddenly anyone on your team can:

- easily edit an existing scenario
- write a completely new scenario
- create a Test Plan for a feature
- create a Test Execution (choosing iOS, Android, or whatever platforms you support)
- send it to run on CI _with the press of a button_

No Git knowledge required. No pull requests. No waiting for code reviews. Just write your test scenario in plain English and run it.

![Screenshot showing Xray Test Repository interface with a list of Cucumber scenarios](/assets/images/xray-cucumber/xray-test-list.png)

<p align="center"><em>Xray Test Repository showing Cucumber scenarios as individual Tests, grouped into Test Sets</em></p>

## How It Works

Let me walk you through how i set this up. It's not as difficult as you might imagine.

### Step 1: Get Your Tests Running Normally First

Start with your Cucumber scenarios running on CI in the traditional way, reading `.feature` files from your code repository. Make sure this is solid before you add any Xray integration.

### Step 2: Import Your Scenarios to Xray

Once your test scenarios are running reliably, import them into Xray. Each Cucumber scenario becomes an individual Test in Xray. You can use Xray Preconditions to share common setup steps between tests.

![Screenshot of Xray Test showing a Cucumber scenario with Gherkin syntax](/assets/images/xray-cucumber/xray-test-detail.png)

<p align="center"><em>Individual Test in Xray showing a Cucumber scenario with Gherkin syntax</em></p>

### Step 3: Add Jira Automation for CI Triggers

This is where the magic happens. Set up a Jira automation to trigger your CI system with the Test Execution key. You could automate this to happen when the Test Execution is created, or when it enters a specific state, but i wanted it to be an intentional action, so i added a button.

![Screenshot of Jira Automation for triggering CI](/assets/images/xray-cucumber/jira-automation-trigger-ci.png)

<p align="center"><em>Jira Automation that triggers CI to run</em></p>

Your CI will need to know the Test Execution key, and potentially the platform that it should run the tests on:

```json
{
  "test_execution_key": "HDAST-73",
  "platform": "iOS"
}
```

### Step 4: CI Downloads Scenarios from Xray

Given the Test Execution key, your CI workflow now needs to authenticate with Xray using a Client ID and Client Secret, download the relevant test scenarios and unzip them into your features folder.

In GitHub Actions that looks like this:

```yaml
- name: Fetch test scenarios from Xray
  run: |
    XRAY_TOKEN=$(curl -H "Content-Type: application/json" \
      -X POST \
      --data '{ "client_id": "${XRAY_CLIENT_ID}", "client_secret": "${XRAY_CLIENT_SECRET}" }' \
      https://xray.cloud.getxray.app/api/v2/authenticate | jq -r '.')

    curl -H "Content-Type: application/json" \
      -X GET \
      -H "Authorization: Bearer ${XRAY_TOKEN}" \
      "https://xray.cloud.getxray.app/api/v2/export/cucumber?keys=${TEST_EXECUTION_KEY}" \
      --output xray_scenarios.zip;

    unzip -o xray_scenarios.zip -d e2e/features
```

Now that your CI has the features it needs, Cucumber can run as normal.

![Test Execution running on CI](/assets/images/xray-cucumber/testing-in-progress.jpg)

<p align="center"><em>Test Execution running on CI</em></p>

### Step 5: Post Results Back to Xray

After running all the scenarios, your CI should post the results back to Xray so that Test Execution status gets updated automatically. This is really easy - just send the `cucumber.json` file and Xray figures it all out.

```yaml
- name: Send test results to Xray
  if: always()
  run: |
    curl -X POST \
      -H "Authorization: Bearer ${XRAY_TOKEN}" \
      -H "Content-Type: application/json" \
      --data-binary "@e2e/reports/cucumber.json" \
      https://xray.cloud.getxray.app/api/v2/import/execution/cucumber
```

Xray updates the Test Execution to show the results from CI.

![Screenshot showing Test Execution results in Xray with pass/fail status](/assets/images/xray-cucumber/test-execution-results.png)

<p align="center"><em>Test Execution in Xray showing results imported from CI</em></p>

Test failures are now automatically documented in Xray. Any screenshots that were taken are also imported to Xray and attached as evidence.

![Screenshot showing exactly where a test scenario failed](/assets/images/xray-cucumber/test-execution-failure.png)

<p align="center"><em>You can see exactly where the test scenario failed, and why</em></p>

Retesting failed scenarios is simple: Xray helps you to set up a new Test Execution, just with the failing scenarios.

## The Real Benefits

### 1: Traceability Like You've Never Seen Before

This setup gives you incredible traceability for test results. Every test run is linked to a specific Test Execution, which is linked to a Test Plan, which can be linked to Epics, Stories, or Requirements. You can see exactly what was tested, when, on which platform, and why.

For a company like [Hedia](https://www.hedia.com/), building highly regulated medical software, this is perfect. We're documenting automated testing in exactly the same way as manual testing, with the same audit trail and approval processes.

### 2: Easy Test Creation

Suddenly your Product Owners can write acceptance criteria as Cucumber scenarios and immediately test them. Your QA team can create regression test suites without touching code. Your Support team can write scenarios to reproduce customer issues and verify fixes.

### 3: Better Collaboration

When test scenarios live in Jira, they become part of your regular workflow. Product requirements link directly to acceptance tests. Bug reports can reference specific failing scenarios. Test coverage becomes visible to stakeholders who might never look at a code repository.

## The Learning Curve

I'll be honest - there is a bit of a learning curve here. Your team will need to understand how Test Plans and Test Executions work in Xray. You'll need to establish conventions for how scenarios are written and organised. And yes, you'll lose some of the benefits of having tests version-controlled alongside your code.

But i think the trade-off is worth it. When i made this change, test scenario creation suddenly became something the whole team could contribute to. Team members were setting up tests just to try it out - because it was so _easy_. That had never happened before!

## Questions

### Can we still run tests locally?

Yes! You don't lose the ability to run tests on your own machine. You just have to download the `.feature` files from Xray, exactly as the CI does.

### How do step definitions stay in sync with test scenarios?

Your step definitions are your source of truth for how steps are implemented. Xray automatically imports step definitions and auto-suggests when writing test scenarios. If someone writes a test scenario that requires a new step, you'll need to add the corresponding step definition in your repo, just like you would if the scenario were committed to the codebase.

### What if we want to version control scenarios too?

Xray automatically keeps a version history of each Test, so you can see who changed what and when. And if necessary, you can always export scenarios from Xray back to your repo.

### Can we mix Jira scenarios with repo scenarios?

You can, but i don't recommend it. Keeping your scenarios in one place (Jira) and your step definitions in another (your repo) keeps things clear and avoids confusion about which scenarios are the "real" ones.

## Final Thoughts

Xray and Cucumber really are better together than you might think. But you have to be willing to challenge the assumption that everything test-related must live in your code repository.

Sometimes the most powerful architectural decisions are the ones that feel a bit uncomfortable at first. Moving scenarios into Jira was one of those decisions for me, and it's transformed how my teams approach testing.

Have you tried integrating Xray with your Cucumber scenarios? I'd love to hear about your experiences, especially if you've found other creative ways to make automated testing more accessible to your whole team.

---

_This post is part of an ongoing series about making automated testing more accessible. You might also enjoy these previous posts:_

- _[AI analysis for failing Cucumber scenarios](/2025/07/12/ai-analysis-for-failing-cucumber-scenarios.html)_
- _[Testing React Native apps with Cucumber and Detox](/2025/03/09/testing-react-native-apps-with-cucumber-and-detox.html)_
- _[Building testing dashboards](/2021/08/15/building-a-raspberry-pi-dashboard.html)_

Any questions? Feedback? Find me on Mastodon: [@aimeerivers@queer.party](https://queer.party/@aimeerivers) or LinkedIn: [aimeerivers](https://www.linkedin.com/in/aimeerivers/)
