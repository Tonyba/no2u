const variant_picker = document.querySelector('.variant-picker');
const variantOptions = Array.from(document.querySelectorAll('.variant-picker__form > .variant-option:first-child option')).map(item => ({
    label: item.textContent.trim(),
    value: item.getAttribute('data-option-value-id')
}));


const optWrapper = document.createElement('div');
optWrapper.classList.add('flex');

