---
layout: default
title: Using Cucumber Custom Parameter Types in TypeScript
description: Using what I call the "shouldOrNot" pattern as an example
image: /assets/images/cucumber-custom-parameter-types/og-image.png
---

## Writing Flexible Step Definitions in Cucumber with TypeScript

Sometimes, when writing Cucumber step definitions, you want a single step to behave in opposite ways depending on the scenario. For example, you might want to check that a checkbox **should** be checked in one case, and **should not** be checked in another.

### Example Scenario

```gherkin
Feature: Login form

  Scenario: Toggling the "Remember me" checkbox
    Given I am on the login page
    When I toggle the "Remember me" checkbox
    Then the "Remember me" checkbox should be checked
    But the "Subscribe to newsletter" checkbox should not be checked
```

### Using a Regular Expression

The way i always used to achieve this was using a regular expression:

```typescript
Then(
  /^the "([^"]*)" checkbox (should|should not) be checked$/,
  async function (label: string, shouldOrNot: "should" | "should not") {
    const element = element(by.label(label));
    await expect(element).toExist();

    if (shouldOrNot === "should") {
      await expect(element).toHaveValue("checked");
    } else {
      await expect(element).not.toHaveValue("checked");
    }
  }
);
```

This works, but you miss out on the nice pattern matching of Cucumber expressions, and the regular expression can be hard to read and maintain.

### The Neater Way: Custom Parameter Types

Cucumber allows you to define custom parameter types, which can make your step definitions cleaner and more readable. Here’s how you can do it:

```typescript
import { defineParameterType } from "@cucumber/cucumber";

defineParameterType({
  name: "shouldOrNot",
  regexp: /should|should not/,
  transformer: (s: string) => s === "should",
});
```

Now you can write your step definition like this:

```typescript
Then("the {string} checkbox {shouldOrNot} be checked", async function (label: string, shouldBeChecked: boolean) {
  const element = element(by.label(label));
  await expect(element).toExist();

  if (shouldBeChecked) {
    await expect(element).toHaveValue("checked");
  } else {
    await expect(element).not.toHaveValue("checked");
  }
});
```

This approach makes your step definitions easier to read and maintain, and your scenarios more expressive.

---

To find out how to implement Cucumber custom parameter types in other languages, please see the [cucumber-expressions](https://github.com/cucumber/cucumber-expressions) documentation.

Have you used custom parameter types in your Cucumber tests? I'd love to hear about other patterns you've found useful.

_You can find me on [Mastodon](https://queer.party/@aimeerivers) or [LinkedIn](https://www.linkedin.com/in/aimeerivers/) if you'd like to continue the conversation._
