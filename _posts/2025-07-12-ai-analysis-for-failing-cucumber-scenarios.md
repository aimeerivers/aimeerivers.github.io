---
layout: default
title: Using AI to Interpret Failing Cucumber Scenarios
description: How I used Gemini API to make E2E test failures more accessible and actionable
image: https://www.aimeerivers.com/assets/images/cucumber-ai/og-image.png
---

During Growth Hack Week at Hedia, while my colleagues were building exciting new features and exploring innovative product ideas, I decided to tackle a different kind of problem: making our E2E test failures more human-friendly and actionable.

## The Problem: Stack Traces Aren't For Everyone

When our Cucumber E2E tests fail in CI, we get detailed stack traces and error outputs that can be useful if you're familiar with the test setup. But here's the thing: not everyone on the team is great at interpreting these kind of technical failure reports.

A typical failure might look like this:

```
1) Scenario: A developer can create and delete an application # features/HIP/oauth2-app-management.feature:8
   ✔ Given a user is logged in to the developer website # file:/app/features/step_definitions/developer-service.steps.ts:35
   ✔ When they create an application # file:/app/features/step_definitions/developer-service.steps.ts:187
   ✖ And they add an OAuth2 client and a secret # file:/app/features/step_definitions/developer-service.steps.ts:193
       Error: function timed out, ensure the promise resolves within 15000 milliseconds
           at Timeout.<anonymous> (/app/node_modules/@cucumber/cucumber/lib/time.js:64:20)
           at listOnTimeout (node:internal/timers:588:17)
           at process.processTimers (node:internal/timers:523:7)
   - Then they should see the OAuth2 client id and 1 secret # file:/app/features/step_definitions/developer-service.steps.ts:202
       Attachment (text/plain): http://developer.hedia.test:6869/apps
       Attachment (image/png)

82 scenarios (1 failed, 81 passed)
```

What does this actually mean for the product? What should someone do about it? It's not immediately obvious.

## The Solution: AI-Powered Test Failure Analysis

I experimented with parsing our test failures and sending them to the Gemini API along with contextual information about our system. The goal was to get human-readable summaries and actionable next steps that anyone could understand.

Here's how it works:

1. **Parse the failure output** - Extract the scenario name, error message, and relevant stack trace
2. **Add context** - Include information about the platform and its microservices
3. **Send to Gemini** - Ask AI to interpret what went wrong and suggest next steps
4. **Format and share** - Post the AI analysis to our team Slack channel
5. **Enable team collaboration** - Everyone can quickly see what went wrong and contribute to the solution

## Example Output

Here's what Gemini produced for the stack trace mentioned above:

> **TLDR:** OAuth2 client creation timed out.
>
> **Analysis:** The test timed out while adding an OAuth2 client and secret, suggesting a problem with the OAuth2 Service or related infrastructure. The service might be slow, unresponsive, or the database connection might be failing.
>
> **Next Steps:**
>
> 1. **Check OAuth2 Service logs:** Investigate logs for errors or slow queries during the client creation process.
> 2. **Monitor service health:** Verify the health and resource utilization (CPU, memory) of the OAuth2 Service and its dependencies (e.g., database).
> 3. **Increase timeout:** Temporarily increase the timeout to see if the operation eventually succeeds, indicating a performance issue rather than a functional failure.

This is so much more meaningful than a raw stack trace. I was surprised at how well Gemini translated technical error messages into clear, actionable feedback.

## AI in the Right Place, Not Everywhere

One thing I want to emphasize: AI works best in small, well-defined, well-constrained places. This improvement added just a touch of AI to an existing workflow, in exactly the right spot to be most powerful and meaningful.

I don't think AI should be given free reign to do anything it wants. But little bits in the most useful places is where the magic happens.

In this case, we're not asking AI to write our tests, fix our code, or make product decisions. We're asking it to do one specific thing: translate technical error messages into human-readable explanations. It's a focused, bounded task that leverages AI's strength in language processing while keeping human expertise firmly in control of the important decisions.

## Making Testing Accessible to Everyone

This experiment ties into something I'm passionate about: making automated testing accessible and understandable to everyone on the team. Testing shouldn't be a black box that only engineers can peer into. When the whole team understands the impact of a failure, we can collaborate more effectively on solutions.

By posting these AI-analyzed results directly to our team Slack channel, we've created a shared space where everyone can see test failures in real-time and contribute their expertise.

## What's Next?

The AI analysis has already proven valuable — quite often we see the summary and immediately think, _"Oh yes, I know why that happened."_ I'm already exploring other ways to use AI in testing, such as analyzing flaky scenarios and suggesting how to fix them.

Have you experimented with AI to make your testing more accessible? I'd love to hear about your experiences and ideas for making automated testing truly serve the whole team.
