const variant_picker = document.querySelector('.variant-picker');
const variantOptions = Array.from(document.querySelectorAll('.variant-picker__form > .variant-option:first-child option')).map(item => ({
    label: item.textContent.trim()
}));


const optWrapper = document.createElement('div');
optWrapper.classList.add('flex');

variantOptions.map(opt => {
    const newEl = document.createElement('div');
    newEl.classList.add('col');
    newEl.innerHTML = opt.label;

    optWrapper.append(newEl);
});




