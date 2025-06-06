---
layout: default
title: It's always been Cucumber
description: How Cucumber/Gherkin has remained my constant companion through years of changing tech stacks in software testing
image: https://www.aimeerivers.com/assets/images/cucumber/og-image.jpg
---

As a software tester, i've watched my tech stack evolve dramatically over the years. Languages have changed, frameworks have been replaced, and entire philosophies around testing have shifted. But through all of this transformation, there's been one constant companion that has never let me down: Cucumber.

Let me take you on a journey through my testing evolution.

## The Great Tech Stack Migration

When i first started serious testing automation, my world looked very different:

* At first i wrote almost everything in Ruby; now i prefer TypeScript.
* Ruby Gems gave way to NPM packages.
* Selenium's sometimes-flaky browser automation was replaced by Playwright's more reliable approach.
* For mobile testing, Appium has been superseded by Detox, which i find to be much more powerful and useful.
* My CI/CD journey went from Jenkins to CircleCI and later to GitHub Actions.

But through every single one of these changes, one thing remained exactly the same:

```gherkin
Given these initial conditions
When an action is taken
Then this should be the result
```

## Why Cucumber Endures

There's something beautifully simple about the **Given** - **When** - **Then** structure that transcends whatever technology is running underneath. It maps perfectly to how humans naturally think about testing.

This isn't just useful for me as the person writing the tests. The real magic happens when these scenarios become a shared language across the entire team.

## The Universal Language of Testing

**For developers:** Cucumber scenarios challenge assumptions. i love the word *"should"* because it invites a challenge: *"should it really?"*

**For other testers:** These scenarios are perfect documentation for manual testing. If automation breaks, anyone can pick up a Cucumber feature file and understand exactly how to repeat the test manually.

**For product owners:** Finally, readable documentation of what the software actually does! Instead of diving into code or trying to interpret unit test names, they can read scenarios that make sense in plain English.

**For stakeholders:** When you're trying to prove that your software is doing what you promised it would do, there's nothing quite like a green Cucumber report listing every scenario that was tested.

## Encoding Thought Processes

But perhaps most importantly for me personally, Cucumber scenarios capture my thought process when i test something manually. When i'm exploring a new feature, i naturally think in terms of:

*"Okay, so if i set up this situation... and then i do this action... i would expect this result."*

Writing that down as a Cucumber scenario means i can run that exact same thought process again and again, automatically, without doing all the thinking again.

## The Constant in a Sea of Change

The testing landscape continues to evolve rapidly. AI is starting to generate tests, visual testing tools are becoming more sophisticated, and new frameworks appear constantly. But i suspect that even as AI starts writing more of our test code, we'll still need that human-readable layer that explains *what* we're testing and *why*.

Programming languages will continue to rise and fall in popularity. Testing frameworks will be superseded by newer, better alternatives. But the fundamental need to express testing scenarios in a way that both humans and computers can understand? That's not going anywhere.

It turns out programming in English has always been the hot new thing!

## Looking Forward

As i write this in 2025, i'm confident that my tech stack will continue to evolve. There will be new languages to learn, new tools to master, and new approaches to discover. But i'm equally confident that somewhere in my test suite, there will still be files that start with:

```gherkin
Feature: Something important that stakeholders care about
```

And in an ever-changing field, something constant like that feels really reassuring.
