import re

LINE = re.compile(r"\[([A-Z]+)\] (\w+): ")

def summarize_logs(lines):
    counts = {}
    errors = {}
    skipped = 0
    for line in lines:
        match = LINE.match(line)
        if not match:
            skipped += 1
            continue
        level, module = match.groups()
        counts[level] = counts.get(level, 0) + 1
        if level == "ERROR":
            errors[module] = errors.get(module, 0) + 1
    noisiest = max(errors, key=errors.get) if errors else None
    return {"counts": counts, "noisiest": noisiest, "skipped": skipped}
