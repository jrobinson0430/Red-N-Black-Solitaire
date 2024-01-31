import { useContext } from 'react';
import UserContext from '../../contextProviders/UserContext';

const HomeButton = ({ positioning }) => {
  const { utilityBox } = useContext(UserContext);
  const { navigate } = utilityBox;

  return (
    <div
      style={positioning}
      className='position-absolute'
    >
      <button
        type='button'
        className='btn p-0 py-1'
        onClick={() => navigate('/home')}
      >
        <i
          className='fa fa-fw'
          style={{ fontSize: '1.8rem' }}
          aria-hidden='true'
        >
          
        </i>
      </button>
    </div>
  );
};

export default HomeButton;

/**
 * @description Component used on game pages for navigational purposes.
 * 
 * 
 * @argument positioning: object containing the css positioning 
    ie: {top: '1rem', right: '1rem'}
 */
