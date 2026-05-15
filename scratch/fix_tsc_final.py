import re

def clean_file(path, replacements):
    with open(path, "r") as f:
        content = f.read()
    for old, new in replacements:
        content = content.replace(old, new)
    with open(path, "w") as f:
        f.write(content)

# 1. src/components/ExecutorBottomNav.tsx
with open("src/components/ExecutorBottomNav.tsx", "r") as f:
    content = f.read()
# Remove the Language Toggle
content = re.sub(r'\{/\* Floating Language Toggle \*/\}[\s\S]*?</div>\s*</div>', '', content)
with open("src/components/ExecutorBottomNav.tsx", "w") as f:
    f.write(content)

# 2. src/routes/__root.tsx
with open("src/routes/__root.tsx", "r") as f:
    content = f.read()
content = content.replace("<LangProvider>", "")
content = content.replace("</LangProvider>", "")
with open("src/routes/__root.tsx", "w") as f:
    f.write(content)

# 3. src/routes/executor.home.tsx
clean_file("src/routes/executor.home.tsx", [
    ("formatEarnings(profile.monthlyEarnings, lang)", "formatEarnings(profile.monthlyEarnings)"),
    ("formatEarnings(profile.pendingEarnings, lang)", "formatEarnings(profile.pendingEarnings)")
])

# Also format.ts needs to be updated to remove lang
with open("src/lib/format.ts", "r") as f:
    content = f.read()
content = content.replace("export function formatEarnings(amount: number, lang: \"vi\" | \"en\" = \"vi\") {", "export function formatEarnings(amount: number) {")
content = content.replace("export function formatEarnings(amount: number, lang: \"vi\" | \"en\" = \"en\") {", "export function formatEarnings(amount: number) {")
# Just rewrite formatEarnings
content = re.sub(r'export function formatEarnings[\s\S]*?\}', 'export function formatEarnings(amount: number) {\n  return `${amount.toLocaleString()} VND`;\n}', content)
with open("src/lib/format.ts", "w") as f:
    f.write(content)

# 4. src/routes/executor.in-review.tsx
clean_file("src/routes/executor.in-review.tsx", [
    ("task.campaignName", "task.campaign")
])

# 5. src/routes/executor.knowledge.tsx
clean_file("src/routes/executor.knowledge.tsx", [
    ("a.body[lang]", "a.body")
])

# 6. src/routes/ops.executors.index.tsx
with open("src/routes/ops.executors.index.tsx", "r") as f:
    content = f.read()
content = content.replace("getRatingStatus(u.rating, t)", "getRatingStatus(u.rating)")
# find getRatingStatus function definition and remove `t: any`
content = content.replace("function getRatingStatus(rating: number, t: any)", "function getRatingStatus(rating: number)")
content = content.replace("return { label: t(\"suspended\"), color: \"bg-red-100 text-red-700\" };", "return { label: \"Suspended\", color: \"bg-red-100 text-red-700\" };")
content = content.replace("return { label: t(\"at_risk\"), color: \"bg-orange-100 text-orange-700\" };", "return { label: \"At Risk\", color: \"bg-orange-100 text-orange-700\" };")
content = content.replace("return { label: t(\"warning\"), color: \"bg-yellow-100 text-yellow-700\" };", "return { label: \"Warning\", color: \"bg-yellow-100 text-yellow-700\" };")
content = content.replace("return { label: t(\"healthy\"), color: \"bg-green-100 text-green-700\" };", "return { label: \"Healthy\", color: \"bg-green-100 text-green-700\" };")
with open("src/routes/ops.executors.index.tsx", "w") as f:
    f.write(content)

# 7. src/routes/ops.queue.application.$id.tsx
clean_file("src/routes/ops.queue.application.$id.tsx", [
    ("t={t}", "")
])

# 8. src/routes/ops.queue.index.tsx
clean_file("src/routes/ops.queue.index.tsx", [
    ("{t(tb.key)}", "{tb.key}"), # wait, tb.key might be "all"
    ("t(`tab_${e.phase.toLowerCase()}`)", "e.phase"),
    ("key: \"tab_all\"", "key: \"All\""),
    ("key: \"stage_1_pool\"", "key: \"Stage 1\""),
    ("key: \"application_review\"", "key: \"Review\""),
])

print("Fixed TSC errors")
