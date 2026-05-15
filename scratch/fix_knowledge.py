import re

with open("src/routes/executor.knowledge.tsx", "r") as f:
    content = f.read()

content = re.sub(r'vi:\s*".*?"\s*,\s*en:\s*("[^"]*")', r'\1', content, flags=re.DOTALL)
# Try again with different regex
content = re.sub(r'vi:\s*".*?"\s*,\s*en:\s*(`[^`]*`)', r'\1', content, flags=re.DOTALL)

# Let's just replace the whole array
new_array = """
const FAQ_DB = [
  {
    id: "faq-1",
    tags: ["check-in", "late", "penalty"],
    title: "Late check-in — what happens?",
    content: "Under 15 minutes late: pay deducted proportionally.\\nOver 15 minutes late: task automatically cancelled, surge pricing activated to reassign to another executor."
  },
  {
    id: "faq-2",
    tags: ["store", "refuse", "entry", "dispute"],
    title: "Store refuses entry — what to do?",
    content: "Report the issue via the app immediately -> select 'Store refused entry'.\\nYour pay will NOT be deducted.\\nVeasyble will deal directly with the retailer."
  },
  {
    id: "faq-3",
    tags: ["pop", "proof", "photo", "placement", "blurry"],
    title: "How to take a valid PoP photo",
    content: "PoP includes: shelf photo before setup, shelf photo after setup (4 angles), selfie at store, timestamp + GPS.\\nIf photo is blurry or wrong angle: retake immediately.\\nIf GPS fraud is suspected: account temporarily suspended for investigation."
  },
  {
    id: "faq-4",
    tags: ["rating", "score", "healthy", "warning", "suspended"],
    title: "How does the rating system work?",
    content: "First job: Veasyble rates automatically.\\nFrom 2nd job onwards: average of Brand + Retailer ratings.\\nThresholds: >=4.0 Healthy | 3.5-3.9 Warning | 3.0-3.4 At Risk | <3.0 Suspended."
  },
  {
    id: "faq-5",
    tags: ["print", "material", "station", "pickup", "defective"],
    title: "Print station pickup & defective materials",
    content: "Pick up materials at the print station at least 1 day before execution.\\nIf materials are defective: report via app -> you are not penalized -> platform arranges reprint."
  }
];
"""

content = re.sub(r'const FAQ_DB = \[[\s\S]*?\];', new_array, content)

with open("src/routes/executor.knowledge.tsx", "w") as f:
    f.write(content)

print("Fixed knowledge.tsx")
