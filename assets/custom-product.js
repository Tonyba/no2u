function waitForElm(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                observer.disconnect();
                resolve(document.querySelector(selector));
            }
        });

        // If you get "parameter 1 is not of type 'Node'" error, see https://stackoverflow.com/a/77855838/492336
        observer.observe(document.documentElement, {
            childList: true,
            subtree: true
        });
    });
}


waitForElm('.variant-picker__form > .variant-option:first-child option').then((elm) => {



    const variant_picker = document.querySelector('.variant-picker');
    const variantOptions = Array.from(document.querySelectorAll('.variant-picker__form > .variant-option:first-child option')).map(item => ({
        label: item.textContent.trim(),
        value: item.getAttribute('data-option-value-id')
    }));

    waitForElm('[data-block-handle="recurpay-app-block-widget"]').then((subs_el) => {
        const free_shipping_badge = document.querySelector('.free-shipping-badge');
        const subs_opts = document.querySelector('.recurpay-pdp-widget');

        variant_picker?.insertAdjacentElement('afterend', subs_el);
        subs_el?.append(free_shipping_badge);
        free_shipping_badge?.classList.remove('hide');
    })

    let otherOpt = document.querySelectorAll('.variant-picker__form > .variant-option');
    otherOpt = otherOpt[otherOpt.length - 1];

    const flavorsCount = otherOpt.querySelectorAll('option').length;
    let flavorLabel = document.querySelectorAll('.variant-picker__form > .variant-option');
    flavorLabel = flavorLabel[flavorLabel.length - 1]?.querySelector('label');



    flavorLabel.innerText = `${flavorsCount} ${flavorLabel.innerText} Available:`;

    const selectOpts = Array.from(document.querySelectorAll('.variant-picker__form > .variant-option:first-child option'));
    const select = document.querySelector('.variant-picker__form > .variant-option:first-child select');

    const newElsReferences = [];

    const optWrapper = document.createElement('div');
    optWrapper.classList.add('flex');
    optWrapper.classList.add('size-boxes')

    variantOptions.map((opt, i) => {
        const newEl = document.createElement('div');
        const subEl = document.createElement('div');

        subEl.classList.add('serving');

        subEl.innerText = '($1.80/serving)';

        newEl.classList.add('col');
        newEl.classList.add('w-100');
        newEl.setAttribute('data-value', opt.value);

        newEl.innerHTML = '<div class="label">' + opt.label + '</div>';
        newEl.append(subEl);

        optWrapper.append(newEl);

        newElsReferences.push(newEl);

        newEl.addEventListener('click', () => handleSelection(i, newEl));
    });

    document.querySelector('.maximum-per-order')?.insertAdjacentElement('beforebegin', optWrapper);




    function handleSelection(value, el) {

        select.selectedIndex = value;
        select.dispatchEvent(new Event('change', {
            bubbles: true, // Crucial for ensuring the event propagates up the DOM tree
            cancelable: true,
            view: window
        }));
        // select.dispatchEvent(new Event('bs:variant:change'));

        newElsReferences.map(current => current.classList.remove('selected'))

        el.classList.add('selected');
    }

});



