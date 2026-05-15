import os
import re

directory = "src/routes"
for filename in os.listdir(directory):
    if filename.startswith("ops.") and filename.endswith(".tsx"):
        filepath = os.path.join(directory, filename)
        with open(filepath, "r") as f:
            content = f.read()
        
        # We want to find <button ...> and replace rounded-* with rounded-[5px]
        # Since <button> tags can span multiple lines, we use re.sub with a custom function
        
        def replace_rounded(match):
            tag_content = match.group(0)
            # Only replace rounded variants in the class or className string
            # This is a bit tricky, but replacing all rounded-(md|lg|sm|full|xl|2xl|3xl) or just rounded
            # inside the matched <button ...> tag is safe.
            new_content = re.sub(r'\brounded-(?:md|lg|sm|full|xl|2xl|3xl)\b', 'rounded-[5px]', tag_content)
            # Also replace raw 'rounded ' with 'rounded-[5px] '
            new_content = re.sub(r'\brounded\b(?![-\[])', 'rounded-[5px]', new_content)
            return new_content

        new_content = re.sub(r'<button\b[^>]*>', replace_rounded, content)
        
        # Also do this for <Link ...> that have button classes like bg-orange or border
        def replace_rounded_link(match):
            tag_content = match.group(0)
            if 'bg-' in tag_content or 'border-' in tag_content:
                new_content = re.sub(r'\brounded-(?:md|lg|sm|full|xl|2xl|3xl)\b', 'rounded-[5px]', tag_content)
                new_content = re.sub(r'\brounded\b(?![-\[])', 'rounded-[5px]', new_content)
                return new_content
            return tag_content
            
        new_content = re.sub(r'<Link\b[^>]*>', replace_rounded_link, new_content)

        with open(filepath, "w") as f:
            f.write(new_content)
        print(f"Processed {filename}")
