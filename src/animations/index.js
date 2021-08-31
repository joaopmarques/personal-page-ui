// Text switcher in hero area
export const heroStringVariants = {
  entrance: {
    opacity: 0,
    y: -40,
  },
  static: {
    opacity: 1,
    y: 0,
  },
  exit: {
    opacity: 0,
    y: 40,
  },
};

export const staggeredList = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.8,
      delayChilden: 1,
      staggerChildren: 1,
    },
  },
};

export const staggeredListItem = {
  hidden: {
    scale: 0.9,
    opacity: 0,
  },
  visible: {
    scale: 1,
    opacity: 1,
  },
};

export const titleVariant = {
  hidden: { opacity: 0, scale: 0 },
  visible: { opacity: 1, scale: 1.1 },
};
