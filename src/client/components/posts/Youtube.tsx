import { AspectRatio, AspectRatioProps } from '@chakra-ui/react';
import _ from 'lodash';

interface Props extends AspectRatioProps {
  url: string;
}

const Youtube = (props: Props) => {
  const { url, ...rest } = props;

  const convertedUrl = props.url.replace('watch?v=', 'embed/').replace('youtu.be', 'youtube.com/embed/');

  return (
    <AspectRatio ratio={16 / 9} alignSelf={'normal'} borderRadius={20} {...rest}>
      <iframe src={convertedUrl} allowFullScreen style={{ borderRadius: 8 }} />
    </AspectRatio>
  );
};

export default Youtube;
