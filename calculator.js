function initCalculator() {
    cropDropdown.onchange = calculateCrop
    biomeDropdown.onchange = calculateCrop
}

function findGoodBiomes(crop) {
    goodBiomesListDiv = document.getElementById("goodBiomesList")
    cropBiomePreferences = crops[crop]["biomePreferences"]
    let idealBiomes = []
    for (const [biome, data] of Object.entries(biomes)) {
        matchingTags = 0
        for (tag of cropBiomePreferences) {
            if (data.tags.includes(tag.toUpperCase())) {
                matchingTags = matchingTags + 1
            }
        }
        let nutrients = calculateBiomeNutrientsFromTagMatches(biome, matchingTags)
        idealBiomes.push([biome, nutrients])
    }
    idealBiomes.sort((a, b) => b[1] - a[1])

    for ([biome, nutrients] of idealBiomes) {
        element = document.createElement("p")
        element.class = "goodBiome"
        element.innerHTML = `${biomes[biome].friendlyName} - ${nutrients}`
        goodBiomesListDiv.append(element)
    }
    console.log(idealBiomes)
}

function calculateBiomeNutrientsFromTagMatches(biome, matches) {
    if (matches == 0) {
        return calculateBiomeNutrientsFromHumidity(biome, biomes[biome].humidity)
    } else {
        return Math.min(2, matches) * 14
    }
}

function calculateBiomeNutrientsFromHumidity(biome, humidity) {
    let nutrients = Math.max(0, Math.min(1.0, (humidity - 0.5) / (0.8-0.5) )) * 14 // Formula from the wiki, it appears that a biome has to have 51% humidity or higher to get any nutrient score from biome without matching tags.
    return nutrients
}

function calculateCrop() {
    let crop = cropDropdown.children[cropDropdown.selectedIndex].id
    findGoodBiomes(crop)
    console.log(crop)
}

initCalculator()