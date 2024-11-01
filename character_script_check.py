text = "латиница или кириллица hello world"

# Определяем, латиница или кириллица
result = []
for char in text:
    if char.isalpha():
        if char.isascii():
            script_type = "Латиница"
        else:
            script_type = "Кириллица"
    else:
        script_type = "Не буква"
    result.append((char, script_type))

# Выводим результат в виде таблицы
print(f"{'Символ':<10} {'Тип'}")
print("-" * 20)
for char, script_type in result:
    print(f"{char:<10} {script_type}")
