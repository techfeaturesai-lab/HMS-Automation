import json

with open('auth_scenarios.json', encoding='utf-8') as f:
    scenarios = json.load(f)

for s in scenarios:
    print("=" * 80)
    print(f"ID: {s['id']} | Title: {s['name']}")
    print(f"Pre-conditions: {s['pre']}")
    print(f"Test Data: {s['data']}")
    print(f"Steps:\n{s['steps']}")
    print(f"Expected:\n{s['expected']}")
