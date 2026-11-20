# BLACKJAK - Blackjack for the TI-84 Evo (Python)
# (c) 2026 Brady Krupa and Arjun Bhanderi. All rights reserved. programsforyou.com
# Get closer to 21 than the dealer without going over. Left/right change your bet, [2nd] deals.
# In a hand: [2nd] hit, [enter] stand, [down] double. [clear] quits.
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

FELT = (18, 96, 58)
BAR = (10, 60, 36)
CARD = (250, 250, 245)
EDGE = (40, 40, 40)
BACK = (40, 80, 190)
BACK2 = (90, 130, 230)
REDC = (205, 30, 40)
BLACKC = (20, 20, 20)
TEXT = (240, 245, 240)
DIM = (170, 210, 185)
GOLD = (255, 210, 70)
RED = (255, 110, 110)

CARDW = 30
CARDH = 42
STEP = 34
DEALER_Y = 46
PLAYER_Y = 120
START = 100
RANKS = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"]
SUITS = ["H", "D", "C", "S"]
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


def wait_for(keys):
    while True:
        k = get_key(0)
        if k in keys:
            return k


def new_deck():
    deck = []
    for s in SUITS:
        for r in RANKS:
            deck.append((r, s))
    for i in range(len(deck) - 1, 0, -1):
        j = random.randint(0, i)
        deck[i], deck[j] = deck[j], deck[i]
    return deck


def value(hand):
    total = 0
    aces = 0
    for r, s in hand:
        if r == "A":
            aces += 1
            total += 11
        elif r in ("J", "Q", "K"):
            total += 10
        else:
            total += int(r)
    while total > 21 and aces > 0:
        total -= 10
        aces -= 1
    return total


def is_blackjack(hand):
    return len(hand) == 2 and value(hand) == 21


def draw_card(x, y, card):
    box(x, y, CARDW, CARDH, EDGE)
    box(x + 1, y + 1, CARDW - 2, CARDH - 2, CARD)
    r, s = card
    c = REDC if s in ("H", "D") else BLACKC
    write(x + 3, y + 15, r, c)
    write(x + CARDW - 13, y + CARDH - 4, s, c)


def draw_back(x, y):
    box(x, y, CARDW, CARDH, EDGE)
    box(x + 1, y + 1, CARDW - 2, CARDH - 2, BACK)
    for i in range(3):
        box(x + 6, y + 7 + i * 11, CARDW - 12, 5, BACK2)


def card_x(i, n):
    # Cards are centered; a long hand squeezes together so it always fits.
    step = STEP if n <= 8 else (W - 40 - CARDW) // (n - 1)
    left = (W - (step * (n - 1) + CARDW)) // 2
    return left + i * step


def draw_hand(y, hand, hide_second):
    box(0, y, W, CARDH + 1, FELT)
    for i in range(len(hand)):
        x = card_x(i, len(hand))
        if hide_second and i == 1:
            draw_back(x, y)
        else:
            draw_card(x, y, hand[i])


def show_label(y, label, total):
    box(0, y - 17, W, 15, FELT)
    s = label if total is None else label + " " + str(total)
    write(8, y - 4, s, DIM)


def show_bar(chips, bet):
    box(0, 0, W, TOP, BAR)
    write(6, 17, "Chips " + str(chips), TEXT)
    s = "Bet " + str(bet)
    write(W - len(s) * CW - 6, 17, s, GOLD)


def hint(s):
    box(0, H - 22, W, 22, FELT)
    center(H - 6, s, DIM)


def message(s, c):
    # Below your cards, so your total stays visible.
    box(0, 164, W, 24, FELT)
    center(181, s, c)


def title():
    box(0, 0, W, H, FELT)
    draw_card(96, 28, ("A", "S"))
    draw_back(130, 28)
    draw_card(164, 28, ("K", "H"))
    center(102, "BLACKJACK", GOLD)
    center(126, "Get close to 21, not over!", TEXT)
    center(146, "[2nd] hit  [enter] stand", DIM)
    center(164, "[down] double your bet", DIM)
    if best > 0:
        center(184, "Most chips: " + str(best), GOLD)
    center(H - 4, "[enter] play  [clear] quit", TEXT)
    keys_off(0.3)
    return wait_for((K_ENTER, K_2ND, K_CLEAR)) != K_CLEAR


