import functools


def add_telemetry(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        return "[Telemetry] " + func(*args, **kwargs)
    return wrapper


def test_decorator(val):
    @add_telemetry
    def echo(text):
        return text
    return echo(val)
