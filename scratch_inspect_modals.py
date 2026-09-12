import sys, re
sys.stdout.reconfigure(encoding='utf-8')
with open(r'c:\Users\shelo\OneDrive\Documentos\projects\mathfedor-front\public\tercero\MatematicasDeFedor_3°.html', 'r', encoding='utf-8', errors='ignore') as f:
    text = f.read()

funcs = ['openShop', 'openEspacial', 'openDiario', 'openExamenFinal', 'openStickerBook', 'openMinigamePicker']

for fn in funcs:
    print('==============================')
    print('FUNCTION:', fn)
    print('==============================')
    # find where it is defined
    idx = text.find('function ' + fn)
    if idx == -1:
        idx = text.find('window.' + fn)
    if idx != -1:
        print(text[idx:idx+1200])
        print('\n')
