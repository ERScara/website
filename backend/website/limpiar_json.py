import json

with open("data.json", "r", encoding="latin-1'") as f:
    data = json.load(f)

with open("data_clean.json", "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=4)

print("¡Archivo data_clean.json generado con éxito!")


