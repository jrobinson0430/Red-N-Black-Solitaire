import { useContext } from 'react';
import UserContext from '../../contextProviders/UserContext';
import GameContext from '../../contextProviders/GameContext';

import { GameCards, SpotLight, Ads } from './_components';
import { v4 } from 'uuid';

import { Container, Row, Col, Figure, Image, CardGroup } from 'react-bootstrap';
import './Home.css';

const Home = () => {
  const { utilityBox } = useContext(UserContext);
  const { gameData } = useContext(GameContext);
  // console.log(gameData)
  return (
    <>
      <Container
        fluid
        className='fadeInPage'
      >
        <h1 className='text-center'>Game Hub</h1>
        {/* <Figure className=' mb-0 mt-2 w-100 text-stawrt'>
          <Figure.Image
            width={100}
            // height={180}
            alt='Brand'
            className=''
            src='images/brand/brand_play.png'
          />
        </Figure> */}

        <Row className='mb-3'>
          <Col
            className=''
            lg={12}
            xl={3}
          >
            <SpotLight />
          </Col>
          <Col
            className=''
            sm={12}
            lg={12}
            xl={9}
          >
            <div>
              <h1 className='text-center'>Games</h1>
              <div className='d-flex flex-wrap justify-content-center'>
                {gameData.map((obj, i) => {
                  return (
                    <GameCards
                      data={obj}
                      key={v4()}
                    />
                  );
                })}
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Home;
