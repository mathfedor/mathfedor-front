import sys
sys.stdout.reconfigure(encoding='utf-8')
with open(r'c:\Users\shelo\OneDrive\Documentos\projects\mathfedor-front\public\tercero\MatematicasDeFedor_3°.html', 'r', encoding='utf-8', errors='ignore') as f:
    text = f.read()

modals = ['modalEstandares', 'modalExplicacion', 'modalHistoriaFedor', 'modalMisionesD', 'modalMaraton', 'modalGalaxia3D', 'modalMinijuegos', 'modalDefiniciones']

for m in modals:
    print('========================================')
    print('MODAL:', m)
    print('========================================')
    idx = text.find('id="' + m + '"')
    if idx == -1:
        idx = text.find("id='" + m + "'")
    if idx != -1:
        print(text[idx-50:idx+1500])
        print('\n')
