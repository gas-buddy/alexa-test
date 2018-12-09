import uuid from 'uuid';

export default {
  DEFAULT: {
    deviceId: `amzn1.ask.device.${uuid.v4()}`,
    Viewport: {
      experiences: [{
        arcMinuteWidth: 246,
        arcMinuteHeight: 144,
        canRotate: false,
        canResize: false,
      }],
      shape: 'RECTANGLE',
      pixelWidth: 1024,
      pixelHeight: 600,
      dpi: 160,
      currentPixelWidth: 1024,
      currentPixelHeight: 600,
      touch: [
        'SINGLE',
      ],
    },
  },
};
