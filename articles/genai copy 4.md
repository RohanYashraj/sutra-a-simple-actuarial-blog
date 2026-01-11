---
title: "How Actuaries Should Work With GenAI"
category: "GenAI for Actuaries"
date: "15-01-2026"
author: "Rohan Yashraj Gupta"
authorImage: "/authors/author-rohan.jpg"
description: "Explore the quiet evolution of actuarial work from Excel spreadsheets to modern API-driven platforms. Discover how speed, integration, and governance are reshaping the profession."
---

You wouldn't accept spreadsheet output without checking formulas.

Don't accept GenAI output without verification either.

---

## Ask, Verify, Refine

This is the only workflow that matters.

**Ask:** Give GenAI a clear task

"Draft an email explaining why we're increasing rates on commercial auto by 8%."

**Verify:** Check every factual claim

* Is the rate increase actually 8%?
* Did you cite the right loss ratio?
* Are the effective dates correct?
* Does the tone match your company's communication style?

**Refine:** Edit the output until it's yours

Remove generic language.

Add specific context.

Adjust technical depth for your audience.

Sign your name to it only when you would have written it yourself.

---

## Never Accept Raw Output

Raw GenAI output always has problems.

Sometimes small.

Sometimes catastrophic.

**Small problems:**

* Generic phrasing that doesn't match your voice
* Technically correct but contextually wrong
* Missing caveats specific to your situation

**Catastrophic problems:**

* Fabricated citations
* Incorrect calculations presented as fact
* Logical gaps covered by confident language

You won't catch catastrophic problems by skimming.

You catch them by verifying every claim that matters.

---

## Treat It Like a Junior Analyst

Imagine you hired someone smart but inexperienced.

They've read all the textbooks.

They haven't worked on your company's data.

You'd assign them to:

* Draft standard documents
* Summarize routine analyses
* Format data for presentations

You wouldn't ask them to:

* Make final pricing decisions
* Choose reserve methodologies
* Explain unique aspects of your portfolio

That's exactly how to use GenAI.

**What you'd tell a junior analyst:**

"Take these loss triangles and draft the reserve summary section. I'll review the development factors you chose and make sure the ultimates look reasonable."

**What you'd tell GenAI:**

"Here are the reserve estimates by line of business. Draft three paragraphs explaining the year-over-year changes. I'll verify the numbers and adjust the explanations."

Same supervision model.

Same verification requirements.

---

## The Verification Checklist

Before using any GenAI output:

**For numbers:**

- [ ] Did I independently verify every calculation?
- [ ] Are the figures sourced from my own data?
- [ ] Would I stake my credentialing on these numbers?

**For assumptions:**

- [ ] Is this assumption appropriate for my specific context?
- [ ] Have I documented why this assumption makes sense?
- [ ] Can I defend this assumption to a regulator or peer reviewer?

**For explanations:**

- [ ] Is this explanation accurate for my company's situation?
- [ ] Have I removed generic language that doesn't apply?
- [ ] Would a colleague recognize this as my work?

If you can't check all the boxes, keep refining.

---

## Concrete Example: Reserve Memo

You need to draft a reserve adequacy memo.

**Ask:**

"Draft an executive summary for a reserve analysis showing $2.3M favorable development in workers compensation and $1.1M adverse development in general liability."

**Verify:**

Check that:

* Development amounts match your actual results
* Any mentioned drivers (claim counts, severity) are accurate
* No fabricated statistics appear
* Reserve adequacy conclusion aligns with your analysis

**Refine:**

* Replace "industry trends suggest" with your actual experience
* Add specific context about known large claims
* Adjust tone to match previous memos
* Include required regulatory language

**Before/After:**

**GenAI Draft:**
"Our reserve analysis indicates overall adequacy with mixed development patterns across lines of business. Workers compensation showed favorable emergence driven by lower than expected severity, while general liability experienced adverse development primarily due to higher claim frequencies in recent accident years."

**Your Final Version:**
"Reserves remain adequate at $23.4M, representing 105% of actuarial best estimate. Workers compensation released $2.3M due to faster claim closures in the 2023 accident year. General liability added $1.1M, driven by three severity claims in products liability, two of which are still in litigation."

The structure came from GenAI.

The content came from you.

---

## When to Not Use GenAI

Some tasks don't benefit from GenAI at all:

* Building experience triangles
* Selecting development factors
* Applying credibility weighting
* Documenting unusual case reserves
* Explaining one-off exceptions

These require your judgment from the start.

