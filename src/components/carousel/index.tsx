import { FC, ReactNode } from "react";
import { EmblaOptionsType } from "embla-carousel";
import { DotButton, useDotButton } from "./dot-button";
import useEmblaCarousel from "embla-carousel-react";
import "./carousel.css";

type ItemPropType = {
	children: ReactNode;
	options?: EmblaOptionsType;
};

export const EmblaCarouselItem: FC<ItemPropType> = (props) => {
	const { children } = props;
	return (
		<div className="embla__slide">
			<div className="embla__slide__number">{children}</div>
		</div>
	);
};

type PropType = {
	children: ReactNode;
	options?: EmblaOptionsType;
};

const EmblaCarousel: FC<PropType> = (props) => {
	const { children, options } = props;
	const [emblaRef, emblaApi] = useEmblaCarousel(options);

	const { selectedIndex, scrollSnaps, onDotButtonClick } = useDotButton(emblaApi);

	return (
		<section className="embla">
			<div className="embla__viewport" ref={emblaRef}>
				<div className="embla__container">{children}</div>
			</div>

			<div className="embla__controls">
				<div className="embla__dots">
					{scrollSnaps.map((_, index) => (
						<DotButton
							key={index}
							onClick={() => onDotButtonClick(index)}
							className={"embla__dot".concat(
								index === selectedIndex ? " embla__dot--selected" : ""
							)}
						/>
					))}
				</div>
			</div>
		</section>
	);
};

export default EmblaCarousel;