def betting(chips, bet):
    # Returns the bet, or 0 to quit.
    bet = max(5, min(bet, chips))
    show_bar(chips, bet)
    message("Place your bet", GOLD)
    hint("left/right bet  [2nd] deal")
    while True:
        k = get_key(0)
        if k == K_CLEAR:
            return 0
        if k == K_LEFT or k == K_RIGHT or k == K_DOWN or k == K_UP:
            step = 5 if (k == K_LEFT or k == K_RIGHT) else 25
            nb = bet - step if (k == K_LEFT or k == K_DOWN) else bet + step
            nb = max(5, min(nb, chips))
            if nb != bet:
                bet = nb
                show_bar(chips, bet)
        if k == K_2ND or k == K_ENTER:
            return bet


def play_hand(deck, chips, bet):
    # Plays one hand. Returns (chips after the hand, bet used), or (-1, bet) to quit.
    if len(deck) < 15:
        deck[:] = new_deck()
        message("Shuffling...", DIM)
        keys_off(0.6)
    player = [deck.pop(), deck.pop()]
    dealer = [deck.pop(), deck.pop()]
    box(0, TOP, W, H - TOP, FELT)
    show_bar(chips, bet)
    show_label(DEALER_Y, "Dealer", None)
    draw_hand(DEALER_Y, dealer, True)
    show_label(PLAYER_Y, "You", value(player))
    draw_hand(PLAYER_Y, player, False)

    if is_blackjack(player) or is_blackjack(dealer):
        draw_hand(DEALER_Y, dealer, False)
        show_label(DEALER_Y, "Dealer", value(dealer))
        if is_blackjack(player) and is_blackjack(dealer):
            return finish(chips, bet, 0, "Both blackjack: push")
        if is_blackjack(player):
            return finish(chips, bet, bet * 3 // 2, "BLACKJACK! +" + str(bet * 3 // 2))
        return finish(chips, bet, -bet, "Dealer blackjack -" + str(bet))

    doubled = False
    while value(player) < 21:
        can_double = len(player) == 2 and chips >= bet * 2
        hint("[2nd] hit [enter] stand" + (" [dn] x2" if can_double else ""))
        k = wait_for((K_2ND, K_UP, K_ENTER, K_DOWN, K_CLEAR))
        if k == K_CLEAR:
            return -1, bet
        if k == K_ENTER:
            break
        if k == K_DOWN:
            if not can_double:
                continue
            bet *= 2
            doubled = True
            show_bar(chips, bet)
        player.append(deck.pop())
        draw_hand(PLAYER_Y, player, False)
        show_label(PLAYER_Y, "You", value(player))
        if doubled:
            break

    hint("")
    if value(player) > 21:
        return finish(chips, bet, -bet, "Bust! -" + str(bet))

    # The dealer shows the hidden card and must hit until 17 or more.
    draw_hand(DEALER_Y, dealer, False)
    show_label(DEALER_Y, "Dealer", value(dealer))
    keys_off(0.6)
    while value(dealer) < 17:
        dealer.append(deck.pop())
        draw_hand(DEALER_Y, dealer, False)
        show_label(DEALER_Y, "Dealer", value(dealer))
        keys_off(0.6)
    p = value(player)
    d = value(dealer)
    if d > 21:
        return finish(chips, bet, bet, "Dealer busts! +" + str(bet))
    if p > d:
        return finish(chips, bet, bet, "You win! +" + str(bet))
    if p < d:
        return finish(chips, bet, -bet, "Dealer wins -" + str(bet))
    return finish(chips, bet, 0, "Push (tie)")


def finish(chips, bet, change, text):
    chips += change
    c = GOLD if change > 0 else (RED if change < 0 else TEXT)
    message(text, c)
    show_bar(chips, bet)
    hint("[2nd] next hand  [clear] quit")
    keys_off(0.4)
    if wait_for((K_2ND, K_ENTER, K_CLEAR)) == K_CLEAR:
        return -1, bet
    return chips, bet


def out_of_chips():
    box(16, 70, W - 32, 80, GOLD)
    box(18, 72, W - 36, 76, FELT)
    center(98, "OUT OF CHIPS", RED)
    center(122, "[enter] start over", TEXT)
    center(140, "[clear] menu", DIM)
    keys_off(0.6)
    return wait_for((K_ENTER, K_2ND, K_CLEAR)) != K_CLEAR


def play():
    global best
    chips = START
    bet = 10
    deck = new_deck()
    while True:
        box(0, TOP, W, H - TOP, FELT)
        bet = betting(chips, bet)
        if bet == 0:
            return
        chips_after, used = play_hand(deck, chips, bet)
        if chips_after < 0:
            return
        chips = chips_after
        if chips > best:
            best = chips
        bet = min(10 if used > chips else used, max(chips, 5))
        if chips <= 0:
            if not out_of_chips():
                return
            chips = START
            bet = 10


def main():
    while title():
        play()
    box(0, 0, W, H, FELT)
    center(110, "Thanks for playing!", TEXT)


main()
