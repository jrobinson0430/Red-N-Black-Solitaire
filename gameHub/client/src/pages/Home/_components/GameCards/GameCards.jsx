import { useState, useContext } from 'react';
import UserContext from '../../../../contextProviders/UserContext';
// import GameContext from '../../../../contextProviders/GameContext';

import {
  Card,
  ListGroup,
  ListGroupItem,
  Button,
  CardGroup,
} from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import './GameCards.css';
import axiosAPI from '../../../../apis/axios';

const GameCards = ({ data }) => {
  const { utilityBox } = useContext(UserContext);
  // const { gameData, setGameData } = useContext(GameContext);
  const { navigate, v4 } = utilityBox;
  const { name, blurb, photo, path, rating, gamesPlayed, _id } = data;

  // src="./images/backgrounds/background1.jpeg" // pic placeholder

  return (
    <>
      <Card
        style={{ maxWidth: '26rem' }}
        className='m-1 border border-dark'
      >
        <Card.Img
          className=''
          variant='top'
          src={photo}
        />
        <Card.Body className='text-center'>
          <Card.Title style={{ fontSize: '1.5rem' }}>{name}</Card.Title>
          <Button
            variant='dark'
            className='w-100 mb-2'
            onClick={() => navigate(`/game${path}`)}
          >
            Play
          </Button>
          <Card.Text>{blurb}</Card.Text>
        </Card.Body>
        <ListGroup className='list-group-flush text-center'>
          <ListGroupItem>Games Played: {gamesPlayed}</ListGroupItem>
        </ListGroup>
        {/* <Card.Body className='text-end'> */}

        {/* </Card.Body> */}
      </Card>
    </>
  );
};

export default GameCards;
