import * as React from 'react';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { IconButton } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 300,
    bgcolor: 'white',
    borderRadius: '10px',
    boxShadow: 24,
    p: 4,
    minHeight: 100
};

export default function LoadingModal(props) {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);


    React.useEffect(() => {
        if (props.isLoading !== false) {
            handleOpen();
        }
        else{
            handleClose();
        }
    }, [props.isLoading])


    return (
        <div>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <IconButton aria-label="Example" sx={{ position: 'absolute', left: '89%', bottom: '72%' }} onClick={handleClose}>
                        <FontAwesomeIcon icon={faXmark} style={{ color: "#000000", }} />
                    </IconButton>
                    <Typography id="modal-modal-title" variant="h6" component="h3" sx={{ color: "#3d0766",display: 'flex', justifyContent: 'flex-start', fontWeight: 'bold'}}>
                        {props.msg}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: '20px'}}>
                        <CircularProgress color='secondary'/>
                    </Box>
                </Box>
            </Modal>
        </div>
    );
}