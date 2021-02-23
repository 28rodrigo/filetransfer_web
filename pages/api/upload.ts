import nextConnect from 'next-connect';
import type { NextApiRequest, NextApiResponse } from 'next'
import multer from 'multer';
import JsZip from 'jszip'
import{saveAs} from 'file-saver'
import path from 'path';
import fs from 'fs';

type NextApiRequestWithFormData = NextApiRequest & {
  files: any[],
}
const upload = multer({
  storage: multer.diskStorage({
    destination: './public/uploads',
    filename: (req, file, cb) => cb(null, `file-${+Date.now()}.zip`),
    
  }),
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
  upload.array("theFiles", 3)(req as any, {} as any, err => {
    // do error handling here
    console.log(req.files) // do something with the files here

    res.json({"data":`${req.headers.origin}/downloads/${req.files[0].filename}`});
    
  })
});
export default apiRoute;

export const config = {
  api: {
    bodyParser: false, // Disallow body parsing, consume as stream
  },
};