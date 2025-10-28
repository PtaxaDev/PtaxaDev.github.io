import os

# Путь к папке — там, где находится скрипт
folder_path = os.path.dirname(os.path.abspath(__file__))

# Получаем список файлов в папке
files = [f for f in os.listdir(folder_path) if os.path.isfile(os.path.join(folder_path, f))]

# Сортируем файлы по имени (по желанию)
files.sort()

# Переименовываем файлы в 1, 2, 3… с сохранением расширений
for index, filename in enumerate(files, start=1):
    old_path = os.path.join(folder_path, filename)
    extension = os.path.splitext(filename)[1]
    new_filename = f"{index}{extension}"
    new_path = os.path.join(folder_path, new_filename)
    
    os.rename(old_path, new_path)
    print(f"{filename} -> {new_filename}")

print("Готово!")