GenAI can't draft something when there's no pattern to follow.

---

## The Iron Rule

If you can't verify it, don't use it.

If you wouldn't show it to a peer without caveats, revise it.

If you couldn't defend it under questioning, rewrite it.

GenAI is a starting point.

Never an endpoint.

---

Think of GenAI as autocomplete with excellent vocabulary.

It will suggest the next sentence.

You decide if that sentence is true.

---

# The One Mental Model Actuaries Need for GenAI

Actuarial work has always had three layers.

GenAI fits into exactly one of them.

---

## Layer 1: The Language Layer

This is where you communicate.

Draft emails.

Write reports.

Explain technical concepts.

Summarize findings.

Respond to questions.

**GenAI lives here.**

It's exceptional at taking technical content and expressing it clearly.

It drafts the first version of almost anything you need to write.

It translates between technical and non-technical language.

It handles the repetitive communication tasks that consume hours of your week.

---

## Layer 2: The Model Layer

This is where you analyze.

Build GLMs.

Run chain ladder.

Apply credibility methods.

Calculate present values.

Fit survival curves.

**GenAI doesn't live here.**

It can't build models.

It can't run methods.

It can't perform calculations.

It can describe what happens in this layer, but it can't do the work.

Your pricing models, reserve analyses, and valuation calculations remain unchanged.

GenAI doesn't replace them.

It doesn't augment them.

It sits above them, in a completely different layer.

---

## Layer 3: The Judgment Layer

This is where you decide.

Choose assumptions.

Interpret edge cases.

Balance competing objectives.

Accept or reject model output.

Recommend action.

**GenAI definitely doesn't live here.**

Judgment requires:

* Understanding context
* Weighing tradeoffs
* Accepting accountability

GenAI has none of these.

It can articulate different perspectives on a decision.

It cannot make the decision.

---

## How the Layers Interact

**Traditional workflow:**

1. (Judgment) Decide what analysis to run
2. (Model) Execute the analysis
3. (Language) Communicate the results
4. (Judgment) Decide what action to take

**Workflow with GenAI:**

1. (Judgment) Decide what analysis to run
2. (Model) Execute the analysis  
3. **(Language + GenAI)** Draft the communication
4. **(Language)** Verify and refine the draft
5. (Judgment) Decide what action to take

GenAI inserted itself into step 3.

Everything else remained the same.

---

## Why This Mental Model Matters

When you understand GenAI as purely a language layer tool, you stop:

* Asking it to do calculations
* Expecting it to make recommendations
* Treating its output as analysis

You start:

* Using it to draft routine communication
* Leveraging it to explain technical work
* Treating it as a writing assistant, not a colleague

---

## Common Mistakes, Explained

**Mistake:** "GenAI can help with my pricing model."

**Reality:** GenAI can draft the memo explaining your pricing model's results. The model itself is unchanged.

**Mistake:** "I'll use GenAI to validate my reserve assumptions."

**Reality:** GenAI can draft language explaining why your assumptions are reasonable. It can't actually validate them.

**Mistake:** "GenAI gave me three scenarios to consider for this decision."

**Reality:** GenAI gave you language describing three scenarios. You still need judgment to evaluate them.

---

## The Litmus Test

Before using GenAI for a task, ask:

"Is this fundamentally a communication task or an analysis task?"

**Communication task:** GenAI can help.

**Analysis task:** GenAI cannot help.

Most actuaries think 70% of their work is analysis.

In reality, 70% of their time goes to communication around analysis.

That's where GenAI creates value.

---

## What This Changes

**You still need to:**

* Understand actuarial methods
* Know how to build models
* Apply professional judgment
* Verify all technical work
* Accept accountability for recommendations

**You no longer need to:**

* Spend 30 minutes drafting routine emails
* Manually format executive summaries
* Rewrite the same explanation for different audiences
* Struggle with phrasing for sensitive communications

The intellectual work remained.

The administrative overhead around that work decreased.

---

## One Clear Takeaway

GenAI is not an actuarial tool.

It's a communication tool that happens to work well with actuarial content.

Your models still live below it.

Your judgment still sits above it.

GenAI fills the middle layer—the one where you translate technical work into human language.

Use it there.

Ignore it everywhere else.

And you'll capture the value without the risk.

---

**The three layers:**

* Language (where GenAI helps)
* Models (where your technical skills matter)
* Judgment (where your experience decides)

Keep them separate in your mind.

Use the right tool for each layer.

That's the entire mental model.

That's all you need to know.