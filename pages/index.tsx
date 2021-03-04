import Head from 'next/head'
import Link from 'next/link'
import styles from '../styles/Home.module.css'
import Item from '../components/item';
import { useEffect, useState } from 'react';
import axios from 'axios';
import JsZip from 'jszip'
const prettyBytes = require('pretty-bytes');
import FileModal from './../components/FileModal'
import CircularProgress from '@material-ui/core/CircularProgress';

interface FileDictionary{
  filename: string;
  file:File;
}
interface ItemProps{
  filename: string;
  size:string;
  key:string
  type:string
}
export default function Home() {
  const [buttonVisible,setButtonVisible]=useState(false);
  const [barVisible,setBarVisible]=useState(false);
  const [items,setItems]=useState(Array<ItemProps>());
  const [files,setFiles]=useState(Array<FileDictionary>());
  const [open,setOpen]=useState(false);
  const [openContact,setOpenContact]=useState(false);
  const [text,setText]=useState('');
  useEffect(() => {
    
  })
  const handleDeleteButton = (filename:string)=>{
    var arr=files;
    var ite=items;
    
    arr=arr.filter(function(ele){ 
      return ele.filename!= filename; 
    });
    setFiles(arr);

    ite=ite.filter(function(ele){ 
      return ele.filename != filename; 
    });
    setItems(ite);
  
    if(items.length==1)
    {
      setButtonVisible(false);
    }
   
  }
  const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const formDatas = files;
    
    Array.from(event.target.files).forEach((file) => {
      if(file.size>100000000)
        {
          alert("Only allow files under 100Mb!")
          if(buttonVisible!==true)
          setButtonVisible(false);
        }else{
          formDatas.push({filename:file.name,file:file})
          setButtonVisible(true);
          setItems(items.concat({filename:file.name,key:file.name,size:prettyBytes(file.size),type:file.type}));
        }
     
    });
    setFiles(formDatas);  
  };
  const handleClickContact=()=>{
    setOpenContact(true);
  }
  const handleSubmitButton=async()=>{
    setBarVisible(true);
    const formData=new FormData();
    const zip=new JsZip();
    const config = {
      headers: { 'content-type': 'multipart/form-data',
     },
      onUploadProgress: (event) => {
        console.log(`Current progress:`, Math.round((event.loaded * 100) / event.total));
      },
    };

    files.map(file=>{
     // formData.append('theFiles',file.file);
     zip.file(file.file.name,file.file);
    });

    var content = await zip.generateAsync({
      type: "blob",
      compression: "DEFLATE"
    });
      formData.append("theFiles",content);
    
    const response=await axios.post('/api/upload', formData, config);
    setFiles(Array<FileDictionary>());
    setItems(Array<ItemProps>());
    setButtonVisible(false);
    if(response.status!=200)
    {
      if(response.status!=500)
        alert("Server Error! Please try later.");
      
      alert("Error! Please try later.");
      
    }
    setText(response.data.fileLocation);
    setOpen(true);
    setBarVisible(false);
  }
  return (
    <div className={styles.container}>
      <Head>
        <title>File Transfer</title>.
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <nav className={styles.nav}>
        <Link href="/"><h2>File Transfer</h2></Link>
        <div>
          <p className={styles.navp} onClick={handleClickContact}>Contact Us</p>
        </div>
        
        
      </nav>
      <p className={styles.pdesc}>Send files up to 100Mb for free. Files are available for download during 12 hours</p>
      {barVisible && <div className={styles.bar}>
          <div>
            <CircularProgress />
          </div>
          
      </div>
      }
      <main className={styles.main}>
          <label className={styles.label}>
            Choose a file
            <input multiple hidden type="file" name="file" id="file" className="input" onChange={onChangeHandler} />
          </label>
          
          {items.map(item =>{
              console.log(item);
              return(
              <div className={styles.div} key={item.filename} id={item.filename}>
                <Item name={item.filename} size={item.size} type={item.type} delete={handleDeleteButton}/>
              </div>
              )
              
            })}
          {buttonVisible && <button onClick={handleSubmitButton} className={styles.button}>Share Files</button>}
     <FileModal type="link" open={open} setOpen={setOpen} text={text}/>
     <FileModal type="contact" open={openContact} setOpen={setOpenContact} text=""/>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://github.com/28rodrigo"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <h3>&nbsp;&nbsp;Rodrigo Pereira</h3>
        </a>
      </footer>
    </div>
  )
}
