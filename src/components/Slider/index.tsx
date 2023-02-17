import images from './images';

const Slider = () => {
  return (
    <section className="max-w-sm overflow-hidden md:max-w-4xl lg:max-w-7xl">
      <div className="flex gap-x-4">
        {images.map(({ id, src }) => (
          <img
            key={id}
            src={src}
            loading={'lazy'}
            // Subtract 1rem * (number of flex items) from width calculation
            // to account for gaps between items
            className="h-80 w-full flex-shrink-0 object-cover md:w-[calc((100%-1rem*1)/2)] lg:w-[calc((100%-1rem*2)/3)]"
          ></img>
        ))}
      </div>
    </section>
  );
};
export default Slider;
