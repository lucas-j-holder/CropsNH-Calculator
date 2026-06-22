function initCalculator() {
    cropDropdown.onchange = cropChanged
    biomeDropdown.onchange = calculateCrop
    hydratedCheckbox.addEventListener('change', calculateCrop) 
    fertilizedCheckbox.addEventListener('change', calculateCrop)
    skyCheckbox.addEventListener('change', calculateCrop)
    growthStatField.addEventListener('change', calculateCrop) 
    gainStatField.addEventListener('change', calculateCrop) 
    resistanceStatField.addEventListener('change', calculateCrop) 
}

function findGoodBiomes(crop) {
    goodBiomesListDiv = document.getElementById("goodBiomesList")
    
    let idealBiomes = []
    for (const [biome, data] of Object.entries(biomes)) {
        let nutrients = calculateBiomeNutrients(biome, crop)
        idealBiomes.push([biome, nutrients])
    }
    idealBiomes.sort((a, b) => b[1] - a[1])
    while (goodBiomesListDiv.firstChild) {
            goodBiomesListDiv.removeChild(goodBiomesListDiv.firstChild)
    }
    for ([biome, nutrients] of idealBiomes) {
        if (nutrients == 0) {
            continue;
        }
        element = document.createElement("p")
        element.class = "goodBiome"
        element.innerHTML = `${biomes[biome].friendlyName} - ${nutrients}`
        goodBiomesListDiv.append(element)
    }
}

function calculateBiomeNutrients(biome, crop) {
    cropBiomePreferences = crops[crop]["biomePreferences"]
    matchingTags = 0
        for (tag of cropBiomePreferences) {
            if (biomes[biome].tags.includes(tag.toUpperCase())) {
                matchingTags = matchingTags + 1
            }
        }
    return calculateBiomeNutrientsFromTagMatches(biome, matchingTags)
}

function calculateBiomeNutrientsFromTagMatches(biome, matches) {
    let humidityValue = calculateBiomeNutrientsFromHumidity(biome, biomes[biome].humidity)
    return Math.max(humidityValue, Math.min(2, matches) * 14)
}

function calculateBiomeNutrientsFromHumidity(biome, humidity) {
    let nutrients = Math.max(0, Math.min(1.0, (humidity - 0.5) / (0.8-0.5) )) * 14 // Formula from the wiki, it appears that a biome has to have 51% humidity or higher to get any nutrient score from biome without matching tags.
    return nutrients
}

function calculateGrowthSpeedMultiplier (nutrientSupply, nutrientDemand) {
    if (nutrientSupply == nutrientDemand) {
        return 1.0
    } else if (nutrientSupply > nutrientDemand) {
        return 1.0 + ((nutrientSupply - nutrientDemand) / 100)
    } else {
        return 1.0 - (((nutrientDemand - nutrientSupply)*4)/100)
    }
}

function cropChanged() {
    let crop = cropDropdown.children[cropDropdown.selectedIndex].id
    findGoodBiomes(crop)
    calculateCrop()
}

function calculateGrowthPerCycle(growthSpeedMultiplier, growthStat, crop) {
    let baseSpeed = 6 + growthStat
    console.log(Math.trunc(baseSpeed * growthSpeedMultiplier))
    return Math.trunc(baseSpeed * growthSpeedMultiplier) // Java truncates when converting from a float to an int. Explicitly truncated here just in case.
}

function calculateFullGrowthsPerHour(growthSpeedMultiplier, growthStat, crop) {
    let growthPerCycle = calculateGrowthPerCycle(growthSpeedMultiplier, growthStat, crop)
    let growthPointsPerGrowth = crops[crop].growthPoints
    let cyclesPerGrowth = Math.ceil(growthPointsPerGrowth / growthPerCycle)
    let cyclesPerHour = 72000 / 256
    console.log(cyclesPerHour)
    let growthsPerHour = cyclesPerHour / cyclesPerGrowth // Leaving as a float since carryover progress is possible.
    return growthsPerHour
}

function calculateCrop() {
    let crop = cropDropdown.children[cropDropdown.selectedIndex].id
    let biome = biomeDropdown.children[biomeDropdown.selectedIndex].id
    let waterBonus = hydratedCheckbox.checked ? 10 : 0
    let fertilizerBonus = fertilizedCheckbox.checked ? 10 : 0
    let skyBonus = skyCheckbox.checked ? 2 : 0

    let totalNutrients = calculateBiomeNutrients(biome, crop) + waterBonus + fertilizerBonus + skyBonus + 5
    let nutrientSupply = totalNutrients * 5
    let nutrientDemand = crops[crop].tier * 10

    let growthSpeedMultiplier = calculateGrowthSpeedMultiplier(nutrientSupply, nutrientDemand)

    let canBecomeSick = (nutrientDemand - nutrientSupply > 25)
    let growthStat = parseInt(growthStatField.value)
    let gainStat = parseInt(growthStatField.value)
    let resistanceStat = parseInt(growthStatField.value)

    let growthSpeed = calculateGrowthPerCycle(growthSpeedMultiplier, growthStat, crop)
    console.log(calculateFullGrowthsPerHour(growthSpeedMultiplier, growthStat, crop))

    console.log(`${totalNutrients} - ${nutrientSupply} - ${nutrientDemand} - ${growthSpeedMultiplier} - ${canBecomeSick}`)    
}

initCalculator()
cropChanged()