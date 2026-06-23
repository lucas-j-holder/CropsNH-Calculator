const cropDropdown = document.getElementById("cropDropdown")
const biomeDropdown = document.getElementById("biomeDropdown")
const hydratedCheckbox = document.getElementById("hydrated")
const fertilizedCheckbox = document.getElementById("fertilized")
const skyCheckbox = document.getElementById("canSeeSky")
const growthStatField = document.getElementById("growthStat")
const gainStatField = document.getElementById("gainStat")

const dropPerHarvestList = document.getElementById("dropPerHarvestList")
const dropPerHourList = document.getElementById("dropPerHourList")

const fullCropGrowths = document.getElementById("fullCropGrowths")

const machineDropdown = document.getElementById("machineDropdown")
const overclockDropdown = document.getElementById("overclockDropdown")
const growthAccelerationUnitCheckbox = document.getElementById("growthAccelerationUnit")
const overclockedGrowthAccelerationUnitCheckbox = document.getElementById("overclockedGrowthAccelerationUnit")
const fertilizationUnitCheckbox = document.getElementById("fertilizationUnit")
//Checking the source of CropsNH (MTEIndustrialFarm.java), Environmental Enhancement Units allow for a module to be inserted to add a biome tag when nutrients is checked. I will treat this like a guaranteed biome tag match.
const environmentalEnhancementUnitField = document.getElementById("environmentalEnhancementUnit")
const growthAccelerationUnitField = document.getElementById("growthAccelerationUnit")

function updateCropDropdown() {
    for (const [crop, data] of Object.entries(crops)) {
        const cropListing = document.createElement("option")
        cropListing.text = `${data.friendlyName} - ${data.tier}`
        cropListing.id = crop
        cropDropdown.append(cropListing)
    }
}

function updateBiomeDropdown() {
    let biomeNameArr = []
    for (const [biome, data] of Object.entries(biomes)) {
        biomeNameArr.push(biome)
    }
    biomeNameArr.sort()
    for (biome of biomeNameArr) {
        let data = biomes[biome]
        const biomeListing = document.createElement("option")
        biomeListing.text = data.friendlyName
        biomeListing.id = biome
        biomeDropdown.append(biomeListing)
    }
}

function updateIFDropdown() {
    for ([tier, data] of Object.entries(industrialFarmStats)) {
        const tierListing = document.createElement("option")
        tierListing.text = tier
        tierListing.id = tier
        machineDropdown.append(tierListing)
    }
}

function updateOCDropdown() {
    for ([tier, data] of Object.entries(industrialFarmStats)) {
        if(tier == "None"){continue}
        if(tier == "MV"){continue}
        const tierListing = document.createElement("option")
        tierListing.text = tier
        tierListing.id = tier
        overclockDropdown.append(tierListing)
    }
}

function readCropDropdownChange(event) {
    let indexSelected = event.target.selectedIndex
    let crop = event.target.children[indexSelected]
}

function readBiomeDropdownChange(event) {
    let indexSelected = event.target.selectedIndex
    let biome = event.target.children[indexSelected]
}

updateCropDropdown()
updateBiomeDropdown()
updateIFDropdown()
updateOCDropdown()