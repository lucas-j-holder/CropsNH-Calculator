const cropDropdown = document.getElementById("cropDropdown")
const biomeDropdown = document.getElementById("biomeDropdown")

function updateCropDropdown() {
    cropDropdown.onchange = readCropDropdownChange
    for (const [crop, data] of Object.entries(crops)) {
        const cropListing = document.createElement("option")
        cropListing.text = data.friendlyName
        cropListing.id = crop
        cropDropdown.append(cropListing)
        console.log(`${crop}: ${data.friendlyName}`);
    }
}

function updateBiomeDropdown() {
    biomeDropdown.onchange = readBiomeDropdownChange
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
        console.log(`${biome}: ${data.friendlyName}`);
    }
}

function readCropDropdownChange(event) {
    let indexSelected = event.target.selectedIndex
    let crop = event.target.children[indexSelected]
    console.log(crop.id)
}

function readBiomeDropdownChange(event) {
    let indexSelected = event.target.selectedIndex
    let biome = event.target.children[indexSelected]
    console.log(biome.id)
}

function cropCalculation() {
    let crop = cropDropdown.children[cropDropdown.selectedIndex].id
    console.log(crop)
}

updateCropDropdown()
updateBiomeDropdown()
cropCalculation()