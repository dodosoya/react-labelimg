import PropTypes from 'prop-types';

const SVGImage = ({ href, width, height }) => (
  <image
    href={href}
    width={width}
    height={height}
    preserveAspectRatio="xMidYMid slice"
  />
);

SVGImage.propTypes = {
  href: PropTypes.string.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired
};

export default SVGImage;
