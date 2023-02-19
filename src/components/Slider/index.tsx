import { useRef, useState } from 'react';
import images from './images';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';

const Slider = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [prevScrollLeft, setPrevScrollLeft] = useState(0);
  const [prevClientX, setPrevClientX] = useState(0);

  const [isSwipeLeftPossible, setIsSwipeLeftPossible] = useState(false);
  const [isSwipeRightPossible, setIsSwipeRightPossible] = useState(true);

  const sliderRef = useRef<HTMLDivElement>(null);
  const imageRefMap = useRef(new Map<string, HTMLImageElement>());

  const handleDragStart = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!sliderRef.current) return;

    sliderRef.current.setPointerCapture(e.pointerId);
    setIsDragging(true);
    setPrevScrollLeft(sliderRef.current.scrollLeft);
    setPrevClientX(e.clientX);
  };

  const handleDragEnd = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!sliderRef.current) return;

    setIsDragging(false);
    setPrevClientX(e.pageX);
    setPrevScrollLeft(sliderRef.current.scrollLeft);
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
    const [, imgElement] = imageRefMap.current.entries().next().value;

    if (!(imgElement instanceof HTMLImageElement)) return;
    if (!sliderRef.current) return;

    const gapWidth = 16;
    const imgWidth = imgElement.clientWidth;
    const swipeWidth = imgWidth + gapWidth;
    const newScrollLeft = calculateNewScroll(prevScrollLeft, swipeWidth);

    updateIsSwipeLeftPossible(newScrollLeft);
    updateIsSwipeRightPossible(newScrollLeft, sliderRef.current);
    setPrevScrollLeft(newScrollLeft);
    sliderRef.current.scrollLeft = newScrollLeft;
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

  return (
    <section className="relative flex">
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
          isDragging
            ? // Set scroll to auto while dragging
              // to fix scroll lags
              'cursor-grabbing scroll-auto'
            : 'cursor-grab scroll-smooth'
        } flex max-w-sm touch-none gap-x-4 overflow-hidden md:max-w-4xl lg:max-w-7xl`}
      >
        {images.map(({ id, src }) => (
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
            loading={'lazy'}
            onPointerDown={(e) => e.preventDefault()}
            // Subtract 1rem * (number of flex items) from width calculation
            // to account for gaps between items
            className="h-80 w-full flex-shrink-0 rounded object-cover md:w-[calc((100%-1rem*1)/2)] lg:w-[calc((100%-1rem*2)/3)]"
          ></img>
        ))}
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
  );
};
export default Slider;
