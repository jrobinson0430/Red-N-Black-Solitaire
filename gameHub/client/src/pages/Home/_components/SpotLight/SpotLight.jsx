const SpotLight = () => {
  // db call to get the scores docs to populate this component
  return (
    <>
      <h1 className='text-center'>Spot Light</h1>
      <div
        className='accordion'
        id='accordion'
      >
        <div className='accordion-item'>
          <h2
            className='accordion-header'
            id='headingOne'
          >
            <button
              className='accordion-button collapsed'
              type='button'
              data-bs-toggle='collapse'
              data-bs-target='#collapseOne'
              aria-expanded='true'
              aria-controls='collapseOne'
            >
              Minesweeper
            </button>
          </h2>
          <div
            id='collapseOne'
            className='accordion-collapse collapse'
            aria-labelledby='headingOne'
            data-bs-parent='#accordion'
          >
            <div className='accordion-body'>
              <ol>
                <li>jrob0430 | 5000</li>
              </ol>
            </div>
          </div>
        </div>
        <div className='accordion-item'>
          <h2
            className='accordion-header'
            id='headingTwo'
          >
            <button
              className='accordion-button collapsed'
              type='button'
              data-bs-toggle='collapse'
              data-bs-target='#collapseTwo'
              aria-expanded='false'
              aria-controls='collapseTwo'
            >
              Red N Black
            </button>
          </h2>
          <div
            id='collapseTwo'
            className='accordion-collapse collapse'
            aria-labelledby='headingTwo'
            data-bs-parent='#accordion'
          >
            <div className='accordion-body'>
              <ol>
                <li>jrob0430 | 5000</li>
              </ol>
            </div>
          </div>
        </div>
        <div className='accordion-item'>
          <h2
            className='accordion-header'
            id='headingThree'
          >
            <button
              className='accordion-button collapsed'
              type='button'
              data-bs-toggle='collapse'
              data-bs-target='#collapseThree'
              aria-expanded='false'
              aria-controls='collapseThree'
            >
              Klondike
            </button>
          </h2>
          <div
            id='collapseThree'
            className='accordion-collapse collapse'
            aria-labelledby='headingThree'
            data-bs-parent='#accordion'
          >
            <div className='accordion-body'>
              <ol>
                <li>jrob0430 | 5000</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SpotLight;
