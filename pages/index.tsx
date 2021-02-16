import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { useForm } from 'react-hook-form';
import Image from 'next/image'
import Item from '../components/item';
import { useEffect, useState } from 'react';
import axios from 'axios';
import item from '../components/item';
import JsZip from 'jszip'
import{saveAs} from 'file-saver'
const prettyBytes = require('pretty-bytes');
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
  const [items,setItems]=useState(Array<ItemProps>());
  const [files,setFiles]=useState(Array<FileDictionary>());
  
  useEffect(() => {
    
  }, [items])
  const handleDeleteButton = (filename:string)=>{
    console.log("filename->"+filename)
    var arr=files;
    var ite=items;
    //document.getElementById(filename).remove();
    arr=arr.filter(function(ele){ 
      return ele.filename!= filename; 
    });
    setFiles(arr);

    ite=ite.filter(function(ele){ 
      return ele.filename != filename; 
    });
    setItems(ite);
    console.log("itemslenght->"+items.length[1])
    console.log("items->"+items[1])
    console.log("formdata->"+files[1])
    if(items.length==1)
    {
      setButtonVisible(false);
    }
   
  }
  const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files?.length) {
      return;
    }

    const formDatas = files;
    //const ite=items;
    setButtonVisible(true);
    Array.from(event.target.files).forEach((file) => {
      formDatas.push({filename:file.name,file:file})
     // ite.push();
      setItems(items.concat({filename:file.name,key:file.name,size:prettyBytes(file.size),type:file.type}));
    });
    setFiles(formDatas);
    console.log("itemslenght->"+items.length[1])
    console.log("items->"+items[1])
    console.log("formdata->"+files[1])
    
  };
  const handleSubmitButton=async()=>{
    const config = {
      headers: { 'content-type': 'multipart/form-data' },
      onUploadProgress: (event) => {
        console.log(`Current progress:`, Math.round((event.loaded * 100) / event.total));
      },
    };
    const formData=new FormData();
    const zip=new JsZip();
    files.map(file=>{
     // formData.append('theFiles',file.file);
     zip.file(file.file.name,file.file);
    });
    var content = await zip.generateAsync({
      type: "blob",
      compression: "DEFLATE"
    });
      formData.append("theFiles",content);
 
    
    
    const response = await axios.post('/api/upload', formData, config);
    setFiles(Array<FileDictionary>());
    setItems(Array<ItemProps>());
    setButtonVisible(false);
    alert(response.data.data);
  }
  return (
    <div className={styles.container}>
      <Head>
        <title>File Transfer</title>.
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <nav className={styles.nav}>
        <h2>File Transfer</h2>
        <div>
          <p>Contact Us</p>
        </div>
        
      </nav>
      <main className={styles.main}>
          <label className={styles.label}>
            Choose a file
            <input multiple hidden type="file" name="file" id="file" className="input" onChange={onChangeHandler } />
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
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <img src="/vercel.svg" alt="Vercel Logo" className={styles.logo} />
        </a>
      </footer>
    </div>
  )
}
