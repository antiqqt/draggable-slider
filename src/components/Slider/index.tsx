import { useRef, useState } from 'react';
import images from './images';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';

const Slider = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [prevScrollLeft, setPrevScrollLeft] = useState(0);
  const [prevPageX, setPrevPageX] = useState(0);

  const sliderRef = useRef<HTMLDivElement>(null);
  const imageRefMap = useRef(new Map<string, HTMLImageElement>());

  const handleDragStart = (
    e: React.MouseEvent<HTMLImageElement, MouseEvent>
  ) => {
    if (!sliderRef.current) return;

    setIsDragging(true);
    setPrevScrollLeft(sliderRef.current.scrollLeft);
    setPrevPageX(e.pageX);
  };

  const handleDragEnd = (e: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
    if (!sliderRef.current) return;

    setIsDragging(false);
    setPrevPageX(e.pageX);
    setPrevScrollLeft(sliderRef.current.scrollLeft);
  };

  const handleDrag = (e: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
    if (!isDragging) return;
    if (!sliderRef.current) return;

    e.preventDefault();

    const change = e.pageX - prevPageX;
    sliderRef.current.scrollLeft = prevScrollLeft - change;
  };

  const calculateScrollAfterSwipeLeft = (
    prevScrollLeft: number,
    gapWidth: number,
    imageWidth: number
  ) => prevScrollLeft - gapWidth - imageWidth;

  const calculateScrollAfterSwipeRight = (
    prevScrollLeft: number,
    gapWidth: number,
    imageWidth: number
  ) => prevScrollLeft + gapWidth + imageWidth;

  const handleSwipe = (
    calculateNewScroll: (
      prevScrollLeft: number,
      gapWidth: number,
      imageWidth: number
    ) => number
  ) => {
    const [, elem] = imageRefMap.current.entries().next().value;

    if (!(elem instanceof HTMLImageElement)) return;
    if (!sliderRef.current) return;

    const gapWidth = 16;
    const imageWidth = elem.clientWidth;

    sliderRef.current.scrollLeft = calculateNewScroll(
      prevScrollLeft,
      gapWidth,
      imageWidth
    );
    setPrevScrollLeft(sliderRef.current.scrollLeft);
  };

  return (
    <section className="relative flex">
      <button
        type="button"
        onClick={() => handleSwipe(calculateScrollAfterSwipeLeft)}
        className="absolute aspect-square w-8 -translate-x-1/2 cursor-pointer self-center rounded-full bg-neutral-100 text-neutral-700 transition hover:bg-indigo-500 hover:text-white"
      >
        <FontAwesomeIcon icon={faArrowLeft}></FontAwesomeIcon>
      </button>
      <section
        className={`max-w-sm shrink overflow-hidden md:max-w-4xl lg:max-w-7xl ${
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        }`}
        ref={sliderRef}
        onMouseDown={handleDragStart}
        onMouseMove={handleDrag}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
      >
        <div className="flex gap-x-4">
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
      </section>
      <button
        type="button"
        onClick={() => handleSwipe(calculateScrollAfterSwipeRight)}
        className="absolute right-0 aspect-square w-8 translate-x-1/2 cursor-pointer self-center rounded-full bg-neutral-100 text-neutral-700 transition hover:bg-indigo-500 hover:text-white"
      >
        <FontAwesomeIcon icon={faArrowRight}></FontAwesomeIcon>
      </button>
    </section>
  );
};
export default Slider;
