import json

with open('leave_scenarios_dump.json', 'r', encoding='utf-8') as f:
    scenarios = json.load(f)

for s in scenarios:
    print("=" * 70)
    print(f"[{s['id']}] {s['name']}")
    print(f"Description: {s['description']}")
    print(f"Pre-conditions: {s['preconditions']}")
    print(f"Test Data: {s['test_data']}")
    print(f"Steps:\n{s['steps']}")
    print(f"Expected:\n{s['expected']}")
