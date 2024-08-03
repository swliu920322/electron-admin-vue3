import { protocol } from 'electron';
import fs, { ReadStream } from 'fs';
import path from 'path';

const schemeConfig = {
  standard: true,
  supportFetchAPI: true,
  bypassCSP: true,
  corsEnabled: true,
  stream: true
};
protocol.registerSchemesAsPrivileged([{ scheme: 'app', privileges: schemeConfig }]);

async function* nodeStreamToIterator(stream: ReadStream) {
  for await (const chunk of stream) {
    yield chunk;
  }
}

function iteratorToStream(iterator: any) {
  return new ReadableStream({
    async pull(controller) {
      const { value, done } = await iterator.next();
      if (done) {
        controller.close();
      } else {
        controller.enqueue(new Uint8Array(value));
      }
    }
  });
}

export class CustomScheme {
  // 根据文件扩展名获取mime-type
  private static getMimeType(extension: string) {
    let mimeType = '';
    if (extension === '.js') {
      mimeType = 'text/javascript';
    } else if (extension === '.html') {
      mimeType = 'text/html';
    } else if (extension === '.css') {
      mimeType = 'text/css';
    } else if (extension === '.svg') {
      mimeType = 'image/svg+xml';
    } else if (extension === '.json') {
      mimeType = 'application/json';
    }
    return mimeType;
  }
  
  static registerScheme() {
    // deprecated
    // protocol.registerBufferProtocol('app', (request, callback) => {
    //   let pathName = new URL(request.url).pathname;
    //   let extension = path.extname(pathName).toLowerCase();
    //   if (extension === '') {
    //     pathName = 'index.html';
    //     extension = '.html';
    //   }
    //   const tarFile = path.join(__dirname, pathName);
    //   callback({
    //     statusCode: 200,
    //     headers: { 'content-type': this.getMimeType(extension) },
    //     data: fs.createReadStream(tarFile)
    //   });
    // });
    protocol.handle('app', (request) => {
      let pathName = new URL(request.url).pathname;
      let extension = path.extname(pathName).toLowerCase();
      if (extension === '') {
        pathName = 'index.html';
        extension = '.html';
      }
      const tarFile = path.join(__dirname, pathName);
      return new Response(
        iteratorToStream(nodeStreamToIterator(fs.createReadStream(tarFile))),
        {
          status: 200,
          headers: { 'content-type': this.getMimeType(extension) }
        });
    });
  }
}