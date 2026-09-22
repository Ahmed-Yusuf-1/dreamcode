def plan_packing(items, capacity):
    ranked = sorted(items, key=lambda i: i["value"] / i["weight"], reverse=True)
    packed = []
    weight = 0
    value = 0
    for item in ranked:
        if weight + item["weight"] <= capacity:
            packed.append(item["name"])
            weight += item["weight"]
            value += item["value"]
    return {"packed": packed, "weight": weight, "value": value}
