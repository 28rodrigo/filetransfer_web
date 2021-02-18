import nextConnect from 'next-connect';
import type { NextApiRequest, NextApiResponse } from 'next'
import multer from 'multer';
import JsZip from 'jszip'
import{saveAs} from 'file-saver'
import path from 'path';
import fs from 'fs';

const apiRoute = nextConnect({
  onError(error, req, res:NextApiResponse) {
    res.status(501).json({ error: `Sorry something Happened! ${error.message}` });
  },
  onNoMatch(req, res) {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  },
});


apiRoute.get((req:NextApiRequest,res)=>{
    const filename=req.query.id as string;
  const filePath = path.resolve('.', 'public','uploads',filename);
  if(!fileExistsSync(filePath))
  {
    res.status(404).json({"error":"File not Found!"})
  }
  const imageBuffer = fs.readFileSync(filePath)
  res.setHeader('Content-Type', 'application/zip')
  res.send(imageBuffer);
})
export default apiRoute;

export const config = {
  api: {
    bodyParser: false, // Disallow body parsing, consume as stream
  },
};
const fileExistsSync = (file) => {
    try {
        fs.accessSync(file, fs.constants.R_OK | fs.constants.W_OK);
        return true;
      } catch (err) {
        return false;
      }
}