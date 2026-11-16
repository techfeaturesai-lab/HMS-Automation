import openpyxl
import json

wb = openpyxl.load_workbook('test_scenarios.xlsx', data_only=True)
sheet = wb['Authentication & Security']
rows = []
for r in range(2, sheet.max_row + 1):
    sid = sheet.cell(r, 1).value
    name = sheet.cell(r, 2).value
    desc = sheet.cell(r, 3).value
    pre = sheet.cell(r, 4).value
    data = sheet.cell(r, 5).value
    steps = sheet.cell(r, 6).value
    expected = sheet.cell(r, 7).value
    if sid:
        rows.append({
            'id': sid,
            'name': name,
            'desc': desc,
            'pre': pre,
            'data': data,
            'steps': steps,
            'expected': expected
        })

print(f"Total scenarios found: {len(rows)}")
with open('auth_scenarios.json', 'w', encoding='utf-8') as f:
    json.dump(rows, f, indent=2)

for item in rows:
    print(f"{item['id']} | {item['name']}")
