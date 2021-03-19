import json
with open(r"C:\Users\ZJX\Desktop\a.txt") as file:
    for i in file.readlines():
        j = i

a = json.loads(j[1:-1])

print(a)
print(type(a))

