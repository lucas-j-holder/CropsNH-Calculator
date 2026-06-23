import csv
import json
import re
jsonDict = {}

with open('industrialfarmstats.csv', newline="") as csvFile:
    industrialFarmReader = csv.DictReader(csvFile)

    for row in industrialFarmReader:
        key = row[''].title().replace(" ", "")
        for rowkey in list(row.keys()):
            newRowKey = rowkey.strip()
            if newRowKey in [""]: continue
            rowdict = jsonDict.get(newRowKey, {})

            item = row[rowkey]
            if item == "": continue

            if key in ["MachineTier", "Length", "Glass", "SeedBeds", "UpgradeUnits", "SeedCapacity"]:
                item = int(item)
            elif key in ["Water/Cycle", "Fertilizer/Cycle"]:
                item = int(item.strip().replace(",", "").replace("L", ""))
            elif key in ["SeedBedBonus"]:
                item = float(item.split(".")[0])/100

            rowdict[key] = item
            jsonDict[newRowKey] = rowdict
print(jsonDict)
with open("industrialfarmstats.json", "w") as jsonfile:
    json.dump(jsonDict,jsonfile)