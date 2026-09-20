def build_greeter(names):
    greetings = []
    for name in names:
        greetings.append(f"Hello, {name.strip()}! Welcome to the Sky House.")
    return greetings
