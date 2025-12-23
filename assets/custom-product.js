const variant_picker = document.querySelector('.variant-picker');
const variantOptions = Array.from(document.querySelectorAll('.variant-picker__form > .variant-option:first-child option')).map(item => ({
    label: item.textContent.trim()
}));


const optWrapper = document.createElement('div');
optWrapper.classList.add('flex');

variantOptions.map(opt => {
    const newEl = document.createElement('div');
    const subEl = document.createElement('div');

    subEl.classList.add('serving');

    subEl.innerText = '($1.80/serving)';

    newEl.classList.add('col');
    newEl.classList.add('w-100');

    newEl.innerHTML = '<div class="label">' + opt.label + '</div>';
    newEl.append(subEl);

    optWrapper.append(newEl);

});

variant_picker?.insertAdjacentElement('beforebegin', optWrapper);


