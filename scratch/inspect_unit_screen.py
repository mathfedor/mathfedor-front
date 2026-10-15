import sys
sys.stdout.reconfigure(encoding='utf-8')

with open(r'public/quinto/MatematicasDeFedor_5.html', 'r', encoding='utf-8', errors='ignore') as f:
    text = f.read()

idx = 8700724
print(text[idx:idx+2500])
