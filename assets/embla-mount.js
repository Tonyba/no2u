const TWEEN_FACTOR_BASE = 0.3
let tweenFactor = 0
let tweenNodes = []

function waitForEmbla(method) {
    if (typeof EmblaCarousel != 'undefined' && typeof EmblaCarouselClassNames != 'undefined') {
        method();
    } else {
        setTimeout(function () { waitForEmbla(method) }, 50);
    }
}

waitForEmbla(init);

function init() {
    const elms = document.querySelectorAll('.embla');


    elms.forEach((elm, i) => {
        let options = { loop: true, align: 'start' };
        const plugins = []

        if (elm.classList.contains('autoscroll')) {
            plugins.push(EmblaCarouselAutoScroll({
                speed: 0.7
            }))
        }


        if (elm.classList.contains('service-content')) {
            const thumbEl = document.querySelector('.serv-selector');
            thumbEl.classList.add('embla');

            const mainOpts = { ...options, align: 'center' };
            const mainPlugins = plugins.push(EmblaCarouselClassNames());

            if (thumbEl.classList.contains('centered-mobile')) options = {
                ...options,
                breakpoints: {
                    '(max-width: 1024px)': {
                        align: 'center'
                    }
                }
            }

            const mainCarousel = mountEmbla(elm, mainOpts, [EmblaCarouselClassNames()]);
            const thumbCarousel = mountEmbla(thumbEl, options, [EmblaCarouselClassNames()]);

            const removeTweenScale = setupTweenScale(mainCarousel);

            const removeThumbBtnsClickHandlers = addThumbBtnsClickHandlers(
                mainCarousel,
                thumbCarousel
            )
            const removeToggleThumbBtnsActive = addToggleThumbBtnsActive(
                mainCarousel,
                thumbCarousel
            )

            mainCarousel
                .on('destroy', removeTweenScale)
                .on('destroy', removeThumbBtnsClickHandlers)
                .on('destroy', removeToggleThumbBtnsActive)

            thumbCarousel
                .on('destroy', removeThumbBtnsClickHandlers)
                .on('destroy', removeToggleThumbBtnsActive)

        } else {

            plugins.push(EmblaCarouselClassNames());
            mountEmbla(elm, options, plugins);
        }

    });

}

function mountEmbla(elm, options, plugins) {


    const viewportNode = elm.querySelector('.embla__viewport')
    const emblaApi = EmblaCarousel(viewportNode, options, plugins);

    const dotsNode = elm.querySelector('.embla__dots');
    const prevBtnNode = elm.querySelector('.embla__button--prev');
    const nextBtnNode = elm.querySelector('.embla__button--next');



    const removeDotBtnsAndClickHandlers = addDotBtnsAndClickHandlers(
        emblaApi,
        dotsNode
    );

    if (prevBtnNode && nextBtnNode) {
        const removePrevNextBtnsClickHandlers = addPrevNextBtnsClickHandlers(
            emblaApi,
            prevBtnNode,
            nextBtnNode
        );
        emblaApi.on('destroy', removePrevNextBtnsClickHandlers);
    }


    emblaApi.on('destroy', removeDotBtnsAndClickHandlers);

    emblaApi.on('select', () => addNextOrPrev(emblaApi));
    emblaApi.on('init', () => addNextOrPrev(emblaApi)); dotsNode

    return emblaApi;
}

function addNextOrPrev(emblaApi) {
    // Clear any existing custom classes from all slides
    const slides = emblaApi.slideNodes();

    slides.forEach(slide => {
        slide.classList.remove('is-next')
        slide.classList.remove('is-prev')
    })

    // Get the index of the currently selected slide
    const selectedIndex = emblaApi.selectedScrollSnap()
    const lastIndex = emblaApi.scrollSnapList().length - 1

    // Calculate the next and previous slide indexes, handling loop logic
    const prevIndex = selectedIndex === 0 ? lastIndex : selectedIndex - 1
    const nextIndex = selectedIndex === lastIndex ? 0 : selectedIndex + 1

    // Add the custom classes to the corresponding slide elements
    slides[prevIndex].classList.add('is-prev')
    slides[nextIndex].classList.add('is-next')
}

function addToggleThumbBtnsActive(emblaApiMain, emblaApiThumb) {
    const slidesThumbs = emblaApiThumb.slideNodes()

    const toggleThumbBtnsState = () => {
        emblaApiThumb.scrollTo(emblaApiMain.selectedScrollSnap())
        const previous = emblaApiMain.previousScrollSnap()
        const selected = emblaApiMain.selectedScrollSnap()
        slidesThumbs[previous].classList.remove('embla-thumbs__slide--selected')
        slidesThumbs[selected].classList.add('embla-thumbs__slide--selected')
    }

    emblaApiMain.on('select', toggleThumbBtnsState)
    emblaApiThumb.on('init', toggleThumbBtnsState)

    return () => {
        const selected = emblaApiMain.selectedScrollSnap()
        slidesThumbs[selected].classList.remove('embla-thumbs__slide--selected')
    }
}


function addThumbBtnsClickHandlers(emblaApiMain, emblaApiThumb) {
    const slidesThumbs = emblaApiThumb.slideNodes()

    const scrollToIndex = slidesThumbs.map(
        (_, index) => () => emblaApiMain.scrollTo(index)
    )

    slidesThumbs.forEach((slideNode, index) => {
        slideNode.addEventListener('click', scrollToIndex[index], false)
    })

    return () => {
        slidesThumbs.forEach((slideNode, index) => {
            slideNode.removeEventListener('click', scrollToIndex[index], false)
        })
    }
}

