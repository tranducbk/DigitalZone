import React from 'react'
import { Link } from 'react-router-dom'
import './MenuBar.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronRight } from '@fortawesome/free-solid-svg-icons'
import { PiTelevision } from "react-icons/pi";
import { FaTools } from "react-icons/fa";
import { IoPhonePortraitOutline } from "react-icons/io5";
import { FaLaptop } from "react-icons/fa";
import { CiHeadphones } from "react-icons/ci";
import { FaKeyboard } from "react-icons/fa";
import { FaMouse } from "react-icons/fa";
function MenuBar() {
  return (
    <>
      <div className='menu-bar'>
        <div className="label-menu-bar">
          <Link to='/điện thoại'>
            <div className="label-item">
              <div className="item-content">
                <div className="category-icon">
                  <IoPhonePortraitOutline style={{fontSize:'27px'}}/>
                </div>
                <span className='item-link'>Điện thoại</span>
              </div>
              <div className='right-icon'>
                <FontAwesomeIcon icon={faChevronRight} />
              </div>
            </div>
          </Link>
        </div>
        <div className="label-menu-bar">
          <Link to='/laptop'>
            <div className="label-item">
              <div className="item-content">
                <div className="category-icon">
                  <FaLaptop style={{fontSize:'27px'}}/>
                </div>
                <span className='item-link'>Laptop</span>
              </div>
              <div className='right-icon'>
                <FontAwesomeIcon icon={faChevronRight} />
              </div>
            </div>
          </Link>
        </div>
        <div className="label-menu-bar">
          <Link to='/tai nghe'>
            <div className="label-item">
              <div className="item-content">
                <div className="category-icon">
                  <CiHeadphones  style={{fontSize:'27px'}}/>
                </div>
                <span className='item-link'>Tai Nghe</span>
              </div>
              <div className='right-icon'>
                <FontAwesomeIcon icon={faChevronRight} />
              </div>
            </div>
          </Link>
        </div>
        <div className="label-menu-bar">
          <Link to='/bàn phím'>
            <div className="label-item">
              <div className="item-content">
                <div className="category-icon">
                  <FaKeyboard style={{fontSize:'27px'}} />
                </div>
                <span className='item-link'>Bàn Phím</span>
              </div>
              <div className='right-icon'>
                <FontAwesomeIcon icon={faChevronRight} />
              </div>
            </div>
          </Link>
        </div>
        <div className="label-menu-bar">
          <Link to='/chuột'>
            <div className="label-item">
              <div className="item-content">
                <div className="category-icon">
                  <FaMouse style={{fontSize:'27px'}}/>
                </div>
                <span className='item-link'>Chuột</span>
              </div>
              <div className='right-icon'>
                <FontAwesomeIcon icon={faChevronRight} />
              </div>
            </div>
          </Link>
        </div>
        <div className="label-menu-bar">
          <Link to='/phụ kiện'>
            <div className="label-item">
              <div className="item-content">
                <div className="category-icon">
                <FaTools style={{fontSize:'27px'}} />
                </div>
                <span style={{textDecoration:'none'}} className='item-link'>Phụ Kiện</span>
              </div> 
              <div className='right-icon'>
                <FontAwesomeIcon icon={faChevronRight} />
              </div>
            </div>
          </Link>
        </div>
        <div className="label-menu-bar">
          <Link to='/tivi'>
            <div className="label-item">
              <div className="item-content">
                <div className="category-icon">
                  <PiTelevision style={{fontSize:'27px'}} />
                </div>
                <span className='item-link'>Ti Vi</span>
              </div>
              <div className='right-icon'>
                <FontAwesomeIcon icon={faChevronRight} />
              </div>
            </div>
          </Link>
        </div>
      </div>
    </>
  )
}

export default MenuBar;
