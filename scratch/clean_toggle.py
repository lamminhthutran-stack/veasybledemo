import re

files_to_clean = [
    "src/components/AppLayout.tsx",
    "src/components/OpsLayout.tsx",
    "src/routes/login.tsx",
    "src/routes/executor.knowledge.tsx"
]

for f_path in files_to_clean:
    try:
        with open(f_path, "r") as f:
            content = f.read()

        content = re.sub(r'import\s*\{\s*LangToggle\s*\}\s*from\s*["\']@/lib/i18n-context["\'];?\n?', '', content)
        content = re.sub(r'import\s*\{\s*useLang\s*,\s*LangToggle\s*\}\s*from\s*["\']@/lib/i18n-context["\'];?\n?', '', content)
        content = re.sub(r'<LangToggle\s*/>\n?', '', content)
        content = content.replace("const lang = false ? 'vi' : 'en';", "")
        content = content.replace("searchKB(q, lang)", "searchKB(q)")

        # In searchKB
        content = content.replace("function searchKB(query: string, lang: \"vi\" | \"en\") {", "function searchKB(query: string) {")

        with open(f_path, "w") as f:
            f.write(content)
        print("Cleaned", f_path)
    except Exception as e:
        print(f"Error {f_path}: {e}")

