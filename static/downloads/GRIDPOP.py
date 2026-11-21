# GRIDPOP - a block-placing puzzle for the TI-84 Evo (Python)
# (c) 2026 Programs For You. All rights reserved. programsforyou.com
# Place the 3 shapes on the 8x8 board. Fill a whole row or column to clear it.
# Arrows move the shape, [enter] picks a different shape, [2nd] places it. [clear] quits.
import ti_draw
import time
import random
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

BG = (16, 18, 38)
BAR = (28, 30, 62)
EMPTY = (38, 42, 80)
TRAY = (24, 26, 54)
PICK = (255, 210, 70)
BAD = (230, 70, 80)
FLASH = (255, 255, 255)
TEXT = (235, 240, 255)
DIM = (150, 160, 205)
GOLD = (255, 210, 70)
RED = (255, 95, 105)

N = 8
CELL = 22
GX = 6
GY = TOP + 5
TX = 196
TW = 119
SLOT_H = 58
MC = 9

COLORS = [(255, 95, 100), (255, 165, 70), (255, 215, 80), (110, 215, 120),
          (80, 185, 255), (170, 125, 255), (255, 125, 200), (80, 220, 210)]
GHOST = [(150, 70, 80), (150, 110, 60), (150, 135, 70), (75, 135, 90),
         (60, 115, 160), (110, 90, 160), (150, 85, 130), (60, 135, 135)]

