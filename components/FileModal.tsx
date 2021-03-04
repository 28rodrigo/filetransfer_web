import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import styles from './Modal.module.css'
interface ModalProps{
    open:boolean,
    setOpen:React.Dispatch<React.SetStateAction<boolean>>,
    text:string,
    type:string
}
const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

const FileModal: React.FC<ModalProps> = (props)=> {
  const classes = useStyles();

  const handleClose = () => {
    props.setOpen(false);
  };

  return (
    <>
       {props.type==='link' &&
        <div>
         <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            className={classes.modal}
            open={props.open}
            onClose={handleClose}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
              timeout: 500,
            }}
          >
            <Fade in={props.open}>
              <div className={classes.paper}>

                <h2 id="transition-modal-title">Share this Link</h2>
                <div className={styles.div}> 
                  <a className={styles.a} href={props.text} id="transition-modal-description">{props.text}</a>
                  <button onClick={() => {navigator.clipboard.writeText(props.text);handleClose()}}>
                    <img className={styles.image}  src="/images/copy.png" width={25} height={22} alt="bin"/>
                  </button>
                </div>
                
              </div>
            </Fade>
          </Modal>
        </div>
      }
      {props.type==='contact' &&
        <div>
         <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            className={classes.modal}
            open={props.open}
            onClose={handleClose}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
              timeout: 500,
            }}
          >
            <Fade in={props.open}>
              <div className={classes.paper}>

                <h2 id="transition-modal-title">Contact Us</h2>
                <div className={styles.div}> 
                  <h4>EMAIL:</h4>
                  <p style={{marginLeft:'10px'}}>28rodrigopereira@gmail.com</p>
                </div>
                
              </div>
            </Fade>
          </Modal>
        </div>
      }
    </> 
      
  );
}
export default FileModal