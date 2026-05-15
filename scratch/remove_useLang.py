import os
import re
import glob

files = glob.glob("src/**/*.tsx", recursive=True) + glob.glob("src/**/*.ts", recursive=True)
modified_count = 0

for file_path in files:
    with open(file_path, "r") as f:
        content = f.read()

    original_content = content

    content = re.sub(r'import\s*\{\s*useLang\s*\}\s*from\s*["\']@/lib/i18n-context["\'];?\n?', '', content)
    content = re.sub(r'const\s*\{\s*lang[^\}]*\}\s*=\s*useLang\(\s*\);?\n?', '', content)
    
    # Sometimes it's `lang === "vi" ? ... : ...`
    # We should hardcode "en" logic if it exists.
    # Actually, they want the app entirely in English.
    # Let's replace `lang === 'vi'` with `false` or just handle them manually if few.
    
    if content != original_content:
        with open(file_path, "w") as f:
            f.write(content)
        modified_count += 1
        print(f"Modified {file_path}")

print(f"Done. Modified {modified_count} files.")
