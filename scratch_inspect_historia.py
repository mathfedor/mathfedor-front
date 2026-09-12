import sys
sys.stdout.reconfigure(encoding='utf-8')
with open(r'c:\Users\shelo\OneDrive\Documentos\projects\mathfedor-front\public\tercero\MatematicasDeFedor_3°.html', 'r', encoding='utf-8', errors='ignore') as f:
    text = f.read()

idx = text.find('id="modalHistoriaFedor"')
if idx != -1:
    print(text[idx-50:idx+2500])