SHAPES = [
    [(0, 0)],
    [(0, 0), (0, 1)], [(0, 0), (1, 0)],
    [(0, 0), (0, 1), (0, 2)], [(0, 0), (1, 0), (2, 0)],
    [(0, 0), (0, 1), (0, 2), (0, 3)], [(0, 0), (1, 0), (2, 0), (3, 0)],
    [(0, 0), (0, 1), (0, 2), (0, 3), (0, 4)], [(0, 0), (1, 0), (2, 0), (3, 0), (4, 0)],
    [(0, 0), (0, 1), (1, 0), (1, 1)],
    [(0, 0), (0, 1), (0, 2), (1, 0), (1, 1), (1, 2), (2, 0), (2, 1), (2, 2)],
    [(0, 0), (1, 0), (1, 1)], [(0, 0), (0, 1), (1, 0)], [(0, 0), (0, 1), (1, 1)], [(0, 1), (1, 0), (1, 1)],
    [(0, 0), (1, 0), (2, 0), (2, 1), (2, 2)], [(0, 0), (0, 1), (0, 2), (1, 0), (2, 0)],
    [(0, 0), (0, 1), (0, 2), (1, 2), (2, 2)], [(0, 2), (1, 2), (2, 0), (2, 1), (2, 2)],
    [(0, 0), (0, 1), (0, 2), (1, 1)], [(0, 1), (1, 0), (1, 1), (1, 2)],
    [(0, 0), (1, 0), (2, 0), (1, 1)], [(0, 1), (1, 0), (1, 1), (2, 1)],
    [(0, 1), (0, 2), (1, 0), (1, 1)], [(0, 0), (0, 1), (1, 1), (1, 2)],
    [(0, 0), (1, 0), (1, 1), (2, 1)], [(0, 1), (1, 0), (1, 1), (2, 0)],
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


def size(cells):
    h = 0
    w = 0
    for r, c in cells:
        h = max(h, r + 1)
        w = max(w, c + 1)
    return h, w


def new_piece():
    i = random.randint(0, len(SHAPES) - 1)
    return [SHAPES[i], random.randint(0, len(COLORS) - 1)]


def cell(r, c, col):
    box(GX + c * CELL, GY + r * CELL, CELL - 1, CELL - 1, col)


def draw_cell(grid, r, c):
    v = grid[r][c]
    cell(r, c, EMPTY if v < 0 else COLORS[v])


def fits(grid, cells, r0, c0):
    for r, c in cells:
        rr = r0 + r
        cc = c0 + c
        if rr < 0 or cc < 0 or rr >= N or cc >= N or grid[rr][cc] >= 0:
            return False
    return True


def fits_anywhere(grid, cells):
    h, w = size(cells)
    for r0 in range(N - h + 1):
        for c0 in range(N - w + 1):
            if fits(grid, cells, r0, c0):
                return True
    return False


def draw_slot(tray, i, picked):
    y = GY + i * SLOT_H
    box(TX, y, TW, SLOT_H - 4, PICK if picked else TRAY)
    if picked:
        box(TX + 2, y + 2, TW - 4, SLOT_H - 8, TRAY)
    p = tray[i]
    if p is None:
        return
    cells = p[0]
    h, w = size(cells)
    x0 = TX + (TW - w * MC) // 2
    y0 = y + (SLOT_H - 4 - h * MC) // 2
    for r, c in cells:
        box(x0 + c * MC, y0 + r * MC, MC - 1, MC - 1, COLORS[p[1]])


def show_score(score):
    box(0, 0, 150, TOP, BAR)
    write(6, 17, "Score " + str(score), TEXT)


def show_best():
    box(W - 110, 0, 110, TOP, BAR)
    s = "Best " + str(best)
    write(W - len(s) * CW - 6, 17, s, GOLD)


def title():
    box(0, 0, W, H, BG)
    for c in range(8):
        box(40 + c * 30, 20, 26, 26, COLORS[c % 8])
        if c % 3 != 1:
            box(40 + c * 30, 50, 26, 26, COLORS[(c + 3) % 8])
    center(104, "GRID POP", GOLD)
    center(128, "Fill rows and columns!", DIM)
    center(148, "Arrows move, [2nd] place", DIM)
    center(166, "[enter] pick another shape", DIM)
    if best > 0:
        center(186, "Best: " + str(best), TEXT)
    center(H - 4, "[enter] play  [clear] quit", TEXT)
    keys_off(0.3)
    return choose()


def clear_lines(grid):
    rows = []
    cols = []
    for r in range(N):
        if min(grid[r]) >= 0:
            rows.append(r)
    for c in range(N):
        full = True
        for r in range(N):
            if grid[r][c] < 0:
                full = False
                break
        if full:
            cols.append(c)
    gone = []
    for r in rows:
        for c in range(N):
            gone.append((r, c))
    for c in cols:
        for r in range(N):
            if (r, c) not in gone:
                gone.append((r, c))
    if not gone:
        return 0
    for r, c in gone:
        cell(r, c, FLASH)
    keys_off(0.15)
    for r, c in gone:
        grid[r][c] = -1
        cell(r, c, EMPTY)
    return len(rows) + len(cols)


def play():
    global best
    grid = []
    for r in range(N):
        grid.append([-1] * N)
    box(0, 0, W, H, BG)
    box(0, 0, W, TOP, BAR)
    score = 0
    show_score(score)
    show_best()
    for r in range(N):
        for c in range(N):
            draw_cell(grid, r, c)
    tray = [new_piece(), new_piece(), new_piece()]
    sel = 0
    for i in range(3):
        draw_slot(tray, i, i == sel)
    cr = 3
    cc = 3
    shown = []       # ghost cells on the board right now
    shown_ok = True

    while True:
        cells = tray[sel][0]
        h, w = size(cells)
        cr = max(0, min(cr, N - h))
        cc = max(0, min(cc, N - w))
        ok = fits(grid, cells, cr, cc)
        want = []
        for r, c in cells:
            want.append((cr + r, cc + c))
        # Redraw only what changed: cells the ghost left, and cells it moved onto.
        for rc in shown:
            if rc not in want:
                draw_cell(grid, rc[0], rc[1])
        g = GHOST[tray[sel][1]] if ok else BAD
        for rc in want:
            if ok != shown_ok or rc not in shown:
                cell(rc[0], rc[1], g)
        shown = want
        shown_ok = ok

        k = 0
        while k == 0:
            k = get_key(0)
        if k == K_CLEAR:
            return score, False
        if k == K_UP:
            cr -= 1
        elif k == K_DOWN:
            cr += 1
        elif k == K_LEFT:
            cc -= 1
        elif k == K_RIGHT:
            cc += 1
        elif k == K_ENTER:
            nxt = sel
            for i in range(1, 4):
                j = (sel + i) % 3
                if tray[j] is not None:
                    nxt = j
                    break
            if nxt != sel:
                draw_slot(tray, sel, False)
                sel = nxt
                draw_slot(tray, sel, True)
                for rc in shown:
                    draw_cell(grid, rc[0], rc[1])
                shown = []
        elif k == K_2ND and ok:
            for r, c in want:
                grid[r][c] = tray[sel][1]
                draw_cell(grid, r, c)
            shown = []
            score += len(cells)
            lines = clear_lines(grid)
            if lines:
                score += 10 * lines * lines
            show_score(score)
            if score > best:
                best = score
                show_best()
            tray[sel] = None
            draw_slot(tray, sel, False)
            if tray[0] is None and tray[1] is None and tray[2] is None:
                tray = [new_piece(), new_piece(), new_piece()]
                for i in range(3):
                    draw_slot(tray, i, False)
            for i in range(3):
                j = (sel + i) % 3
                if tray[j] is not None:
                    sel = j
                    break
            draw_slot(tray, sel, True)
            moves = False
            for p in tray:
                if p is not None and fits_anywhere(grid, p[0]):
                    moves = True
                    break
            if not moves:
                return score, True


def game_over(score):
    box(16, 66, W - 32, 92, GOLD)
    box(18, 68, W - 36, 88, BG)
    center(94, "NO ROOM LEFT", RED)
    if score >= best and score > 0:
        center(118, "Score " + str(score) + "  NEW BEST!", GOLD)
    else:
        center(118, "Score " + str(score) + "  Best " + str(best), TEXT)
    center(144, "[enter] again [clear] menu", DIM)
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
