import nextConnect from 'next-connect';
import type { NextApiRequest, NextApiResponse } from 'next'
import multer from 'multer';
import JsZip from 'jszip'
import{saveAs} from 'file-saver'
import path from 'path';
import fs from 'fs';
import {Storage} from '@google-cloud/storage'
type NextApiRequestWithFormData = NextApiRequest & {
  file: any,
}


const cid=process.env.GCLOUD_STORAGE_PRIVATE_KEY;
const newcid=cid.replace(/[^\u0020-\u007a]/g, '\n');
console.log("private",newcid);
const credentials= {
  type: process.env.GCLOUD_STORAGE_TYPE,  
  private_key: newcid, 
  client_email: process.env.GCLOUD_STORAGE_EMAIL,
  client_id: process.env.STORAGE_ID,  
}  

const storage= new Storage({
  credentials:credentials
});


const bucket = storage.bucket(process.env.GCLOUD_STORAGE_BUCKET_URL);
const upload = multer({
  storage: multer.memoryStorage(),
  limits:{
    fileSize:100*1024*1024
  } 
});

const apiRoute = nextConnect({
  onError(error, req, res:NextApiResponse) {
    res.status(501).json({ error: `Sorry something Happened! ${error.message}` });
  },
  onNoMatch(req, res) {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  },
});

//apiRoute.use(upload.array('theFiles',12));

apiRoute.post((req:NextApiRequestWithFormData,res) => {
  upload.single("theFiles")(req as any, {} as any, err => {
    // do error handling here
    console.log(req.file) // do something with the files here
    try{
      if(!req.file){
        res.status(400).send('Error, could not upload file');
        return;
      }
      const blob=bucket.file(req.file.originalname);
      blob.name=`file-${Date.now()}`;
      const blobWriter=blob.createWriteStream({
        metadata: {
          contentType: req.file.mimetype,
        },
      });
      blobWriter.on('error',(err)=>{
        res.status(500).send(err);
        return;
      });
      blobWriter.on('finish',()=>{
        const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURI(blob.name)}?alt=media`;
        res.status(200).send({fileName:req.file.originalname,fileLocation:publicUrl});
      });
  
      blobWriter.end(req.file.buffer);
    }
    catch(error){
      res.status(400).send(`Error, could not upload file: ${error}`);
    return;
    }
    
    //res.json({"data":`${req.headers.origin}/downloads/${req.file.filename}`});
    
  })
});
export default apiRoute;

export const config = {
  api: {
    bodyParser: false, // Disallow body parsing, consume as stream
  },
};