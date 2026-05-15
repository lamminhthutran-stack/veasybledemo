import os
import re
import glob

# 1. Parse i18n keys
translations = {}
with open("src/lib/i18n.ts", "r") as f:
    content = f.read()

# Extract the en block
en_block_match = re.search(r'en:\s*\{\s*translation:\s*\{([\s\S]*?)\}\n\s*\}', content)
if en_block_match:
    en_block = en_block_match.group(1)
    # find all "key": "value"
    matches = re.findall(r'"([^"]+)"\s*:\s*"([^"]+)"', en_block)
    for key, value in matches:
        translations[key] = value

print(f"Loaded {len(translations)} translations from en block.")

# 2. Process all tsx and ts files in src/
files = glob.glob("src/**/*.tsx", recursive=True) + glob.glob("src/**/*.ts", recursive=True)
modified_count = 0

for file_path in files:
    if "i18n.ts" in file_path:
        continue

    with open(file_path, "r") as f:
        content = f.read()

    original_content = content

    # Remove imports and useTranslation hook
    content = re.sub(r'import\s*\{\s*useTranslation\s*\}\s*from\s*["\']react-i18next["\'];?\n?', '', content)
    content = re.sub(r'import\s*\{\s*useLang\s*\}\s*from\s*["\']@/lib/i18n-context["\'];?\n?', '', content)
    content = re.sub(r'const\s*\{\s*t\s*\}\s*=\s*useTranslation\(\s*\);?\n?', '', content)
    content = re.sub(r'const\s*\{\s*lang[^\}]*\}\s*=\s*useLang\(\s*\);?\n?', '', content)
    
    # Process replacements
    for key, value in translations.items():
        escaped_key = re.escape(key)
        escaped_value = value.replace('"', '\\"')
        
        # t("key") or t('key') -> "Value"
        pattern_func = r't\(\s*["\']' + escaped_key + r'["\']\s*\)'
        content = re.sub(pattern_func, f'"{escaped_value}"', content)

    # Some remaining hardcodings from useLang and missing keys
    content = content.replace('t("no_reqs")', '"No requirements"')
    content = content.replace('t("tbd")', '"TBD"')
    content = content.replace('t("rating")', '"Rating"')
    content = content.replace('t("executor_portal")', '"Executor Portal"')
    content = content.replace('t("view_task")', '"View Task"')
    content = content.replace('t("select_portal")', '"Select Portal"')
    content = content.replace('t("email_label")', '"Email"')

    # Fix lang ternary operators
    content = content.replace('lang === "vi"', 'false')
    content = content.replace("lang === 'vi'", 'false')
    content = content.replace('lang === "en"', 'true')
    content = content.replace("lang === 'en'", 'true')

    if content != original_content:
        with open(file_path, "w") as f:
            f.write(content)
        modified_count += 1
        print(f"Modified {file_path}")

print(f"\nDone. Modified {modified_count} files.")
