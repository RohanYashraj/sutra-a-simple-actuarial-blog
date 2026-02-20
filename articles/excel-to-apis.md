---
title: "From Excel to APIs: The Quiet Evolution of Actuarial Work"
category: "Actuarial"
date: "11-01-2026"
author: "Rohan Yashraj Gupta"
authorImage: "/authors/author-rohan.jpg"
description: "Explore the quiet evolution of actuarial work from Excel spreadsheets to modern API-driven platforms. Discover how speed, integration, and governance are reshaping the profession."
---

For decades, Excel was actuarial work.

Pricing models lived in workbooks. Reserves were calculated in linked tabs. Experience studies ran on pivot tables. The actuary who could build a clean, auditable spreadsheet was trusted. The one who could debug circular references was respected.

This wasn't laziness. Excel worked. It was flexible, transparent, and didn't require a development team to make a change.

But something shifted.

Not overnight. Not loudly.

Actuarial work is now splitting into two worlds: those still living entirely in Excel, and those calling APIs to get reserve estimates, pulling pricing factors from rating engines, and feeding data into platforms they didn't build.

This isn't about being modern. It's about where the work actually happens now.

## Excel Was Never Just a Calculator

Excel became the actuarial standard because it matched how actuaries think.

You could see the logic. Every cell was inspectable. Formulas were portable. Models could be handed off without installing software or configuring servers.

For reserving, you'd pull claims data, summarize it by development period, apply loss development factors, and calculate ultimates. All visible. All in one place.

For pricing, you'd layer in exposure assumptions, trend historical losses, adjust for policy features, and model profitability under different scenarios.

Excel let you think step by step, in rows and columns.

But it came with costs:

- **Version hell** – Emailing workbooks around creates forks. Which file has the latest assumptions?
- **Audit nightmares** – Try tracing a formula through 15 linked tabs with hidden sheets.
- **Scale problems** – Run a Monte Carlo simulation on a million policies and watch Excel freeze.
- **Collaboration limits** – Only one person can edit at a time. Merging changes is manual.

These weren't dealbreakers when models were small and teams were local.

They became dealbreakers when companies needed real-time pricing, automated reserving pipelines, and integration with claims systems.

## Platforms Enter the Picture

Insurance companies started centralizing logic.

Instead of every actuary maintaining their own reserve workbook, reserve calculations moved into **platforms**. Actuaries input assumptions. The platform runs the model. Results feed into financial systems automatically.

Pricing followed.

**Rating engines** took over premium calculations. Instead of maintaining Excel raters with nested IF statements and VLOOKUP chains, underwriters now submit risk characteristics to an API. The rating engine applies rules, loads factors from a database, and returns a premium.

The actuary's role changed.

You're no longer running the calculation every time. You're:

- Defining the logic that the platform executes
- Monitoring outputs for reasonableness
- Updating assumptions when experience changes
- Ensuring the platform reflects regulatory requirements

The shift is subtle but real.

You used to **own the calculation**.

Now you **define the rules** someone else's system executes.

## Why This Shift Happened

Three forces pushed actuarial work out of Excel:

### 1. Speed Requirements

Pricing used to happen over days. Underwriters requested quotes. Actuaries ran models. Quotes went out.

Now pricing happens in seconds. A customer fills out a web form. The system needs a quote immediately. There's no time for an actuary to open Excel.

Rating engines make this possible. They're always running. Always available. Always fast.

### 2. Integration Demands

Insurance companies don't run on spreadsheets alone.

Policy administration systems manage contracts. Claims systems track losses. Financial systems need reserves. Regulatory systems need reports.

Excel doesn't talk to these systems natively. You export CSVs, copy-paste data, and pray nothing breaks.

Platforms integrate directly. Reserves calculated in one system flow into financial reporting without manual steps. Pricing logic updates propagate to all connected systems automatically.

### 3. Governance and Control

Who changed the formula in cell M47? When? Why?

Excel makes this hard to track. You can lock cells, protect sheets, require passwords. But version control is still manual.

Platforms have audit logs. Change management workflows. Role-based permissions. When a pricing factor changes, you know who changed it, when, and what the business justification was.

This matters for SOX compliance, regulatory exams, and internal audits.

