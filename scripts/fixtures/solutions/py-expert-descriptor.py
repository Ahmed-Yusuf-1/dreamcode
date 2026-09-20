class IntegerRange:
    def __init__(self, min_val, max_val):
        self.min_val = min_val
        self.max_val = max_val

    def __set_name__(self, owner, name):
        self.name = "_" + name

    def __get__(self, instance, owner):
        if instance is None:
            return self
        return getattr(instance, self.name)

    def __set__(self, instance, value):
        if not isinstance(value, int) or not (self.min_val <= value <= self.max_val):
            raise ValueError("out of range")
        setattr(instance, self.name, value)


class Planet:
    gravity = IntegerRange(1, 100)

    def __init__(self, name, gravity):
        self.name = name
        self.gravity = gravity


def test_descriptor(name, gravity):
    try:
        planet = Planet(name, gravity)
    except ValueError:
        return "invalid gravity"
    return f"{planet.name} is at {planet.gravity}g"
