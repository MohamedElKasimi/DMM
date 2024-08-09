"use client"

import { TextField, Button, Dialog, DialogTitle, DialogActions } from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";

export default function Form(){

    const [id, setId] = useState('');
    const [pass, setPass] = useState('');
    const [openModal, setOpenModal] = useState(false);
    const router = useRouter();
    const handleClose = ()=>{
      setOpenModal(false);
    }

    const handleSignin = async ()=>{
        try{
            const response = await axios.post('http://localhost:8000/api/login/', {
              "user_id":id, 
              "password":pass
            });
            console.log(response.data);
            sessionStorage.setItem('token', response.data.token)
            router.push('/dashboard');
        }
        catch(error){
            console.log(error);
        }
    }
    return (
        <div className="flex flex-col w-full">
          <TextField label="ID" variant="outlined" className="mx-20" value={id} onChange ={(e)=>setId(e.target.value)} />
          <TextField label="Password" type="password" variant="outlined" className="mx-20 mt-5" value={pass} onChange ={(e)=>setPass(e.target.value)} />
          <Button variant="contained" className="mx-20 mt-4" onClick={handleSignin}>Sign in</Button>
          <Dialog open={openModal} onClose={handleClose}>
              <DialogTitle>Invalid Credentials</DialogTitle>
              <DialogActions>
                  <Button onClick={handleClose}>Close</Button>
              </DialogActions>
            </Dialog>
        </div>
      );
}