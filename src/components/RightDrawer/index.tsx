import * as React from 'react'
import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
// import Button from '@mui/material/Button';
import List from '@mui/material/List'
import Divider from '@mui/material/Divider'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import BuyingOptionsCard from '../BuyingOptionsCard'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import styles from './RightDrawer.module.scss'
import { faXmark } from '@fortawesome/free-solid-svg-icons'

type Anchor = 'top' | 'left' | 'bottom' | 'right'

interface RightDrawerProps {
  setCurrentOffer: any
  productOffers: any
}

const RightDrawer: React.FC<RightDrawerProps> = ({
  setCurrentOffer,
  productOffers,
}) => {
  const [state, setState] = React.useState({
    right: false,
  })

  const toggleDrawer =
    (anchor: 'right', open: boolean) =>
    (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === 'keydown' &&
        ((event as React.KeyboardEvent).key === 'Tab' ||
          (event as React.KeyboardEvent).key === 'Shift')
      ) {
        return
      }

      setState({ ...state, [anchor]: open })
    }

  const list = () => (
    <Box
      role="presentation"
      onClick={toggleDrawer('right', false)}
      onKeyDown={toggleDrawer('right', false)}
    >
      <List>
        <ListItem disablePadding>
          <ListItemButton>
            <div className={styles['top-bar']}>
              <p className={styles['heading']}>Other Buying Options</p>
              <FontAwesomeIcon
                icon={faXmark}
                onClick={toggleDrawer('right', false)}
                className={styles['cross-icon']}
              />
            </div>
          </ListItemButton>
        </ListItem>
      </List>
      <Divider />

      {productOffers?.map((offer: any) => (
        <List>
          <ListItem disablePadding>
            <ListItemButton>
              <BuyingOptionsCard
                setCurrentOffer={setCurrentOffer}
                productOffer={offer}
              />
            </ListItemButton>
          </ListItem>
        </List>
      ))}
    </Box>
  )

  return (
    <div>
      {/* <Button className={styles.button} onClick={toggleDrawer('right', true)}>
        See other buying options
      </Button> */}
      {/* <Drawer
        anchor={'right'}
        open={state['right']}
        onClose={toggleDrawer('right', false)}
      >
        {list()}
      </Drawer> */}
    </div>
  )
}

export default RightDrawer
