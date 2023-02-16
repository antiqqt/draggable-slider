import images from './images';

const Slider = () => {
  return (
    <article className="flex cursor-pointer justify-center px-[15%] text-white">
      <section className="flex flex-nowrap overflow-hidden">
        {images.map(({ id, src }) => (
          <img
            key={id}
            src={src}
            loading={'lazy'}
            className="aspect-square w-[calc(100%/3)] object-cover"
          ></img>
        ))}
      </section>
    </article>
  );
};
export default Slider;