## What APIs Mean for Actuaries

An API is just a way for systems to talk to each other.

Instead of logging into a platform and clicking buttons, you send a structured request. The platform processes it and sends back a structured response.

**Example: Reserve API**

You send:

```json
{
  "valuation_date": "2024-12-31",
  "line_of_business": "auto",
  "loss_data": [...],
  "assumptions": {
    "tail_factor": 1.03,
    "expense_ratio": 0.15
  }
}
```

You get back:

```json
{
  "case_reserves": 5000000,
  "ibnr": 1200000,
  "total_reserves": 6200000
}
```

No Excel file. No manual calculation. Just inputs and outputs.

This changes how actuaries work:

- You need to understand what the API expects (data formats, required fields)
- You need to know how to send requests (often using Python, R, or another language)
- You need to validate outputs, because you're not seeing the intermediate steps

You're trusting the platform more. Inspecting it less.

## The New Actuarial Skillset

Excel skills aren't obsolete. You still need to:

- Validate results
- Build quick models for exploration
- Summarize experience studies

But they're no longer sufficient.

Actuaries now need to:

### Read Documentation

Platform documentation explains endpoints, parameters, and response structures. If you can't read API docs, you can't use modern actuarial tools effectively.

### Write Code

Not necessarily full software development. But enough to:

- Call an API using Python or R
- Parse JSON responses
- Automate repetitive tasks
- Validate outputs programmatically

### Understand Data Pipelines

Where does the data come from before it hits the platform? How is it transformed? Where do results go afterward?

Actuarial work now sits inside larger workflows. You need to see the full pipeline, not just your calculation.

### Think in Assumptions, Not Formulas

In Excel, you wrote the formula. The logic was yours.

With platforms, you configure assumptions. The platform applies them.

This requires clarity about **what you're assuming** and **how the platform will use it**.

If you set a tail factor to 1.05, does the platform apply it multiplicatively? Additively? To paid losses or incurred losses?

You need to know.

## What Gets Lost

Transparency takes a hit.

In Excel, you could trace every calculation. Click on a cell, see the formula, check the inputs.

With platforms, the logic is hidden. You see inputs and outputs. The middle is a black box.

This isn't always bad. If the platform is well-tested and well-documented, you don't need to see every step.

But it requires trust.

And trust requires validation. You need to:

- Run parallel calculations in Excel for spot checks
- Compare platform outputs to expected results
- Understand edge cases where the platform might behave unexpectedly

## Practical Example: Building a Pricing Rater

**Old world (Excel):**

1. Maintain a workbook with base rates by coverage and territory
2. Add tabs for each rating variable (age, vehicle type, credit score)
3. Build nested formulas to combine factors
4. Send the workbook to underwriting
5. Hope they don't break it

**New world (Rating Engine + API):**

1. Define base rates in a database
2. Define rating variables as lookup tables
3. Configure business rules in the rating engine
4. Expose an API endpoint
5. Underwriting systems call the API for quotes

When you need to update rates, you update the database. The API uses the new rates automatically. No workbook redistribution. No version confusion.

## How to Adapt

If you're still primarily in Excel:

**Start small.**

Pick one repetitive task. Automate it with Python or R. Maybe it's pulling data from a database. Maybe it's generating a standard report.

Get comfortable with code, even if it's messy at first.

**Learn one platform deeply.**

Pick a reserving platform, pricing engine, or modeling tool your company uses. Read the documentation. Experiment. Break things in a test environment.

Understanding one platform makes learning others easier.

**Ask better questions.**

When IT says they're building an API, ask:

- What data does it need?
- What does it return?
- How do we validate outputs?
- What happens if inputs are missing or malformed?

These questions help you understand how the platform will behave in production.

## The Shift Isn't Optional

Excel will remain useful. For exploratory work, for ad hoc analysis, for small models.

But the core work—pricing, reserving, capital modeling—is moving into platforms.

Not because Excel is bad.

Because modern insurance operations demand speed, integration, and governance that Excel can't provide alone.

The actuary who adapts isn't the one who abandons spreadsheets entirely.

It's the one who knows when to use Excel for exploration, and when to trust a platform for execution.

The quiet evolution is already here.

The question is whether you're evolving with it.
