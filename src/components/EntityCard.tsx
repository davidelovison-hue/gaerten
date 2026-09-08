import { useCallback, useEffect, useRef, useState } from 'react';
import type { PlanEntity, VariantAxis } from '../data/planCatalog';
import { getEntityImages, getEntityUnitPrice } from '../data/planCatalog';
import { getDefaultSelections, useCart } from '../lib/cartContext';
import {
  formatEntityTotalPrice,
  getEntityMetaLines,
  getListingTagTone,
  getPreviewBullets,
  isTicketWaveLayout,
  showTitleListingTag,
} from '../lib/entityHelpers';
import './EntityCard.css';

type EntityCardProps = {
  entity: PlanEntity;
};

function listingTagClass(tone: ReturnType<typeof getListingTagTone>) {
  if (tone === 'selling_fast') return 'entityListingTag entityListingTagSellingFast';
  if (tone === 'limited') return 'entityListingTag entityListingTagLimited';
  if (tone === 'sold_out') return 'entityListingTag entityListingTagSoldOut';
  return 'entityListingTag';
}

export function EntityCard({ entity }: EntityCardProps) {
  const { getQuantity, setQuantity: setCartQuantity } = useCart();
  const images = getEntityImages(entity.id);
  const hideImage =
    entity.hideImage || entity.id.startsWith('park-') || entity.id.startsWith('bus-');
  const hasImages = !hideImage && images.length > 0;
  const hasGallery = hasImages && images.length > 1;
  const listingTone = getListingTagTone(entity.listingTag);
  const isSoldOut = listingTone === 'sold_out';
  const isWaveTicket = isTicketWaveLayout(entity);
  const hasNonWaveAxes = !!entity.variantAxes?.some((axis) => axis.id !== 'wave');
  const metaLines = getEntityMetaLines(entity);
  const previewBullets = getPreviewBullets(entity);
  const showDescription =
    !!entity.description?.trim() &&
    entity.type === 'configurable_single' &&
    !(isWaveTicket && hasNonWaveAxes);
  const showTitleTagArea =
    !isSoldOut && (isWaveTicket || (showTitleListingTag(entity) && !!entity.listingTag?.trim()));
  const showImageTag = !!entity.listingTag?.trim() && hasImages;
  const showListingInTitle =
    !!entity.listingTag?.trim() && showTitleTagArea && !showImageTag;

  const [imageIndex, setImageIndex] = useState(0);
  const [selectedByAxis, setSelectedByAxis] = useState<Record<string, string>>(() =>
    getDefaultSelections(entity),
  );
  const stripRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setImageIndex(0);
    if (stripRef.current) stripRef.current.scrollLeft = 0;
    setSelectedByAxis(getDefaultSelections(entity));
  }, [entity.id]);

  const quantity = getQuantity(entity.id, selectedByAxis);
  const unitPrice = getEntityUnitPrice(entity, selectedByAxis);
  const isSelectedOptionSoldOut =
    !isSoldOut &&
    !!entity.variantAxes?.some((axis) => {
      const selected = selectedByAxis[axis.id];
      return !!selected && (axis.disabledOptions ?? []).includes(selected);
    });
  const showUnavailableFooter = isSoldOut || isSelectedOptionSoldOut;

  const syncImageIndex = useCallback(() => {
    const strip = stripRef.current;
    if (!strip || !hasGallery) return;
    const width = strip.clientWidth;
    if (width <= 0) return;
    setImageIndex(Math.min(Math.max(0, Math.round(strip.scrollLeft / width)), images.length - 1));
  }, [hasGallery, images.length]);

  const scrollToImage = useCallback(
    (index: number) => {
      const strip = stripRef.current;
      if (!strip || !hasGallery) return;
      strip.scrollTo({ left: index * strip.clientWidth, behavior: 'smooth' });
      setImageIndex(index);
    },
    [hasGallery],
  );

  const updateQuantity = (nextQuantity: number) => {
    const clamped = Math.max(0, Math.min(99, nextQuantity));
    setCartQuantity(entity, clamped, selectedByAxis);
  };

  const selectAxis = (axisId: string, value: string) => {
    setSelectedByAxis((current) => {
      return { ...current, [axisId]: value };
    });
  };

  const renderAxis = (axis: VariantAxis) => {
    const selected = selectedByAxis[axis.id];
    const disabledOptions = new Set(axis.disabledOptions ?? []);

    return (
      <div key={axis.id} className="axis">
        <div
          className={axis.id === 'route' ? 'pillRow pillRowStacked' : 'pillRow'}
          role="group"
          aria-label={axis.label}
        >
          {axis.options.map((option) => {
            const isSelected = selected === option;
            const isOptionSoldOut = disabledOptions.has(option);
            // Whole-card sold out: chips stay locked. Sold-out options stay clickable to preview price.
            const isOptionDisabled = isSoldOut;
            const pillClass = [
              'pill',
              isSelected ? 'pillSelected' : '',
              isOptionSoldOut ? 'pillSoldOut' : '',
            ]
              .filter(Boolean)
              .join(' ');
            return (
              <button
                key={option}
                type="button"
                className={pillClass}
                aria-pressed={isSelected}
                aria-disabled={isOptionSoldOut || undefined}
                disabled={isOptionDisabled}
                onClick={() => selectAxis(axis.id, option)}
              >
                {option}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <article
      id={`plan-entity-${entity.id}`}
      className={isSoldOut ? 'card cardSoldOut' : hideImage ? 'card cardNoImage' : 'card'}
    >
      {hasImages ? (
        <div className="imageWrapper">
          {showImageTag ? (
            <div className="imageTagsCorner">
              <span className={listingTagClass(listingTone)}>{entity.listingTag}</span>
            </div>
          ) : null}

          {hasGallery ? (
            <>
              <div
                ref={stripRef}
                className="imageStrip"
                aria-label="Image gallery"
                onScroll={syncImageIndex}
              >
                {images.map((src, index) => (
                  <div key={`${src}-${index}`} className="imageSlide">
                    <img
                      className="image"
                      src={src}
                      alt=""
                      draggable={false}
                      onError={(event) => {
                        event.currentTarget.src = `${import.meta.env.BASE_URL}entity-ticket.jpg`;
                      }}
                    />
                  </div>
                ))}
              </div>
              <button
                type="button"
                className="carouselArrow carouselArrowPrev"
                aria-label="Previous image"
                disabled={imageIndex <= 0}
                onClick={() => scrollToImage(Math.max(0, imageIndex - 1))}
              >
                ‹
              </button>
              <button
                type="button"
                className="carouselArrow carouselArrowNext"
                aria-label="Next image"
                disabled={imageIndex >= images.length - 1}
                onClick={() => scrollToImage(Math.min(images.length - 1, imageIndex + 1))}
              >
                ›
              </button>
              <div className="dots" role="tablist" aria-label="Image indicators">
                {images.map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    role="tab"
                    aria-selected={index === imageIndex}
                    className={index === imageIndex ? 'dotBtn dotBtnActive' : 'dotBtn'}
                    aria-label={`Go to image ${index + 1}`}
                    onClick={() => scrollToImage(index)}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="imageSinglePane">
              <img
                className="image"
                src={images[0]}
                alt=""
                onError={(event) => {
                  event.currentTarget.src = `${import.meta.env.BASE_URL}entity-ticket.jpg`;
                }}
              />
            </div>
          )}
        </div>
      ) : null}

      <div className={isWaveTicket ? 'content contentTicketWaveLayout' : 'content'}>
        {isWaveTicket ? (
          <>
            <div className="header cardWaveTitleSlot">
              <h3 className="title">{entity.name}</h3>
              {showTitleTagArea ? (
                <div
                  className={
                    !showListingInTitle ? 'titleTagsWrap titleTagsWrapTicketStub' : 'titleTagsWrap'
                  }
                  aria-hidden={!showListingInTitle ? true : undefined}
                >
                  {showListingInTitle ? (
                    <span className={`${listingTagClass(listingTone)} entityListingTagInTitle`}>
                      {entity.listingTag}
                    </span>
                  ) : null}
                </div>
              ) : null}
            </div>

            <div className="cardWaveSubtextSlot leadRestTicket">
              {metaLines.length > 0 ? (
                <div className="meta">
                  {metaLines.map((line) => (
                    <p key={line} className="metaLine metaLineClamp">
                      {line}
                    </p>
                  ))}
                </div>
              ) : null}

              {showDescription ? (
                <p className="description descriptionClamp">{entity.description}</p>
              ) : null}

              {previewBullets.length > 0 ? (
                <ul className="benefits benefitsPreview">
                  {previewBullets.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : null}
            </div>

            <div className="cardWaveMidSpacer" aria-hidden="true" />

            <div className="cardWaveChipsSlot cardChipsSlot">{entity.variantAxes?.map(renderAxis)}</div>

            <div className="footer">
              {showUnavailableFooter ? (
                <div className="priceRowWithStepper">
                  <div className="price">
                    <span className="priceAmount">{formatEntityTotalPrice(unitPrice)}</span>
                    <span className="fees"> incl. fees</span>
                  </div>
                  <span className="soldOutPill">Sold out</span>
                </div>
              ) : (
                <div className="priceRowWithStepper">
                  <div className="price">
                    <span className="priceAmount">{formatEntityTotalPrice(unitPrice)}</span>
                    <span className="fees"> incl. fees</span>
                  </div>
                  <div className="qty" aria-label="Quantity">
                    <button
                      type="button"
                      className="qtyBtnMinus"
                      aria-label="Decrease quantity"
                      disabled={quantity <= 0}
                      onClick={() => updateQuantity(quantity - 1)}
                    >
                      −
                    </button>
                    <span className="qtyValue">{quantity}</span>
                    <button
                      type="button"
                      className="qtyBtnPlus"
                      aria-label="Increase quantity"
                      onClick={() => updateQuantity(quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="lead">
            <div className="header">
              <h3 className="title">{entity.name}</h3>
              {showTitleTagArea ? (
                <div className="titleTagsWrap">
                  {showListingInTitle ? (
                    <span className={`${listingTagClass(listingTone)} entityListingTagInTitle`}>
                      {entity.listingTag}
                    </span>
                  ) : null}
                </div>
              ) : null}
            </div>

            <div className="cardConfigSubtextSlot">
              {metaLines.length > 0 ? (
                <div className="meta">
                  {metaLines.map((line) => (
                    <p key={line} className="metaLine">
                      {line}
                    </p>
                  ))}
                </div>
              ) : null}

              {showDescription ? (
                <p className="description descriptionClamp">{entity.description}</p>
              ) : null}

              {previewBullets.length > 0 ? (
                <ul className="benefits benefitsPreview">
                  {previewBullets.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : null}
            </div>

            {entity.variantAxes?.length ? (
              <>
                <div className="cardConfigMidSpacer" aria-hidden="true" />
                <div className="cardChipsSlot">{entity.variantAxes.map(renderAxis)}</div>
              </>
            ) : null}
          </div>
        )}

        {!isWaveTicket ? (
          <div className="footer">
            {showUnavailableFooter ? (
              <div className="priceRowWithStepper">
                <div className="price">
                  <span className="priceAmount">{formatEntityTotalPrice(unitPrice)}</span>
                  <span className="fees"> incl. fees</span>
                </div>
                <span className="soldOutPill">Sold out</span>
              </div>
            ) : (
              <div className="priceRowWithStepper">
                <div className="price">
                  <span className="priceAmount">{formatEntityTotalPrice(unitPrice)}</span>
                  <span className="fees"> incl. fees</span>
                </div>
                <div className="qty" aria-label="Quantity">
                  <button
                    type="button"
                    className="qtyBtnMinus"
                    aria-label="Decrease quantity"
                    disabled={quantity <= 0}
                    onClick={() => updateQuantity(quantity - 1)}
                  >
                    −
                  </button>
                  <span className="qtyValue">{quantity}</span>
                  <button
                    type="button"
                    className="qtyBtnPlus"
                    aria-label="Increase quantity"
                    onClick={() => updateQuantity(quantity + 1)}
                  >
                    +
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </article>
  );
}
