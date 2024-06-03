import * as RadixSlider from '@radix-ui/react-slider';

export const Slider = (props) => (
  <RadixSlider.Root
    className="relative flex items-center select-none touch-none w-64 h-4"
    {...props}
  >
    <RadixSlider.Track className="relative flex-grow bg-gray-900 rounded-full h-1">
      <RadixSlider.Range className="absolute bg-blue-600 rounded-full h-full" />
    </RadixSlider.Track>
    <RadixSlider.Thumb className="block w-4 h-4 bg-blue-600 shadow-md rounded-[10px] hover:bg-blue-500 focus:outline-none" />
  </RadixSlider.Root>
);
