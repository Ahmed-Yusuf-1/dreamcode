def filter_diary(entries, query):
    needle = query.strip().lower()
    if not needle:
        return []
    return [entry for entry in entries if needle in entry.lower()]
