import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import PostAddIcon from '@material-ui/icons/PostAdd';
import { NavLink } from 'react-router-dom';

import './AdminDrawer.css';
import { useAuth } from '../../context/auth-context';

const useStyles = makeStyles({
  list: {
    width: 250,
    marginTop: 20,
    textDecoration: 'none',
  },
  fullList: {
    width: 'auto',
  },
});

export default function AdminDrawer({ navToggle }) {
  // const location = useLocation();
  // const currentUrl = location.pathname;
  const { logout } = useAuth();
  const classes = useStyles();
  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }
    setState({ ...state, [anchor]: open });
  };

  const list = (anchor) => (
    <div
      className={clsx(classes.list)}
      role='presentation'
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List className='nav__list'>
        <NavLink to='/admin/new'>
          <ListItem button className={classes.listItem}>
            <ListItemIcon>
              <InboxIcon />
            </ListItemIcon>
            <ListItemText primary='상품등록' />
          </ListItem>
        </NavLink>
        <NavLink to='/admin/products'>
          <ListItem button className={classes.listItem}>
            <ListItemIcon>
              <PostAddIcon />
            </ListItemIcon>
            <ListItemText primary='상품관리' />
          </ListItem>
        </NavLink>
        <button
          className='logout'
          onClick={() => {
            logout();
          }}
        >
          <ListItem button className={classes.listItem}>
            <ListItemIcon>
              <ExitToAppIcon />
            </ListItemIcon>
            <ListItemText primary='로그아웃' />
          </ListItem>
        </button>
      </List>
    </div>
  );

  return (
    <>
      {['left'].map((anchor) => (
        <React.Fragment key={anchor}>
          <Button onClick={toggleDrawer(anchor, true)} className='navLink'>
            관리자
          </Button>
          <Drawer
            anchor={anchor}
            open={state[anchor]}
            onClose={toggleDrawer(anchor, false)}
          >
            {list(anchor)}
          </Drawer>
        </React.Fragment>
      ))}
    </>
  );
}
