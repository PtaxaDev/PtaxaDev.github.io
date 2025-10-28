import os

# Путь к папке с изображениями
base_folder = r"public\assets\images"

# Проходим рекурсивно по всем папкам
for root, dirs, files in os.walk(base_folder):
    # Берём только .png файлы
    png_files = [f for f in files if f.lower().endswith('.png')]
    
    if not png_files:
        continue  # если нет .png, пропускаем папку

    png_files.sort()  # сортируем по имени
    print(f"\nПапка: {root}")
    print("Найдено файлов:", png_files)

    # Временные имена, чтобы избежать конфликтов
    temp_names = []
    for i, filename in enumerate(png_files, start=1):
        temp_name = f"temp_{i}.png"
        os.rename(os.path.join(root, filename), os.path.join(root, temp_name))
        temp_names.append(temp_name)

    # Окончательное переименование
    for i, temp_name in enumerate(temp_names, start=1):
        new_name = f"{i}.png"
        os.rename(os.path.join(root, temp_name), os.path.join(root, new_name))
        print(f"{temp_name} -> {new_name}")

print("\nГотово! Все папки обработаны.")
