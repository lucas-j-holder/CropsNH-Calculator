import csv
import json
jsondict = {}

with open('cropcsv.csv', newline="") as csvfile:
    cropreader = csv.reader(csvfile)
    for row in cropreader:
        stripped_row = []
        for item in row:
            stripped_row.append(item.strip())
        if stripped_row[0] == "Tier": continue
        tier = stripped_row[0]
        friendlyname = stripped_row[1]
        name = stripped_row[1].lower().replace(" ", "")
        soil = stripped_row[2]
        seedbed = stripped_row[3]
        growthpoints = int(stripped_row[4])
        biomepreferences = stripped_row[5].split(", ")
        requirements = stripped_row[6]
        dropmult = float(stripped_row[7].replace("x", ""))
        outputs = stripped_row[8]
        jsondict[name] = {"tier": tier,
                          "friendlyname": friendlyname,
                          "name": name,
                          "soil": soil,
                          "seedbed": seedbed,
                          "growthpoints": growthpoints,
                          "biomepreferences": biomepreferences,
                          "requirements": requirements,
                          "dropmult": dropmult,
                          "outputs": outputs}
print(jsondict)
with open("cropjson.json", "w") as jsonfile:
    json.dump(jsondict,jsonfile)