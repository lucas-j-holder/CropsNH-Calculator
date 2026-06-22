const cropDropdown = document.getElementById("cropDropdown")
const biomeDropdown = document.getElementById("biomeDropdown")
const hydratedCheckbox = document.getElementById("hydrated")
const fertilizedCheckbox = document.getElementById("fertilized")
const skyCheckbox = document.getElementById("canSeeSky")
const growthStatField = document.getElementById("growthStat")
const gainStatField = document.getElementById("gainStat")
const resistanceStatField = document.getElementById("resistanceStat")

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
