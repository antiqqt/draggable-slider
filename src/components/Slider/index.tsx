import { useRef, useState } from 'react';
import images, { createSetOfImages } from './images';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import ImageSkeleton from '../ImageSkeleton/ImageSkeleton';

const gapWidth = 16;
const delay = 1000;

const Slider = () => {
  const [sliderImages, setSliderImages] = useState(images);
  const [isLoaded, setIsLoaded] = useState(false);

  const [isDragging, setIsDragging] = useState(false);
  const [prevScrollLeft, setPrevScrollLeft] = useState(0);
  const [prevClientX, setPrevClientX] = useState(0);

  const [isSwipeLeftPossible, setIsSwipeLeftPossible] = useState(false);
  const [isSwipeRightPossible, setIsSwipeRightPossible] = useState(true);

  const sliderRef = useRef<HTMLDivElement>(null);
  const imageRefMap = useRef(
    new Map<string, HTMLImageElement | HTMLDivElement>()
  );

  const handleDragStart = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!sliderRef.current) return;

    setIsDragging(true);
    setPrevScrollLeft(sliderRef.current.scrollLeft);
    setPrevClientX(e.clientX);
    sliderRef.current.setPointerCapture(e.pointerId);
  };

  const handleDragEnd = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!sliderRef.current) return;
    if (!isDragging) return;

    const { scrollLeft } = sliderRef.current;
    const adjustedScrollLeft = getAdjustedScrollLeft(scrollLeft) ?? scrollLeft;

    setIsDragging(false);
    setPrevClientX(e.pageX);
    setPrevScrollLeft(adjustedScrollLeft);

    updateIsSwipeLeftPossible(adjustedScrollLeft);
    updateIsSwipeRightPossible(adjustedScrollLeft, sliderRef.current);

    sliderRef.current.scrollTo({
      left: adjustedScrollLeft,
      behavior: 'smooth'
    });
  };

  const handleDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();

    if (!isDragging) return;
    if (!sliderRef.current) return;

    const change = e.clientX - prevClientX;
    const newScrollLeft = prevScrollLeft - change;

    updateIsSwipeLeftPossible(newScrollLeft);
    updateIsSwipeRightPossible(newScrollLeft, sliderRef.current);
    sliderRef.current.scrollLeft = newScrollLeft;
  };

  const calculateScrollAfterSwipeLeft = (
    prevScrollLeft: number,
    swipeWidth: number
  ) => prevScrollLeft - swipeWidth;

  const calculateScrollAfterSwipeRight = (
    prevScrollLeft: number,
    swipeWidth: number
  ) => prevScrollLeft + swipeWidth;

  const handleSwipe = (
    calculateNewScroll: typeof calculateScrollAfterSwipeLeft
  ) => {
    const swipeWidth = getSwipeWidth();
    if (swipeWidth == null) return;
    if (!sliderRef.current) return;

    const newScrollLeft = calculateNewScroll(prevScrollLeft, swipeWidth);
    const adjustedScrollLeft =
      getAdjustedScrollLeft(newScrollLeft) ?? newScrollLeft;

    updateIsSwipeLeftPossible(adjustedScrollLeft);
    updateIsSwipeRightPossible(adjustedScrollLeft, sliderRef.current);
    setPrevScrollLeft(adjustedScrollLeft);

    sliderRef.current.scrollTo({
      left: adjustedScrollLeft,
      behavior: 'smooth'
    });
  };

  const updateIsSwipeLeftPossible = (scrollPosition: number) => {
    setIsSwipeLeftPossible(scrollPosition > 0);
  };

  const updateIsSwipeRightPossible = (
    scrollPosition: number,
    element: HTMLDivElement
  ) => {
    const scrollEnd = element.scrollWidth - element.clientWidth;
    setIsSwipeRightPossible(scrollPosition < scrollEnd);
  };

  const getAdjustedScrollLeft = (scrollLeft: number) => {
    const swipeWidth = getSwipeWidth();
    if (swipeWidth == null) return;

    const offset = scrollLeft % swipeWidth;
    const spaceToNextImg = swipeWidth - offset;
    const threshold = swipeWidth * 0.4;
    const spaceToAdd = offset > threshold ? spaceToNextImg : -offset;
    const adjusted = scrollLeft + spaceToAdd;

    return adjusted;
  };

  const getSwipeWidth = () => {
    const [, imgElement] = imageRefMap.current.entries().next().value;

    if (!(imgElement instanceof HTMLImageElement)) return;

    const imgWidth = imgElement.clientWidth;
    const swipeWidth = imgWidth + gapWidth;

    return swipeWidth;
  };

  const handleLoadImagesLeft = () => {
    new Promise<void>((resolve) => {
      setTimeout(() => {
        setSliderImages((imgs) => [...createSetOfImages(), ...imgs]);
        setIsSwipeLeftPossible(true);
        resolve();
      }, delay);
    }).then(() => {
      if (!sliderRef.current) return;

      sliderRef.current.scrollTo({
        left: prevScrollLeft,
        behavior: 'smooth'
      });
    });
  };

  const handleLoadImagesRight = () => {
    setTimeout(() => {
      setIsSwipeRightPossible(true);
      setSliderImages((imgs) => [...imgs, ...createSetOfImages()]);
    }, delay);
  };

  return (
    <article className="flex justify-center px-6">
      {
        // Flexbox item cannot be smaller than it's content size. This is default flex-shrink behavior.
        // As a result, our buttons mess up the element resizing and cause scrollbar to appear
        // after n slides (n depends on the current viewport width).
        // Thus, to rectify this, we need to manually set flex item min-width and min-height to "0"(default is "auto"),
        // or set overflow to "hidden".
      }
      <section className="relative flex min-h-0 min-w-0">
        {isSwipeLeftPossible && (
          <button
            type="button"
            onClick={() => handleSwipe(calculateScrollAfterSwipeLeft)}
            className="absolute flex aspect-square w-8 -translate-x-1/2 cursor-pointer items-center justify-center self-center rounded-full bg-neutral-100 text-neutral-700 transition hover:bg-indigo-500 hover:text-white"
          >
            <FontAwesomeIcon icon={faArrowLeft}></FontAwesomeIcon>
          </button>
        )}

        <div
          ref={sliderRef}
          onPointerDown={handleDragStart}
          onPointerMove={handleDrag}
          onPointerUp={handleDragEnd}
          onPointerLeave={handleDragEnd}
          onPointerCancel={handleDragEnd}
          // Touch-none property is very important to enable,
          // as it allows us to freely control element scroll on touch devices.
          // Without it browser cancels drag automatically after a short time.
          // idk why it should be controlled by CSS tho ¯\_(ツ)_/¯
          className={`${
            isDragging ? 'cursor-grabbing' : 'cursor-grab'
          } flex max-w-sm touch-none gap-x-4 overflow-hidden md:max-w-4xl lg:max-w-7xl`}
        >
          <ImageSkeleton
            onObserve={handleLoadImagesLeft}
            sliderElement={sliderRef.current}
          ></ImageSkeleton>
          {sliderImages.map(({ id, src }, index) => (
            <img
              ref={(ref) => {
                if (ref) {
                  imageRefMap.current.set(id, ref);
                } else {
                  imageRefMap.current.delete(id);
                }
              }}
              key={id}
              src={src}
              onLoad={(e) => {
                const isLast = index === sliderImages.length - 1;

                if (isLast && sliderRef.current && !isLoaded) {
                  const initialOffset =
                    e.currentTarget.getBoundingClientRect().width + gapWidth;

                  setIsSwipeLeftPossible(true);
                  setIsLoaded(true);
                  setPrevScrollLeft(initialOffset);
                  sliderRef.current.scrollTo({
                    left: initialOffset,
                    behavior: 'auto'
                  });
                }
              }}
              onPointerDown={(e) => e.preventDefault()}
              // Subtract 1rem * (number of flex items) from width calculation
              // to account for gaps between items
              className="h-80 w-full flex-shrink-0 snap-center rounded object-cover md:w-[calc((100%-1rem*1)/2)] lg:w-[calc((100%-1rem*2)/3)]"
            ></img>
          ))}
          <ImageSkeleton
            onObserve={handleLoadImagesRight}
            sliderElement={sliderRef.current}
          ></ImageSkeleton>
        </div>

        {isSwipeRightPossible && (
          <button
            type="button"
            onClick={() => handleSwipe(calculateScrollAfterSwipeRight)}
            className="absolute right-0 flex aspect-square w-8 translate-x-1/2 cursor-pointer items-center justify-center self-center rounded-full bg-neutral-100 text-neutral-700 transition hover:bg-indigo-500 hover:text-white"
          >
            <FontAwesomeIcon icon={faArrowRight}></FontAwesomeIcon>
          </button>
        )}
      </section>
    </article>
  );
};
export default Slider;
