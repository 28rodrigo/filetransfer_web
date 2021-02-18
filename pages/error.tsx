import Head from 'next/head'
import styles from '../styles/Home.module.css'
import Link from 'next/link'
import { useForm } from 'react-hook-form';
import Image from 'next/image'
import Item from '../components/item';
import { useEffect, useState } from 'react';
import axios from 'axios';
import item from '../components/item';
import JsZip from 'jszip'
import{saveAs} from 'file-saver'
const prettyBytes = require('pretty-bytes');
import fileDownload from 'js-file-download';

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
export default function ErrorPage() {
 
  return (
    <div className={styles.container}>
      <Head>
        <title>404-NotFound</title>.
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <nav className={styles.nav}>
        <h2>File Transfer</h2>
        
        <div>
          <p>Contact Us</p>
        </div>
        
      </nav>
      <p className={styles.pdesc}>Send files up to 1Gb. Files are available for download during 12 hours</p>
      <main className={styles.main}>
        <h1>404 Not Found</h1>
        <Link href="/"><button className={styles.button2}>Return to Home</button></Link>
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
