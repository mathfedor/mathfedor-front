import sys, json, re
sys.stdout.reconfigure(encoding='utf-8')
with open(r'c:\Users\shelo\OneDrive\Documentos\projects\mathfedor-front\public\tercero\MatematicasDeFedor_3°.html', 'r', encoding='utf-8', errors='ignore') as f:
    text = f.read()

vars_to_find = ['SHOP_V2', 'STICKERS', 'EXPL_DATA', 'estData', 'defData', 'DIARIO', 'ESPACIAL']

for v in vars_to_find:
    idx = text.find(v)
    if idx != -1:
        print('=== ' + v + ' ===')
        print(text[idx:idx+600])
        print('\n')
