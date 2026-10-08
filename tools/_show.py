import sys
p = sys.argv[1]
a = int(sys.argv[2]); b = int(sys.argv[3])
lines = open(p, encoding="utf-8").read().splitlines()
for i in range(a, min(b, len(lines))):
    ln = lines[i]
    safe = "".join(ch if ord(ch) < 128 else "." for ch in ln)
    sys.stdout.buffer.write(("%4d %s\n" % (i + 1, safe)).encode("utf-8"))
