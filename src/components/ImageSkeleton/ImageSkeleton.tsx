import { useEffect, useRef } from 'react';

interface Props {
  onObserve: () => void;
  sliderElement: HTMLDivElement | null;
}

const ImageSkeleton = ({ onObserve, sliderElement }: Props) => {
  const elemRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sliderElement) return;
    if (!elemRef.current) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            onObserve();
          }
        });
      },
      {
        root: null,
        threshold: 0.5
      }
    );

    io.observe(elemRef.current);

    return () => {
      io.disconnect();
    };
  }, [sliderElement]);

  return (
    <div
      ref={elemRef}
      onPointerDown={(e) => e.preventDefault()}
      // Subtract 1rem * (number of flex items) from width calculation
      // to account for gaps between items
      className="flex h-80 w-full flex-shrink-0 snap-center items-center justify-center rounded bg-neutral-700 object-cover md:w-[calc((100%-1rem*1)/2)] lg:w-[calc((100%-1rem*2)/3)]"
    >
      <svg
        className="h-12 w-12 animate-pulse text-gray-200"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        fill="currentColor"
        viewBox="0 0 640 512"
      >
        <path d="M480 80C480 35.82 515.8 0 560 0C604.2 0 640 35.82 640 80C640 124.2 604.2 160 560 160C515.8 160 480 124.2 480 80zM0 456.1C0 445.6 2.964 435.3 8.551 426.4L225.3 81.01C231.9 70.42 243.5 64 256 64C268.5 64 280.1 70.42 286.8 81.01L412.7 281.7L460.9 202.7C464.1 196.1 472.2 192 480 192C487.8 192 495 196.1 499.1 202.7L631.1 419.1C636.9 428.6 640 439.7 640 450.9C640 484.6 612.6 512 578.9 512H55.91C25.03 512 .0006 486.1 .0006 456.1L0 456.1z" />
      </svg>
    </div>
  );
};
export default ImageSkeleton;
