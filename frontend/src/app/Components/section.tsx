import LockIcon from '@mui/icons-material/Lock';
import Form from './form';
import Image from 'next/image';

export default function Section(){
    return(<div className="bg-white absolute flex flex-col w-2/6 h-screen right-0 z-1 justify-center items-center">
        <Image className="top-4 left-4 absolute" src='/assets/logo.png' width={200} height={200} alt="Logo"></Image>
        <LockIcon className='bg-black rounded-full w-12 h-12 p-2'></LockIcon>
        <h1 className='text-black text-2xl m-2'>Sign in</h1>
        <Form></Form>
    </div>)
}