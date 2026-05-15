import os
import re

files = [
    "src/routes/executor.academy.complete.tsx",
    "src/routes/executor.knowledge.tsx",
    "src/lib/format.ts"
]

for file_path in files:
    with open(file_path, "r") as f:
        content = f.read()

    # match `{lang === "vi" ? "VI_TEXT" : "EN_TEXT"}` -> `"EN_TEXT"`
    # match `lang === "vi" ? "VI_TEXT" : "EN_TEXT"` -> `"EN_TEXT"`
    
    # We can just replace `lang === "vi"` with `false` and then it will always evaluate to the English side!
    content = content.replace('lang === "vi"', 'false')
    content = content.replace("lang === 'vi'", 'false')
    
    with open(file_path, "w") as f:
        f.write(content)
