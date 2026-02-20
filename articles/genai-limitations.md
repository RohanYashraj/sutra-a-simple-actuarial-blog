---
title: "Where GenAI Breaks Down for Actuaries"
category: "GenAI for Actuaries"
date: "04-01-2026"
author: "Rohan Yashraj Gupta"
authorImage: "/authors/author-rohan.jpg"
description: "Understand the critical limitations of GenAI in actuarial work: why it fails at math, struggles with specific assumptions, and lacks necessary judgment."
---

GenAI is impressive until you give it something that actually matters.

Then it fails quietly.

With confidence.

## The Numbers Problem

Ask GenAI to calculate the present value of a simple annuity.

Annual payment: $10,000

Term: 20 years

Discount rate: 3%

It will produce an answer.

That answer will be wrong.

Not wildly wrong.

Just wrong enough to ruin a pricing decision.

**Why it fails:**

GenAI doesn't perform arithmetic.

It predicts what numbers usually appear in this context.

For common calculations, those predictions look right.

For your specific calculation, they're fabricated.

**The test:**

I asked three different GenAI models this exact question.

Results:

- Model A: $148,775.40
- Model B: $149,086.50
- Model C: $148,877.50

Actual answer: $148,775.54

Close, right?

Now price a product with that error.

Compounded across thousands of policies.

Suddenly "close" becomes "liability."

## The Assumptions Problem

You're building a long-term care pricing model.

You ask GenAI: "What's a reasonable lapse rate assumption for LTC policies?"

It responds: "Industry studies suggest lapse rates between 2-4% annually, with higher rates in early durations and lower rates after the free look period."

Sounds good.

It's also useless.

Your product has:

- A 10-pay premium structure
- Partnership program certification
- Rate guarantee for five years
- Mostly employer groups

None of those factors appear in GenAI's answer.

Because it gave you a generic pattern, not an analyzed assumption.

**What actually happened:**

GenAI synthesized language from pricing manuals, research papers, and industry reports.

It knows what actuaries typically write about lapse rates.

It doesn't know what lapse rate fits your context.

You still need to:

- Pull your own experience data
- Adjust for product features
- Consider competitive positioning
- Document your rationale

GenAI didn't help.

It just delayed the real work with plausible-sounding filler.

## The Edge Case Problem

Edge cases are where actuarial work actually happens.

The standard case runs smoothly.

The edge case requires judgment.

GenAI has no judgment.

**Example: Claim Reserving**

You're reserving for a cyber liability claim.

Policyholder reported a data breach.

Notification costs are clear.

But there's potential regulatory action pending.

Class action litigation might follow.

Long-tail defense costs are unknown.

You ask GenAI: "How should I reserve for potential regulatory fines in a cyber breach claim?"

It responds with general framework language about expected value and scenario analysis.

All technically correct.

None of it tells you:

- What jurisdictions are involved
- Whether the breach meets GDPR thresholds
- If similar cases settled or went to trial
- What your reinsurance treaty actually covers

GenAI gave you the shape of an answer.

You still have to fill in everything that matters.

## The Confidence Problem

The dangerous part isn't that GenAI fails.

It's that GenAI fails without signaling uncertainty.

When you make a calculation error, you might second-guess yourself.

When GenAI makes an error, it formats it beautifully.

**Side-by-side comparison:**

**Your work:**
"I calculated the pure premium at $487, but I'm not confident about the exposure adjustment—might be closer to $510 depending on how we define a covered unit."

**GenAI's work:**
"The indicated pure premium is $498.50 based on historical loss experience adjusted for trend and exposure changes."

Which one sounds more reliable?

Which one is actually more reliable?

## What This Means Practically

Use GenAI for drafting.

Never for deciding.

If the output contains:

- Calculated numbers
- Specific assumptions for your context
- Recommendations on edge cases

Verify everything.

Assume nothing.

Treat it like you would an email from someone who's never seen your data but has read a lot about actuarial science.

GenAI breaks down exactly where actuarial work gets interesting.

When the pattern is unusual.

When the numbers actually matter.

When judgment is required.

That's not a flaw in GenAI.

It's a reminder of what actuarial work actually is.
