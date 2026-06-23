import csv
import json
import re
jsonDict = {}

with open('biomecsv.csv', newline="") as csvFile:
    biomeReader = csv.reader(csvFile)
    for row in biomeReader:
        stripped_row = []
        for item in row:
            stripped_row.append(item.strip())
        if stripped_row[0] == "Biome[1]": continue
        friendlyName = stripped_row[0]
        name = stripped_row[0].lower().replace(" ", "")
        humidity = float(stripped_row[6].replace("%", "")) / 100
        tags = stripped_row[8].split(" ")
        jsonDict[name] = {"friendlyName": friendlyName,
                          "name": name,
                          "humidity": humidity,
                          "tags": tags}
print(jsonDict)
with open("biomejson.json", "w") as jsonfile:
    json.dump(jsonDict,jsonfile)

    