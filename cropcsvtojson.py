import csv
import json
jsonDict = {}

with open('cropcsv.csv', newline="") as csvFile:
    cropReader = csv.reader(csvFile)
    for row in cropReader:
        stripped_row = []
        for item in row:
            stripped_row.append(item.strip())
        if stripped_row[0] == "Tier": continue
        tier = stripped_row[0]
        friendlyName = stripped_row[1]
        name = stripped_row[1].lower().replace(" ", "")
        soil = stripped_row[2]
        seedBed = stripped_row[3]
        growthPoints = int(stripped_row[4])
        biomePreferences = stripped_row[5].split(", ")
        requirements = stripped_row[6]
        dropMult = float(stripped_row[7].replace("x", ""))
        outputs = stripped_row[8].split(", ")
        dissectedOutputsArray = {}
        for output in outputs:

        jsonDict[name] = {"tier": tier,
                          "friendlyname": friendlyName,
                          "name": name,
                          "soil": soil,
                          "seedbed": seedBed,
                          "growthpoints": growthPoints,
                          "biomepreferences": biomePreferences,
                          "requirements": requirements,
                          "dropmult": dropMult,
                          "outputs": outputs}
print(jsonDict)
with open("cropjson.json", "w") as jsonfile:
    json.dump(jsonDict,jsonfile)