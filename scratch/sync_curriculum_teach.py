import json, sys
sys.stdout.reconfigure(encoding='utf-8')

with open(r'public/quinto/MatematicasDeFedor_5.html', 'r', encoding='utf-8', errors='ignore') as f:
    text = f.read()

idx_start = text.find('const UNITS = [') + 14
idx_end = text.find(';\n', idx_start)

raw_units_json = text[idx_start:idx_end]
units = json.loads(raw_units_json)

print('Loaded units successfully! Count:', len(units))

# Read current book-curriculum-5.data.json
with open('src/mocks/data/book-curriculum-5.data.json', 'r', encoding='utf-8') as f:
    curr_data = json.load(f)

# Update topics in curr_data with teach, formula, std from HTML units
for ui, u in enumerate(units):
    if ui < len(curr_data['UNITS']):
        curr_u = curr_data['UNITS'][ui]
        for ti, t in enumerate(u.get('topics', [])):
            if ti < len(curr_u.get('topics', [])):
                curr_t = curr_u['topics'][ti]
                if 'teach' in t:
                    curr_t['teach'] = t['teach']
                if 'formula' in t:
                    curr_t['formula'] = t['formula']
                if 'std' in t:
                    curr_t['std'] = t['std']

# Write back
with open('src/mocks/data/book-curriculum-5.data.json', 'w', encoding='utf-8') as f:
    json.dump(curr_data, f, ensure_ascii=False, indent=2)

print('Updated book-curriculum-5.data.json successfully with teach, formula, std!')
