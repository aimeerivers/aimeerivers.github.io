---
layout: default
title: "Data tables with cucumber-js"
description: "How to use Cucumber data tables with Javascript/Typescript"
---

For years i have been using Cucumber with Ruby, but i've recently changed job and now i am using Javascript/Typescript.

This is a reference for me on how to use the different data table formats with cucumber-js.

<br>

---

# Typescript implementation

Imagine there is a `createUser` function that takes `name`, `email`, `city` and `dob` as parameters. I'm just going to `console.log()` the information so we can understand what's happening, but in reality this would likely do something more interesting.

```typescript
function createUser(name: string, email: string, city: string, dob: string) {
  console.log(`Creating ${name} (${email}) who lives in ${city} and was born ${dob}.`);
  // actual implementation not included
}
```

<br>

---


# Option 1. Key-value pairs using .rowsHash()

This is a 2-column table format where the left is the key and the right is the value. I like to write the keys in uppercase for readability, but it's not necessary.

This scenario will create 1 user.

```cucumber
  Scenario: Key-value pairs using .rowsHash()
    Given the following user exists
      | NAME  | Ganesh Raffaella |
      | EMAIL | gr@example.com   |
      | CITY  | Redlands         |
      | DOB   | 1965-03-30       |
```

This step can be implemented like this:

```typescript
Given('the following user exists', function (dataTable) {
  const data = dataTable.rowsHash();
  createUser(data["NAME"], data["EMAIL"], data["CITY"], data["DOB"]);
});
```

Output:

```
  Scenario: Key-value pairs using .rowsHash()
    Given the following user exists
      │ NAME  │ Ganesh Raffaella │
      │ EMAIL │ gr@example.com   │
      │ CITY  │ Redlands         │
      │ DOB   │ 1965-03-30       │
Creating Ganesh Raffaella (gr@example.com) who lives in Redlands and was born 1965-03-30.
```

<br>

---


# Option 2. Table with headings using .hashes()

This is a multi-row format where the first row is a heading. The step definition will need to loop through the rows.

This scenario will create 3 users.

```cucumber
  Scenario: Table with headings using .hashes()
    Given the following users exist
      | NAME              | EMAIL          | CITY      | DOB        |
      | Lauriane Mosciski | lm@example.com | Bismarck  | 1954-04-10 |
      | Valentin Schultz  | vs@example.com | Lynchburg | 1950-01-01 |
      | Shea Ziemann      | sz@example.com | Medford   | 1982-06-19 |
```

This step can be implemented like this:

```typescript
Given('the following users exist', function (dataTable) {
  const data = dataTable.hashes();
  for (const row of data) {
    createUser(row["NAME"], row["EMAIL"], row["CITY"], row["DOB"]);
  }
});
```

Output:

```
  Scenario: Table with headings using .hashes()
    Given the following users exist
      │ NAME              │ EMAIL          │ CITY      │ DOB        │
      │ Lauriane Mosciski │ lm@example.com │ Bismarck  │ 1954-04-10 │
      │ Valentin Schultz  │ vs@example.com │ Lynchburg │ 1950-01-01 │
      │ Shea Ziemann      │ sz@example.com │ Medford   │ 1982-06-19 │
Creating Lauriane Mosciski (lm@example.com) who lives in Bismarck and was born 1954-04-10.
Creating Valentin Schultz (vs@example.com) who lives in Lynchburg and was born 1950-01-01.
Creating Shea Ziemann (sz@example.com) who lives in Medford and was born 1982-06-19.
```

<br>

---


# Option 3. Table without headings using .raw()

You can also use a table without headings and access the raw data with indices. I don't like this because it seems less clear, but i'm just documenting it as an option in case it's useful for some reason.

This scenario will create 4 users.

```cucumber
  Scenario: Table without headings using .raw()
    Given the following users exist
      | Elza Kiehn    | ek@example.com | Garden Grove | 1927-10-11 |
      | Delores Kulas | dk@example.com | Euless       | 1948-11-23 |
      | Gerard Marks  | gm@example.com | Carlsbad     | 1942-07-03 |
      | Hilda White   | hw@example.com | Owensboro    | 1933-02-19 |
```

The step can be implemented like this:

```typescript
Given('the following users exist', function (dataTable) {
  const data = dataTable.raw();
  for (const row of data) {
    createUser(row[0], row[1], row[2], row[3]);
  }
});
```

Output:

```
  Scenario: Table without headings using .raw()
    Given the following users exist
      │ Elza Kiehn    │ ek@example.com │ Garden Grove │ 1927-10-11 │
      │ Delores Kulas │ dk@example.com │ Euless       │ 1948-11-23 │
      │ Gerard Marks  │ gm@example.com │ Carlsbad     │ 1942-07-03 │
      │ Hilda White   │ hw@example.com │ Owensboro    │ 1933-02-19 │
Creating Elza Kiehn (ek@example.com) who lives in Garden Grove and was born 1927-10-11.
Creating Delores Kulas (dk@example.com) who lives in Euless and was born 1948-11-23.
Creating Gerard Marks (gm@example.com) who lives in Carlsbad and was born 1942-07-03.
Creating Hilda White (hw@example.com) who lives in Owensboro and was born 1933-02-19.
```

<br>

---

# Bonus option: Scenario Outline

It's also possible to use a Scenario Outline which is not a table step at all but sends example values using a table format.

In this example, the whole scenario will run for each row in the examples table.

This will create 2 users.

```cucumber
  Scenario Outline: Create <NAME>
    Given a user called "<NAME>"  with email address "<EMAIL>" who lives in "<CITY>" and was born "<DOB>"

    Examples: 
      | NAME            | EMAIL          | CITY          | DOB        |
      | Vivienne Senger | vs@example.com | Everett       | 1965-11-09 |
      | Mallory Wisoky  | mw@example.com | Boynton Beach | 1927-12-09 |
```

The step can be implemented like this:

```typescript
Given('a user called {string}  with email address {string} who lives in {string} and was born {string}', function (name, email, city, dob) {
  createUser(name, email, city, dob);
});
```

Output:

```
  Scenario Outline: Create Vivienne Senger
    Given a user called "Vivienne Senger"  with email address "vs@example.com" who lives in "Everett" and was born "1965-11-09"
Creating Vivienne Senger (vs@example.com) who lives in Everett and was born 1965-11-09.

  Scenario Outline: Create Mallory Wisoky
    Given a user called "Mallory Wisoky"  with email address "mw@example.com" who lives in "Boynton Beach" and was born "1927-12-09"
Creating Mallory Wisoky (mw@example.com) who lives in Boynton Beach and was born 1927-12-09.
```

<br>

---

Any questions? Find me on Mastodon: [@aimeerivers@queer.party](https://queer.party/@aimeerivers)
