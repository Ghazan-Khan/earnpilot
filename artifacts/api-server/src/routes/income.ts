import { Router } from "express";
import { openai } from "@workspace/integrations-openai-ai-server";
import { GenerateIncomePlanBody } from "@workspace/api-zod";

const incomeRouter = Router();

incomeRouter.post("/income/generate", async (req, res) => {
  const parseResult = GenerateIncomePlanBody.safeParse(req.body);
  if (!parseResult.success) {
    res.status(400).json({
      error: "validation_error",
      message: parseResult.error.message,
    });
    return;
  }

  const { income, skill, time } = parseResult.data;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-5.2",
      max_completion_tokens: 8192,
      messages: [
        {
          role: "system",
          content: `You are a brutally honest AI income strategist.

Your job:
- Identify how much the user is under-earning
- Highlight their biggest mistake clearly
- Provide practical, fast, realistic ways to increase income

Rules:
- Be direct, slightly provocative
- Focus on fast wins (within 7–30 days)
- Avoid generic advice
- Make outputs emotionally impactful and shareable

You MUST respond with ONLY valid JSON in this exact format:
{
  "under_earning_amount": "<dollar amount per month as a number string e.g. '2500'>",
  "income_gap_score": "<0-100 score as a number string>",
  "biggest_mistake": "<1-2 sentence direct statement of their biggest mistake>",
  "opportunities": [
    { "title": "<opportunity title>", "action": "<specific action step>", "potential": "<e.g. +$800/month>" },
    { "title": "<opportunity title>", "action": "<specific action step>", "potential": "<e.g. +$1200/month>" },
    { "title": "<opportunity title>", "action": "<specific action step>", "potential": "<e.g. +$600/month>" }
  ],
  "7_day_plan": ["<Day 1 action>", "<Day 2 action>", "<Day 3 action>", "<Day 4 action>", "<Day 5 action>", "<Day 6 action>", "<Day 7 action>"],
  "potential_increase": "<dollar amount per month as a number string e.g. '3000'>",
  "yearly_loss": "<dollar amount per year as a number string e.g. '30000'>"
}`,
        },
        {
          role: "user",
          content: `Income: $${income}/month\nSkill: ${skill}\nTime Available: ${time} per day`,
        },
      ],
    });

    const rawContent = completion.choices[0]?.message?.content;
    if (!rawContent) {
      res.status(500).json({
        error: "ai_error",
        message: "No response from AI",
      });
      return;
    }

    let parsed: unknown;
    try {
      const jsonMatch = rawContent.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("No JSON found");
      parsed = JSON.parse(jsonMatch[0]);
    } catch {
      req.log.error({ rawContent }, "Failed to parse AI JSON response");
      res.status(500).json({
        error: "parse_error",
        message: "Failed to parse AI response",
      });
      return;
    }

    const raw = parsed as Record<string, unknown>;
    const plan = {
      under_earning_amount: String(raw["under_earning_amount"] ?? "0"),
      income_gap_score: String(raw["income_gap_score"] ?? "50"),
      biggest_mistake: String(raw["biggest_mistake"] ?? ""),
      opportunities: Array.isArray(raw["opportunities"])
        ? (raw["opportunities"] as Array<Record<string, string>>).slice(0, 3).map((o) => ({
            title: String(o["title"] ?? ""),
            action: String(o["action"] ?? ""),
            potential: String(o["potential"] ?? ""),
          }))
        : [],
      seven_day_plan: Array.isArray(raw["7_day_plan"])
        ? (raw["7_day_plan"] as unknown[]).slice(0, 7).map(String)
        : [],
      potential_increase: String(raw["potential_increase"] ?? "0"),
      yearly_loss: String(raw["yearly_loss"] ?? "0"),
    };

    res.json(plan);
  } catch (err) {
    req.log.error({ err }, "Income plan generation failed");
    res.status(500).json({
      error: "server_error",
      message: "Failed to generate income plan. Please try again.",
    });
  }
});

export default incomeRouter;
