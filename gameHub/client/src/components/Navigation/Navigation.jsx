import { useState, useEffect } from 'react';
import { Nav, Button, Image } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import './Navigation.css';
const Navigation = () => {
  return (
    <>
      <Image
        className='navBtn'
        data-bs-toggle='offcanvas'
        data-bs-target='#offcanvasTop'
        aria-controls='offcanvasTop'
        src='/images/brand/brand_pause.png'
      />

      <div
        className='offcanvas offcanvas-start'
        data-bs-backdrop='false' // this is removing overlay
        tabIndex='-1'
        id='offcanvasTop'
        aria-labelledby='offcanvasTopLabel'
      >
        <div className='offcanvas-header'>
          <h5 id='offcanvasTopLabel'>Offcanvas top</h5>
          <Button
            type='button'
            className='btn-close text-reset'
            data-bs-dismiss='offcanvas'
            aria-label='Close'
          ></Button>
        </div>
        <div className='offcanvas-body'>
          <Nav className='flex-column'>
            <a
              className='links'
              href='/home'
              activeclassname='active'
            >
              Home
            </a>

            <NavLink
              className='links'
              to='/game'
              activeclassname='active'
            >
              Games
            </NavLink>
            <NavLink
              className='links'
              to='/games'
              activeclassname='active'
            >
              Link
            </NavLink>
          </Nav>
        </div>
      </div>
    </>
  );
};

export default Navigation;
