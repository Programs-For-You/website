# BLOCKBOP - a brick breaker for the TI-84 Evo (Python)
# (c) 2026 Brady Krupa and Arjun Bhanderi. All rights reserved. programsforyou.com
# Left/right move the paddle. [2nd] or up launches the ball. Silver bricks take 2 hits.
# [enter] pauses, [clear] quits.
import ti_draw
import time
import random
import math
from ti_system import *

W = 321
H = 211
TOP = 22
CW = 10

K_UP = 25
K_DOWN = 34
K_LEFT = 24
K_RIGHT = 26
K_2ND = 21
K_ENTER = 105
K_CLEAR = 45

BG = (12, 12, 28)
BAR = (24, 24, 48)
ROWC = [(255, 90, 95), (255, 160, 70), (255, 215, 80), (110, 220, 120), (80, 180, 255), (175, 125, 255)]
SILVER = (205, 208, 225)
PADDLE = (235, 240, 255)
BALLC = (255, 255, 255)
TEXT = (235, 240, 255)
DIM = (140, 150, 195)
RED = (255, 90, 100)
GOLD = (255, 205, 60)

BCOLS = 10
BW = 30
BH = 10
GAP = 2
BX0 = (W - (BCOLS * (BW + GAP) - GAP)) // 2
BY0 = TOP + 12
PW = 46
PH = 6
PY = H - 14
BALL = 6
NUDGE = 14
FAST = 250

LEVELS = [
    ["##########", "##########", "##########", "##########", "##########"],
    ["S.S.S.S.S.", ".#.#.#.#.#", "#.#.#.#.#.", ".#.#.#.#.#", "#.#.#.#.#."],
    ["....SS....", "...####...", "..######..", ".########.", "##########", "SSSSSSSSSS"],
]
best = 0


def color(c):
    ti_draw.set_color(c[0], c[1], c[2])


def box(x, y, w, h, c):
    color(c)
    ti_draw.fill_rect(x, y, w, h)


def write(x, y, s, c):
    color(c)
    ti_draw.draw_text(x, y, s)


