class CloudTracker:
    def __init__(self, name, height):
        self.name = name
        self.height = height

    def grow(self, amount):
        if amount <= 0:
            raise ValueError("amount must be positive")
        self.height += amount

    def get_status(self):
        return f"{self.name} is at {self.height}m"


def test_tracker(name, height, grow_amount):
    tracker = CloudTracker(name, height)
    try:
        tracker.grow(grow_amount)
    except ValueError:
        return "invalid growth"
    return tracker.get_status()
