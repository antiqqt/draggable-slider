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

  const handleDragStart = (
    e: React.MouseEvent<HTMLImageElement, MouseEvent>
  ) => {
    if (!sliderRef.current) return;

    setIsDragging(true);
    setPrevScrollLeft(sliderRef.current.scrollLeft);
    setPrevClientX(e.clientX);
  };

  const handleDragEnd = (e: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
    if (!sliderRef.current) return;

    setIsDragging(false);
    setPrevClientX(e.pageX);
    setPrevScrollLeft(sliderRef.current.scrollLeft);
  };

  const handleDrag = (e: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
    if (!isDragging) return;
    if (!sliderRef.current) return;

    e.preventDefault();

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
          className="absolute block aspect-square w-8 -translate-x-1/2 cursor-pointer self-center rounded-full bg-neutral-100 text-neutral-700 transition hover:bg-indigo-500 hover:text-white"
        >
          <FontAwesomeIcon icon={faArrowLeft}></FontAwesomeIcon>
        </button>
      )}

      <div
        className={`${
          isDragging
            ? // Set scroll to auto while dragging
              // to fix scroll lags
              'cursor-grabbing scroll-auto'
            : 'cursor-grab scroll-smooth'
        } flex max-w-sm gap-x-4 overflow-hidden md:max-w-4xl lg:max-w-7xl`}
        ref={sliderRef}
        onMouseDown={handleDragStart}
        onMouseMove={handleDrag}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
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
            // Subtract 1rem * (number of flex items) from width calculation
            // to account for gaps between items
            onMouseDown={(e) => e.preventDefault()}
            className="h-80 w-full flex-shrink-0 rounded object-cover md:w-[calc((100%-1rem*1)/2)] lg:w-[calc((100%-1rem*2)/3)]"
          ></img>
        ))}
      </div>

      {isSwipeRightPossible && (
        <button
          type="button"
          onClick={() => handleSwipe(calculateScrollAfterSwipeRight)}
          className="absolute right-0 aspect-square w-8 translate-x-1/2 cursor-pointer self-center rounded-full bg-neutral-100 text-neutral-700 transition hover:bg-indigo-500 hover:text-white"
        >
          <FontAwesomeIcon icon={faArrowRight}></FontAwesomeIcon>
        </button>
      )}
    </section>
  );
};
export default Slider;
