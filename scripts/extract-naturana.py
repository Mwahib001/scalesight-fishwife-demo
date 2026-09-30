"""Offline, reproducible transcription from pdftotext -layout; never run in the app."""
import json, re
from pathlib import Path
from collections import Counter
text = Path('docs/spec/NATURANA_technical_spec.txt').read_text()
pages = text.split('\f')
def section(a,b): return '\n'.join(pages[a-1:b])
# Independent public mapping from Appendix B, pp. 98–102.
public = []
for line in section(98,102).splitlines():
    m=re.match(r'\s+(\w{2}-(?:BRA|BTM))\s+(\S+)\s+(U-\S+)\s+(\d{13})\s+(.+)',line)
    if m:
        product,size,sku,barcode,nat=m.groups()
        public.append(dict(productId=product,size=size,publicSku=sku,barcode=barcode,naturanaPublicSku=None if nat.startswith('Not publicly') else nat.strip()))
assert len(public)==85
Path('tests/fixtures/naturana-public.json').write_text(json.dumps(public,indent=2)+'\n')
# Independently joined operating rows from Appendix C, pp. 103–108.
rows=[]
for line in section(103,108).splitlines():
    m=re.match(r'\s+(\w{2}-(?:BRA|BTM))\s+/\s+(\S+)\s+(U-\S+)\s+(\d{13})\s+((?:\d+\s+){7})(\d+\.\d)\s+(.+)',line)
    if m:
        product,size,sku,barcode,numbers,woc,action=m.groups()
        action=action.strip().replace(' ','_')
        if action=='REDUCE_NEXT': action='REDUCE_NEXT_BUY'
        row=dict(productId=product,size=size,publicSku=sku,barcode=barcode)
        row.update(zip(['onHand','incoming','grossLaunchSales','returns','exchangeOut','exchangeIn','forecastWeeklyUnits'],map(int,numbers.split())))
        row.update(sourceWeeksOfCover=float(woc),analystRecommendation=action)
        rows.append(row)
assert len(rows)==85, len(rows)
for row,p in zip(rows,public):
    assert all(row[k]==p[k] for k in ['productId','size','publicSku','barcode'])
# Cross-check every operating value against the first presentation, pp. 23–29.
original=[]
for line in section(23,29).splitlines():
    m=re.match(r'\s+(\S+)\s+((?:\d+\s+){7})(\d+\.\d)\s+(BUY DEEPER|REPLENISH|INVESTIGATE|WATCH|HOLD|REDUCE NEXT)',line)
    if m:
        size,numbers,woc,action=m.groups()
        original.append((size,list(map(int,numbers.split())),float(woc),action.replace(' ','_')+('_BUY' if action=='REDUCE NEXT' else '')))
assert len(original)==85
for r,(size,nums,woc,action) in zip(rows,original):
    assert r['size']==size and r['sourceWeeksOfCover']==woc and r['analystRecommendation']==action
    assert list(r.values())[4:11]==nums
Path('src/data/naturana.rows.ts').write_text('// Transcribed from PDF Appendix C (pp. 103–108); cross-checked with pp. 23–29.\nimport type { OperatingRow } from "./naturana.types";\nexport const operatingRows: readonly OperatingRow[] = '+json.dumps(rows,indent=2)+';\n')
Path('tests/fixtures/naturana-operating.json').write_text(json.dumps(rows,indent=2)+'\n')
# Preserve exact page copy with source page numbers, without running footer text.
copy=[]
for i in list(range(39,41))+list(range(41,75))+[91]:
    body=re.sub(r'\nScaleSight × NATURANA \| Technical Specification[^\n]*','',pages[i]).strip()
    body=re.sub(r'\n{3,}','\n\n',body)
    copy.append('## PDF page '+str(i+1)+'\n\n'+body+'\n')
Path('docs/spec/PAGE_COPY.md').write_text('# Verbatim PDF page copy\n\n'+ '\n'.join(copy))
print('Verified 85 rows across both source presentations and independent public identifiers.')
print(dict(Counter(r['analystRecommendation'] for r in rows)))
