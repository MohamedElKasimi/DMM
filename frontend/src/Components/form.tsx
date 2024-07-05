import { Button, TextField } from "@mui/material";

export default function Form(){
    return (
        <div className="flex flex-col w-full">
          <TextField label="ID" variant="outlined" className="mx-20" />
          <TextField label="Password" type="password" variant="outlined" className="mx-20 mt-5" />
          <Button variant="contained" className="mx-20 mt-4">Sign in</Button>
        </div>
      );
}