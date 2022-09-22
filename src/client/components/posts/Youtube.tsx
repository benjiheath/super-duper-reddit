import { AspectRatio, AspectRatioProps } from '@chakra-ui/react';
import _ from 'lodash';

interface Props extends AspectRatioProps {
  url: string;
  compact?: boolean;
}

const Youtube = (props: Props) => {
  const { url, compact, ...rest } = props;

  const convertedYoutubeUrl = props.url
    .replace('watch?v=', 'embed/')
    .replace('youtu.be', 'youtube.com/embed/');

  return (
    <AspectRatio
      ratio={16 / 9}
      alignSelf={'normal'}
      borderRadius={20}
      width={compact ? 350 : undefined}
      {...rest}
    >
      <iframe src={convertedYoutubeUrl} allowFullScreen style={{ borderRadius: 8 }} />
    </AspectRatio>
  );
};

export default Youtube;
