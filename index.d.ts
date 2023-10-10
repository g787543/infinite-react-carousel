import * as React from "react";

export interface CarouselProps {
  rows?: number;
  slidesPerRow?: number;
  slidesToShow?: number;
  className?: string;
  centerMode?: boolean;
  swipe?: boolean;
  adaptiveHeight?: boolean;
  centerPadding?: string | number;
  initialSlide?: boolean | number;
  pauseOnHover?: boolean;
  autoplay?: boolean;
  autoplayScroll?: number;
  autoplaySpeed?: number;
  beforeChange?: (oldIndex: number, newIndex: number) => void;
  afterChange?: (index: number) => void;
  duration?: number;
  shift?: number;
  arrows?: boolean;
  arrowsBlock?: boolean;
  arrowsScroll?: number;
  prevArrow?: React.ReactElement;
  nextArrow?: React.ReactElement;
  dots?: boolean;
  dotsClass?: string;
  dotsScroll?: number;
  appendDots?: (dots: React.ReactElement[]) => React.ReactElement;
  customPaging?: (i: number) => React.ReactElement;
  onReszie?: (e: Event) => void;
  onSwipe?: (direction: string) => void;
  accessibility?: boolean;
  wheel?: boolean;
  wheelScroll?: number;
  virtualList?: boolean;
  children?: React.ReactNode;
  overScan?: number;
}

export default class Carousel extends React.Component<CarouselProps> {
  slickNext(): void;
  slickPrev(): void;
  slickGoTo(slideNumber: number): void;
  slickPause(): void;
  slickPlay(): void;
}
