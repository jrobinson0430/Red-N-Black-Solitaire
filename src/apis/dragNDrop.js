const dragNDrop = (() => {
  const start = (dragPayload) => (event) =>
    event.dataTransfer.setData('dragCard', JSON.stringify(dragPayload));

  const over = () => (event) => {
    event.preventDefault();
    return false;
  };

  const drop = (dropPayload) => (event) => {
    const dragPayload = JSON.parse(event.dataTransfer.getData('dragCard'));
    return dropPayload.gameMoves(dragPayload, dropPayload);
  };

  return {
    start,
    over,
    drop,
  };
})();

export default dragNDrop;
