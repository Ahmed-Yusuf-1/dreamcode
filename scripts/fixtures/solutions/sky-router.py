from collections import deque

def shortest_route(grid):
    start = None
    for r, row in enumerate(grid):
        c = row.find("S")
        if c != -1:
            start = (r, c)
            break
    if start is None:
        return -1
    queue = deque([(start[0], start[1], 0)])
    seen = {start}
    while queue:
        r, c, dist = queue.popleft()
        if grid[r][c] == "E":
            return dist
        for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            nr, nc = r + dr, c + dc
            if 0 <= nr < len(grid) and 0 <= nc < len(grid[nr]) and grid[nr][nc] != "#" and (nr, nc) not in seen:
                seen.add((nr, nc))
                queue.append((nr, nc, dist + 1))
    return -1
