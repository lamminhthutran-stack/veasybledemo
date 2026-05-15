import json
import re

with open("src/lib/i18n.ts", "r") as f:
    lines = f.readlines()

def find_duplicates(start, end):
    keys = set()
    for i in range(start, end):
        line = lines[i]
        match = re.search(r'"([^"]+)"\s*:', line)
        if match:
            key = match.group(1)
            if key in keys:
                print(f"Line {i+1}: Duplicate key {key}")
            else:
                keys.add(key)

print("Vietnamese duplicates:")
find_duplicates(0, 401)
print("\nEnglish duplicates:")
find_duplicates(401, len(lines))
