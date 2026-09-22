def handle_request(path, dream_db):
    route, _, query = path.partition("?")
    if route == "/topics" and not query:
        return {"status": 200, "body": sorted(dream_db)}
    if route.startswith("/dreams/"):
        topic = route[len("/dreams/"):]
        lookup = {name.lower(): name for name in dream_db}
        limit = None
        if query:
            key, _, value = query.partition("=")
            if key != "limit":
                return {"status": 400, "body": "Bad request"}
            try:
                limit = int(value)
            except ValueError:
                return {"status": 400, "body": "Bad request"}
        if topic.lower() not in lookup:
            return {"status": 404, "body": f"No dreams found for topic: {topic}"}
        dreams = dream_db[lookup[topic.lower()]]
        return {"status": 200, "body": dreams[:limit] if limit is not None else list(dreams)}
    return {"status": 400, "body": "Bad request"}
