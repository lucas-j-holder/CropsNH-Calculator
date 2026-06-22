const cropDropdown = document.getElementById("cropDropdown")

function updateCropDropdown() {
    cropDropdown.onchange = readDropdownChange
    for (const [crop, data] of Object.entries(crops)) {
        const cropListing = document.createElement("option")
        cropListing.text = data.friendlyName
        cropListing.id = crop
        cropDropdown.append(cropListing)
        console.log(`${crop}: ${data.friendlyName}`);
    }
}

function readDropdownChange(event) {
    let indexSelected = event.target.selectedIndex
    let crop = event.target.children[indexSelected]
    console.log(crop.id)
}

function cropCalculation() {
    let crop = cropDropdown.children[cropDropdown.selectedIndex].id
    console.log(crop)
}

updateCropDropdown()
cropCalculation()