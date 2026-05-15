import re

with open("src/routes/executor.knowledge.tsx", "r") as f:
    content = f.read()

# Replace `{ vi: "...", en: "..." }` with `"..."`
content = re.sub(r'title:\s*\{\s*vi:\s*["\'][^"\']*["\'],\s*en:\s*(["\'][^"\']*["\'])\s*\}', r'title: \1', content)
content = re.sub(r'content:\s*\{\s*vi:\s*["\'][^"\']*["\'],\s*en:\s*(["\'][^"\']*["\'])\s*\}', r'content: \1', content)
# It was `a.title[lang]` -> `a.title`
content = content.replace("a.title[lang]", "a.title")
content = content.replace("a.content[lang]", "a.content")
content = content.replace('lang === "vi" ? a.content.vi : a.content.en', 'a.content')
content = content.replace('lang === "vi" ? a.title.vi : a.title.en', 'a.title')

# Replace QUICK_TOPICS
content = re.sub(r'vi:\s*\[[^\]]+\]\s*,\s*en:\s*(\[[^\]]+\])', r'\1', content)
content = content.replace('const topics = false ? QUICK_TOPICS.vi : QUICK_TOPICS.en;', 'const topics = QUICK_TOPICS;')

with open("src/routes/executor.knowledge.tsx", "w") as f:
    f.write(content)
