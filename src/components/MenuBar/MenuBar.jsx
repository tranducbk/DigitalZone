import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './MenuBar.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { PiTelevisionSimpleBold } from "react-icons/pi";
import { IoPhonePortraitOutline, IoLaptopOutline } from 'react-icons/io5';
import { FaMouse } from "react-icons/fa";
import { BsKeyboard } from "react-icons/bs";
import { FaHeadphones } from 'react-icons/fa';
import { MdCable } from 'react-icons/md';

const menuItems = [
  { path: '/điện-thoại', label: 'Điện thoại', Icon: IoPhonePortraitOutline },
  { path: '/bàn-phím', label: 'Bàn phím', Icon: BsKeyboard },
  { path: '/laptop', label: 'Laptop', Icon: IoLaptopOutline },
  { path: '/tivi', label: 'TV', Icon: PiTelevisionSimpleBold },
  { path: '/chuột', label: 'Chuột', Icon: FaMouse },
  { path: '/phụ-kiện', label: 'Phụ kiện', Icon: MdCable },
  { path: '/tai-nghe', label: 'Tai nghe', Icon: FaHeadphones },
];

function MenuBar({ onClose }) {
  const handleClick = () => {
    if (typeof onClose === 'function') {
      onClose();
    }
  };

  return (
    <div className={styles.menuBarVertical}>
      <nav>
        <ul>
          {menuItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  isActive ? `${styles.menuLink} ${styles.active}` : styles.menuLink
                }
                onClick={handleClick}
              >
                <div className={styles.menuItemContent}>
                  <span className={styles.categoryIcon}>
                    <item.Icon />
                  </span>
                  <span className={styles.itemLabel}>{item.label}</span>
                </div>
                <FontAwesomeIcon icon={faChevronRight} className={styles.rightIcon} />
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

export default MenuBar;