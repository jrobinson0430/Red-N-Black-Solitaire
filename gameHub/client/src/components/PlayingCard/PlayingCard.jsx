import React, { useContext } from 'react';
import './PlayingCard.css';
import dragAndDrop from '../../apis/dragNDrop';

const PlayingCard = ({ cardProps, override = {} }) => {
  const { suit, rank, cardOffset, isDraggable, isShowingFace, leftOffset } =
    cardProps;

  const cardBack = isShowingFace ? '' : 'snowman';

  return (
    <div
      className={`cardContainer ${`${suit}-${rank}`} ${cardBack}`}
      draggable={isDraggable}
      style={{
        marginTop: `${cardOffset}rem`,
        marginLeft: `${leftOffset || ''}rem`,
        ...override,
      }}
      data-card_name={`${suit}-${rank}`} // use for showNextCard function
      onDragStart={dragAndDrop.start(cardProps)}
      onDragOver={dragAndDrop.over()}
      onDrop={dragAndDrop.drop(cardProps)}
    />
  );
};

export default PlayingCard;
