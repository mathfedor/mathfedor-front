import json, sys
sys.stdout.reconfigure(encoding='utf-8')

with open('src/mocks/data/book-extras-5.data.json', 'r', encoding='utf-8') as f:
    d = json.load(f)

first_ex = d['LEVEL_EXAMPLES']['01a_adicion_t0-n1'][0]
print(json.dumps(first_ex, indent=2, ensure_ascii=False))
