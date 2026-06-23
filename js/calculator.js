function initCalculator() {
    cropDropdown.onchange = cropChanged
    biomeDropdown.onchange = calculateCrop
    hydratedCheckbox.addEventListener('change', calculateCrop) 
    fertilizedCheckbox.addEventListener('change', calculateCrop)
    skyCheckbox.addEventListener('change', calculateCrop)
    growthStatField.addEventListener('change', calculateCrop) 
    gainStatField.addEventListener('change', calculateCrop) 
    growthAccelerationUnitCheckbox.addEventListener('change', GAUChanged)
    overclockedGrowthAccelerationUnitCheckbox.addEventListener('change', OGAUChecked)
}

function findGoodBiomes(crop) {
    goodBiomesListTableBody = document.getElementById("goodBiomesList")
    
    let idealBiomes = []
    for (const [biome, data] of Object.entries(biomes)) {
        let nutrients = calculateBiomeNutrients(biome, crop)
        idealBiomes.push([biome, nutrients])
    }
    idealBiomes.sort((a, b) => b[1] - a[1])
    while (goodBiomesListTableBody.firstChild) {
            goodBiomesListTableBody.removeChild(goodBiomesListTableBody.firstChild)
    }
    for ([biome, nutrients] of idealBiomes) {
        if (nutrients == 0) {
            continue;
        }
        element = document.createElement("tr")
        element.class = "goodBiomeRow"

        element.innerHTML = `<td>${biomes[biome].friendlyName}</td>\n<td>${Number.parseFloat(nutrients).toFixed(2)}</td>`
        goodBiomesListTableBody.append(element)
    }
}

function calculateBiomeNutrients(biome, crop, guaranteedMatches = 0) {
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
    return Math.trunc(baseSpeed * growthSpeedMultiplier) // Java truncates when converting from a float to an int. Explicitly truncated here just in case.
}

function calculateFullGrowthsPerHour(growthSpeedMultiplier, growthStat, crop) {
    let growthPerCycle = calculateGrowthPerCycle(growthSpeedMultiplier, growthStat, crop)
    let growthPointsPerGrowth = crops[crop].growthPoints
    let cyclesPerGrowth = Math.ceil(growthPointsPerGrowth / growthPerCycle)
    let cyclesPerHour = 72000 / 256
    let growthsPerHour = cyclesPerHour / cyclesPerGrowth // Leaving as a float since carryover progress is possible.
    return growthsPerHour
}

function calculateDropsPerHarvest(gainStat, crop) {
    let dropRounds = crops[crop].dropMult * Math.pow(1.03, gainStat) // sic, dropMult should be dropRate or something like that. I did not know how this value interacted until now.
    let droppedItems = []
    // console.log(crops[crop].outputs)
    for (output of crops[crop].outputs) {
        averageSuccessfulDropRolls = dropRounds * output.outputChance / 100
        averageGainBonus = averageSuccessfulDropRolls * (gainStat / 100)
        averageDropQuantity = (averageSuccessfulDropRolls * output.quantity) + averageGainBonus // Taken/converted from TileEntityCropSticks.java
        droppedItems.push([averageDropQuantity, output.outputName])
        // console.log(`[${output.quantity}, ${output.outputName}, ${output.outputChance} - ${dropRounds}]`)
        console.log(`[${averageSuccessfulDropRolls}, ${averageGainBonus}, ${averageDropQuantity}, ${(gainStat / 100)}]`)
    }
    return droppedItems
}

function calculateDropsPerHour(gainStat, growthStat, crop, growthSpeedMultiplier) {
    growthCount = calculateFullGrowthsPerHour(growthSpeedMultiplier, growthStat, crop)
    fullCropGrowths.innerHTML = growthSpeedMultiplier > 0.0 ? Number.parseFloat(growthCount).toFixed(4) : `<span style=\"color:red;font-weight:800\">${Number.parseFloat(growthCount).toFixed(4)} - CROP CAN GET SICK.</span>`
    let drops = calculateDropsPerHarvest(gainStat, crop)
    fullHourDrops = []
    for ([quantity, dropName] of drops) {
        fullHourDrops.push([quantity*growthCount, dropName])
    }
    return fullHourDrops
}

function updateDropTable(tableNode, drops) {
    while (tableNode.firstChild) {
            tableNode.removeChild(tableNode.firstChild)
    }
    for ([quantity, drop] of drops) {
        element = document.createElement("tr")
        element.class = "dropRow"

        element.innerHTML = `<td>${drop}</td>\n<td>${Number.parseFloat(quantity).toFixed(5)}</td>`
        tableNode.append(element)
    }
}

function updateDropTables(crop, biome) {
    let waterBonus = hydratedCheckbox.checked ? 10 : 0
    let fertilizerBonus = fertilizedCheckbox.checked ? 10 : 0
    let skyBonus = skyCheckbox.checked ? 2 : 0

    let totalNutrients = calculateBiomeNutrients(biome, crop) + waterBonus + fertilizerBonus + skyBonus + 5
    let nutrientSupply = totalNutrients * 5
    let nutrientDemand = crops[crop].tier * 10

    let growthSpeedMultiplier = calculateGrowthSpeedMultiplier(nutrientSupply, nutrientDemand)

    let canBecomeSick = (nutrientDemand - nutrientSupply > 25)
    let growthStat = parseInt(growthStatField.value)
    let gainStat = parseInt(gainStatField.value)

    let growthSpeed = calculateGrowthPerCycle(growthSpeedMultiplier, growthStat, crop)




    updateDropTable(dropPerHourList, calculateDropsPerHour(gainStat, growthStat, crop, growthSpeedMultiplier))
    
    updateDropTable(dropPerHarvestList, calculateDropsPerHarvest(gainStat, crop))
    // console.log(`${totalNutrients} - ${nutrientSupply} - ${nutrientDemand} - ${growthSpeedMultiplier} - ${canBecomeSick}`)    
}

function GAUChanged() {
    if (parseInt(growthAccelerationUnitField.value) > 0) {
        overclockedGrowthAccelerationUnitCheckbox.disabled = true
    } else {
        overclockedGrowthAccelerationUnitCheckbox.disabled = false
    }
    calculateCrop()
}

function OGAUChecked() {
    if (overclockedGrowthAccelerationUnitCheckbox.checked) {
        growthAccelerationUnitCheckbox.disabled = true
    } else {
        growthAccelerationUnitCheckbox.disabled = false
    }
    calculateCrop()
}

function calculateIFCrops(crop, biome) {
    let environmentEnhancements = parseInt(environmentalEnhancementUnitField.value)
    let biomeBonus = calculateBiomeNutrients(biome, crop, environmentEnhancements)
    console.log(biomeBonus)
}





function calculateCrop() {
    let crop = cropDropdown.children[cropDropdown.selectedIndex].id
    let biome = biomeDropdown.children[biomeDropdown.selectedIndex].id
    updateDropTables(crop, biome)

    if(machineDropdown.children[machineDropdown.selectedIndex].id != "None") {
        calculateIFCrops(crop, biome)
    }
}

initCalculator()
cropChanged()