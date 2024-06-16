import { type FC, type ImgHTMLAttributes, useState } from 'react';

import { Loader } from './loader';

interface ImageWithLoaderProps extends ImgHTMLAttributes<HTMLImageElement> {}
export const ImageWithLoader: FC<ImageWithLoaderProps> = ({
  src,
  alt,
  className,
  width,
  height,
}) => {
  const [loading, setLoading] = useState(true);

  const handleImageLoad = () => {
    setLoading(false);
  };

  return (
    <div
      className={className}
      style={{
        position: 'relative',
        width: width || '100%',
        minWidth: width || '100%',
        height: height || '100%',
      }}
    >
      {loading && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: width || '100%',
            minWidth: width || '100%',
            height: height || '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Loader size={32} />
        </div>
      )}
      <img
        src={src}
        alt={alt}
        onLoad={handleImageLoad}
        style={{
          display: loading ? 'none' : 'block',
          width: width || '100%',
          height: height || 'auto',
          minWidth: width || '100%',
        }}
      />
    </div>
  );
};
