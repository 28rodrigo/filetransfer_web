import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import styles from '../../styles/Home.module.css'
import axios from 'axios'
import fs from 'fs'
import path from 'path'
import prettyBytes from 'pretty-bytes';
import router from'next/router'
import { useEffect } from 'react'
// posts will be populated at build time by getStaticProps()
function Download(props) {
  const router = useRouter()
  useEffect(()=>{
    if(props.error)
    {
      router.push('/error');
    }
  })
  const handleDownload=async () => {
    axios({
      url: `/api/downloads/${props.id}`, //your url
      method: 'GET',
      responseType: 'blob', // important
    }).then((response) => {
       const url = window.URL.createObjectURL(new Blob([response.data]));
       const link = document.createElement('a');
       link.href = url;
       link.setAttribute('download', `filetransfer-${Date.now}.zip`); //or any other extension
       document.body.appendChild(link);
       link.click();
    });
  }
  return (
    <div className={styles.container}>
      <Head>
        <title>File Transfer-Download</title>.
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <nav className={styles.nav}>
        <h2>File Transfer</h2>
        <div>
          <p>Contact Us</p>
        </div>
        
      </nav>
      
      <main className={styles.main}>
        <button className={styles.button} onClick={handleDownload}>Download File</button>
        <p>{props.id}</p>
        <p style={{marginTop:'-0.6rem'}}>{props.size}</p>
        <Link href="/"><button className={styles.button1}>Send New Files</button></Link>
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
export async function getServerSideProps(context){
  const id=context.query.id;
  const filePath= path.resolve('.', 'public','uploads',id);
  if(!fileExistsSync(filePath))
  {
    return { 
      props:{
        error:true,
        id:'',
        size:'',
  
    }}
  }
  return { 
    props:{
      error:false,
      id:id,
      size:prettyBytes(fs.statSync(filePath).size),

  }}
}

// export async function getStaticProps({params}) {
//     const filesDirectory= path.resolve('.', 'public','uploads');
//     const filenames= await fs.readdir(filesDirectory);


//   const files = filenames.map(async (filename) => {
//     const filePath = path.join(filesDirectory, filename)
//     const fileContents = await fs.readFile(filePath, 'utf8')
//     // Generally you would parse/transform the contents
//     // For example you can transform markdown to HTML here

//     return {
//       filename,
//       content: await (await fs.stat(filePath)).size
//   }});
//   // By returning { props: posts }, the Blog component
//   // will receive `posts` as a prop at build time
//   return {
//     props: {
//       files: await Promise.all(files),
//     },
//   }
// }
// export async function getStaticPaths() {
//     const filesDirectory= path.resolve('.', 'public','uploads');
//     const filenames= await fs.readdir(filesDirectory);
// console.log(filenames);

//   const files = filenames.map((filename) => {
//     return {
//         params:{
//             id:filename
//         },
        
//     }
// });
//   return {paths:files,fallback: false}
//  }
const fileExistsSync = (file) => {
  try {
      fs.accessSync(file, fs.constants.R_OK | fs.constants.W_OK);
      return true;
    } catch (err) {
      return false;
    }
}
export default Download