import { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import './Instructions.css';

const Instructions = ({ gameData, gameName }) => {
  const [currentGame] = gameData.filter((obj) => obj.name === gameName);

  if (!currentGame) return;

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <button
        type='button'
        className='helpBtn'
        onClick={handleShow}
      >
        ?
      </button>

      <Modal
        show={show}
        onHide={handleClose}
      >
        <Modal.Header closeButton>
          <Modal.Title className='w-100 text-center'>
            {currentGame.name} Instructions
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>{currentGame.rules}</Modal.Body>
      </Modal>
    </>
  );
};

export default Instructions;
