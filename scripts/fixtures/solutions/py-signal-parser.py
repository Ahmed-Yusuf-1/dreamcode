def parse_readings(lines):
    values = {}
    bad = 0
    for line in lines:
        parts = line.split("=")
        if len(parts) != 2:
            bad += 1
            continue
        name, raw = parts[0].strip(), parts[1].strip()
        try:
            values[name] = int(raw)
        except ValueError:
            bad += 1
    return {"values": values, "bad": bad}