function addTogglePrevNextBtnsActive(emblaApi, prevBtn, nextBtn) {
    const togglePrevNextBtnsState = () => {
        if (emblaApi.canScrollPrev()) prevBtn.removeAttribute('disabled')
        else prevBtn.setAttribute('disabled', 'disabled')

        if (emblaApi.canScrollNext()) nextBtn.removeAttribute('disabled')
        else nextBtn.setAttribute('disabled', 'disabled')
    }

    emblaApi
        .on('select', togglePrevNextBtnsState)
        .on('init', togglePrevNextBtnsState)
        .on('reInit', togglePrevNextBtnsState)

    return () => {
        prevBtn.removeAttribute('disabled')
        nextBtn.removeAttribute('disabled')
    }
}


function addPrevNextBtnsClickHandlers(emblaApi, prevBtn, nextBtn) {
    const scrollPrev = () => {
        emblaApi.scrollPrev()
    }
    const scrollNext = () => {
        emblaApi.scrollNext()
    }
    prevBtn.addEventListener('click', scrollPrev, false)
    nextBtn.addEventListener('click', scrollNext, false)

    const removeTogglePrevNextBtnsActive = addTogglePrevNextBtnsActive(
        emblaApi,
        prevBtn,
        nextBtn
    )

    return () => {
        removeTogglePrevNextBtnsActive()
        prevBtn.removeEventListener('click', scrollPrev, false)
        nextBtn.removeEventListener('click', scrollNext, false)
    }
}

function addDotBtnsAndClickHandlers(emblaApi, dotsNode) {
    let dotNodes = []
    if (!dotsNode) return;
    const addDotBtnsWithClickHandlers = () => {


        dotsNode.innerHTML = emblaApi
            .scrollSnapList()
            .map(() => '<button class="embla__dot" type="button"></button>')
            .join('')

        const scrollTo = (index) => {
            emblaApi.scrollTo(index)
        }

        dotNodes = Array.from(dotsNode.querySelectorAll('.embla__dot'))
        dotNodes.forEach((dotNode, index) => {
            dotNode.addEventListener('click', () => scrollTo(index), false)
        })
    }

    const toggleDotBtnsActive = () => {
        const previous = emblaApi.previousScrollSnap()
        const selected = emblaApi.selectedScrollSnap()
        dotNodes[previous].classList.remove('embla__dot--selected')
        dotNodes[selected].classList.add('embla__dot--selected')
    }

    emblaApi
        .on('init', addDotBtnsWithClickHandlers)
        .on('reInit', addDotBtnsWithClickHandlers)
        .on('init', toggleDotBtnsActive)
        .on('reInit', toggleDotBtnsActive)
        .on('select', toggleDotBtnsActive)

    return () => {
        dotsNode.innerHTML = ''
    }
}


function numberWithinRange(number, min, max) {
    return Math.min(Math.max(number, min), max);
}



function setTweenNodes(emblaApi) {
    tweenNodes = emblaApi.slideNodes().map((slideNode) => {
        return slideNode.querySelector('.service-carousel-item');
    })
}

function setTweenFactor(emblaApi) {
    tweenFactor = TWEEN_FACTOR_BASE * emblaApi.scrollSnapList().length
}

function tweenScale(emblaApi, eventName) {
    const engine = emblaApi.internalEngine()
    const scrollProgress = emblaApi.scrollProgress()
    const slidesInView = emblaApi.slidesInView()
    const isScrollEvent = eventName === 'scroll'

    emblaApi.scrollSnapList().forEach((scrollSnap, snapIndex) => {
        let diffToTarget = scrollSnap - scrollProgress
        const slidesInSnap = engine.slideRegistry[snapIndex]

        slidesInSnap.forEach((slideIndex) => {
            if (isScrollEvent && !slidesInView.includes(slideIndex)) return

            if (engine.options.loop) {
                engine.slideLooper.loopPoints.forEach((loopItem) => {
                    const target = loopItem.target()

                    if (slideIndex === loopItem.index && target !== 0) {
                        const sign = Math.sign(target)

                        if (sign === -1) {
                            diffToTarget = scrollSnap - (1 + scrollProgress)
                        }
                        if (sign === 1) {
                            diffToTarget = scrollSnap + (1 - scrollProgress)
                        }
                    }
                })
            }

            const tweenValue = 1 - Math.abs(diffToTarget * tweenFactor)
            const scale = numberWithinRange(tweenValue, 0, 1).toString()
            const tweenNode = tweenNodes[slideIndex]
            tweenNode.style.transform = `scale(${scale})`
        })
    })
}

function setupTweenScale(emblaApi) {
    setTweenNodes(emblaApi)
    setTweenFactor(emblaApi)
    tweenScale(emblaApi)

    emblaApi
        .on('reInit', setTweenNodes)
        .on('reInit', setTweenFactor)
        .on('reInit', tweenScale)
        .on('scroll', tweenScale)
        .on('slideFocus', tweenScale)

    return () => {
        tweenNodes.forEach((slide) => slide.removeAttribute('style'))
    }
}
