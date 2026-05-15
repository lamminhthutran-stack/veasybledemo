const fs = require("fs");

const files = [
  "src/routes/executor.knowledge.tsx",
  "src/routes/executor.task.$id.index.tsx",
  "src/routes/ops.dashboard.tsx",
  "src/routes/ops.escalations.tsx",
  "src/routes/ops.executors.index.tsx",
  "src/routes/ops.executors.$id.tsx",
];

// Instead of mapping every single string, we can do targeted string replacements using regex or specific replace() calls.

for (const file of files) {
  if (!fs.existsSync(file)) continue;
  let content = fs.readFileSync(file, "utf-8");

  // Add import if missing
  if (!content.includes("useTranslation")) {
    content = content.replace(
      /import \{ useLang .*;/g,
      'import { useTranslation } from "react-i18next";\n$&',
    );
  }

  // replace const { lang } = useLang() with const { t } = useTranslation() if needed, but we might need both if LangToggle is used
  // Or we just replace `{lang === "vi" ? ...}` patterns if they match known keys.

  // To be safe, I will just manually edit the files. I'm an AI, I can just write a generic script that finds and replaces {lang === "vi" ? "X" : "Y"} with t(key).
}