def center(y, s, c):
    write((W - len(s) * CW) // 2, y, s, c)


def keys_off(seconds):
    end = time.monotonic() + seconds
    while time.monotonic() < end:
        get_key(0)


def choose():
    while True:
        k = get_key(0)
        if k == K_ENTER or k == K_2ND:
            return True
        if k == K_CLEAR:
            return False


class Hold:
    # The calculator only reports a held key as: one press, a short pause, then repeats.
    def __init__(self):
        self.key = 0
        self.until = 0
        self.fast = False

    def press(self, k, now):
        if k == self.key and now <= self.until:
            self.fast = True
            self.until = now + 0.16
            return False
        self.key = k
        self.fast = False
        self.until = now + 0.55
        return True

    def held(self, now):
        if self.key and now > self.until:
            self.key = 0
            self.fast = False
        return self.key if self.fast else 0


def brick_xy(r, c):
    return BX0 + c * (BW + GAP), BY0 + r * (BH + GAP)


def draw_brick(grid, r, c):
    x, y = brick_xy(r, c)
    hp = grid[r][c]
    if hp == 0:
        box(x, y, BW, BH, BG)
    else:
        box(x, y, BW, BH, SILVER if hp == 2 else ROWC[r % len(ROWC)])


def build(level):
    pattern = LEVELS[(level - 1) % len(LEVELS)]
    grid = []
    count = 0
    for r in range(len(pattern)):
        row = []
        for ch in pattern[r]:
            hp = 2 if ch == "S" else (1 if ch == "#" else 0)
            row.append(hp)
            if hp:
                count += 1
        grid.append(row)
    for r in range(len(grid)):
        for c in range(BCOLS):
            if grid[r][c]:
                draw_brick(grid, r, c)
    return grid, count


def find_brick(grid, x, y):
    # The brick (row, col) the ball would touch at (x, y), or None.
    if y + BALL <= BY0 or y >= BY0 + len(grid) * (BH + GAP):
        return None
    c0 = max((x - BX0) // (BW + GAP), 0)
    c1 = min((x + BALL - 1 - BX0) // (BW + GAP), BCOLS - 1)
    r0 = max((y - BY0) // (BH + GAP), 0)
    r1 = min((y + BALL - 1 - BY0) // (BH + GAP), len(grid) - 1)
    for r in range(r0, r1 + 1):
        for c in range(c0, c1 + 1):
            if grid[r][c]:
                bx, by = brick_xy(r, c)
                if x + BALL > bx and x < bx + BW and y + BALL > by and y < by + BH:
                    return (r, c)
    return None


def show_score(score):
    box(0, 0, 135, TOP, BAR)
    write(6, 17, "Score " + str(score), TEXT)


def show_level(level):
    box(W // 2 - 35, 0, 70, TOP, BAR)
    s = "Lv " + str(level)
    write((W - len(s) * CW) // 2, 17, s, GOLD)


def show_balls(balls):
    box(W - 95, 0, 95, TOP, BAR)
    s = "Balls " + str(balls)
    write(W - len(s) * CW - 6, 17, s, RED if balls == 1 else TEXT)


def title():
    box(0, 0, W, H, BG)
    for c in range(BCOLS):
        x, y = brick_xy(0, c)
        box(x, 14, BW, BH, ROWC[c % len(ROWC)])
        box(x, 26, BW, BH, ROWC[(c + 3) % len(ROWC)])
    center(80, "BLOCK BOP", GOLD)
    center(108, "Break every brick!", DIM)
    center(128, "Left/right move, [2nd] launch", DIM)
    center(148, "Silver bricks take 2 hits", SILVER)
    if best > 0:
        center(170, "Best: " + str(best), TEXT)
    center(H - 12, "[enter] play  [clear] quit", TEXT)
    keys_off(0.3)
    return choose()


def paused():
    box(W // 2 - 35, 0, 70, TOP, BAR)
    write(W // 2 - 30, 17, "PAUSED", GOLD)
    while True:
        k = get_key(0)
        if k == K_ENTER:
            return False
        if k == K_CLEAR:
            return True


def play():
    score = 0
    balls = 3
    level = 1
    while True:
        box(0, 0, W, H, BG)
        box(0, 0, W, TOP, BAR)
        show_score(score)
        show_level(level)
        show_balls(balls)
        grid, left = build(level)
        if level > 1:
            center(150, "LEVEL " + str(level), GOLD)
            keys_off(1.2)
            box(0, 130, W, 26, BG)
        result = play_level(grid, left, level, score, balls)
        score, balls, cleared = result
        if not cleared:
            return score, balls == 0
        level += 1


def play_level(grid, left, level, score, balls):
    speed = min(135 + (level - 1) * 15, 230)
    px = float((W - PW) // 2)
    dpx = int(px)
    box(dpx, PY, PW, PH, PADDLE)
    stuck = True
    bx = dpx + (PW - BALL) // 2
    by = PY - BALL
    vx = 0.0
    vy = 0.0
    dbx = int(bx)
    dby = int(by)
    box(dbx, dby, BALL, BALL, BALLC)
    hold = Hold()
    broken = 0
    last = time.monotonic()

    while True:
        now = time.monotonic()
        dt = now - last
        last = now
        if dt > 0.1:
            dt = 0.1

        nudge = 0
        launch = False
        for i in range(4):
            k = get_key(0)
            if k == 0:
                break
            if k == K_CLEAR:
                return score, balls, False
            if k == K_ENTER:
                if paused():
                    return score, balls, False
                show_level(level)
                last = time.monotonic()
            if k == K_LEFT or k == K_RIGHT:
                if hold.press(k, now):
                    nudge = -NUDGE if k == K_LEFT else NUDGE
            if k == K_2ND or k == K_UP:
                launch = True

        # paddle: erase only the strip it leaves, draw only the strip it enters
        dx = nudge
        h = hold.held(now)
        if h == K_LEFT:
            dx -= FAST * dt
        elif h == K_RIGHT:
            dx += FAST * dt
        px = min(max(px + dx, 0), W - PW)
        npx = int(px)
        if npx != dpx:
            d = npx - dpx
            if abs(d) >= PW:
                box(dpx, PY, PW, PH, BG)
                box(npx, PY, PW, PH, PADDLE)
            elif d > 0:
                box(dpx, PY, d, PH, BG)
                box(dpx + PW, PY, d, PH, PADDLE)
            else:
                box(npx + PW, PY, -d, PH, BG)
                box(npx, PY, -d, PH, PADDLE)
            dpx = npx

        if stuck:
            bx = dpx + (PW - BALL) // 2
            by = PY - BALL
            if launch:
                stuck = False
                vx = speed * 0.4 * (1 if random.randint(0, 1) else -1)
                vy = -math.sqrt(speed * speed - vx * vx)
        else:
            # move in small steps so the ball never skips through a brick
            steps = int(speed * dt / 4) + 1
            sdt = dt / steps
            for i in range(steps):
                nx = bx + vx * sdt
                if nx < 0:
                    nx = 0
                    vx = -vx
                elif nx + BALL > W:
                    nx = W - BALL
                    vx = -vx
                else:
                    hit = find_brick(grid, int(nx), int(by))
                    if hit is not None:
                        vx = -vx
                        nx = bx
                        score, left = smash(grid, hit, score, left)
                        broken += 1
                bx = nx
                ny = by + vy * sdt
                if ny < TOP:
                    ny = TOP
                    vy = -vy
                else:
                    hit = find_brick(grid, int(bx), int(ny))
                    if hit is not None:
                        vy = -vy
                        ny = by
                        score, left = smash(grid, hit, score, left)
                        broken += 1
                by = ny
                # paddle bounce: where the ball lands on the paddle sets its angle
                if vy > 0 and by + BALL >= PY and by + BALL <= PY + PH + 4 and bx + BALL > dpx and bx < dpx + PW:
                    by = PY - BALL
                    off = ((bx + BALL / 2) - (dpx + PW / 2)) / (PW / 2)
                    off = max(-1.0, min(1.0, off))
                    if -0.12 < off < 0.12:
                        off = 0.12 if off >= 0 else -0.12     # never straight up and down forever
                    vx = speed * 0.8 * off
                    vy = -math.sqrt(speed * speed - vx * vx)
                if broken >= 12 and speed < 240:
                    broken = 0
                    speed += 8
                    scale = speed / math.sqrt(vx * vx + vy * vy)
                    vx *= scale
                    vy *= scale
            if left == 0:
                box(dbx, dby, BALL, BALL, BG)
                return score, balls, True
            if by > H:
                box(dbx, dby, BALL, BALL, BG)
                balls -= 1
                show_balls(balls)
                if balls == 0:
                    return score, balls, False
                keys_off(0.6)
                stuck = True
                bx = dpx + (PW - BALL) // 2
                by = PY - BALL
                last = time.monotonic()

        nbx = int(bx)
        nby = int(by)
        if nbx != dbx or nby != dby:
            box(dbx, dby, BALL, BALL, BG)
            box(nbx, nby, BALL, BALL, BALLC)
            dbx = nbx
            dby = nby


def smash(grid, hit, score, left):
    r, c = hit
    grid[r][c] -= 1
    draw_brick(grid, r, c)
    score += 10
    if grid[r][c] == 0:
        left -= 1
    show_score(score)
    return score, left


def game_over(score):
    global best
    record = score > best
    if record:
        best = score
    box(16, 106, W - 32, 92, ROWC[4])
    box(18, 108, W - 36, 88, BG)
    center(136, "GAME OVER", RED)
    if record and score > 0:
        center(160, "Score " + str(score) + "  NEW BEST!", GOLD)
    else:
        center(160, "Score " + str(score) + "  Best " + str(best), TEXT)
    center(186, "[enter] again [clear] menu", DIM)
    keys_off(0.6)
    return choose()


def main():
    while title():
        while True:
            score, died = play()
            if not died or not game_over(score):
                break
    box(0, 0, W, H, BG)
    center(110, "Thanks for playing!", TEXT)


main()
