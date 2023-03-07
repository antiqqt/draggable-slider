import image1 from '../../assets/img-1.jpg';
import image2 from '../../assets/img-2.jpg';
import image3 from '../../assets/img-3.jpg';
import image4 from '../../assets/img-4.jpg';
import image5 from '../../assets/img-5.jpg';
import image6 from '../../assets/img-6.jpg';
import image7 from '../../assets/img-7.jpg';
import image8 from '../../assets/img-8.jpg';

function createImageObj(imageUrl: string) {
  return {
    id: crypto.randomUUID(),
    src: imageUrl
  };
}

function shuffleArray<T>(array: T[]) {
  return array
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
}

export function createSetOfImages() {
  return shuffleArray([
    image1,
    image2,
    image3,
    image4,
    image5,
    image6,
    image7,
    image8
  ]).map(createImageObj);
}

export default createSetOfImages();
