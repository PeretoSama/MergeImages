const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const formidable = require('formidable');
const sharp = require('sharp');
const { FindPort } = require('./serverUtilities/findPort.js');
const dotEnv = require('dotenv');
const fusionString = 'Combine these two pokemons in one powerful fusion';
dotEnv.config();
const apiKey = process.env.API_KEY;

const server = http.createServer((req, res) => {
  switch (req.method) {
    case 'GET':
      switch (req.url) {
        case '/':
          console.log('Request received');
          serveFile('index.html', 'text/html');
          break;
        case '/styles.css':
          serveFile('styles.css', 'text/css');
          break;
        case '/script.js':
          serveFile('script.js', 'application/javascript');
          break;
        default:
          serveError(404, 'Not Found');
          break;
      }
      break;
    case 'POST':
      switch (req.url) {
        case '/upload': {
          console.log('Server received post request method. URL /upload');
          // Parse the form data
          const form = new formidable.IncomingForm();

          form.uploadDir = path.join('public', 'uploads');
          form.keepExtensions = true;
          form.parse(req, (err, fields, files) => {
            if (err) {
              serveError(500, 'Internal Server Error');
              return;
            }
            const description = fields.description;
            console.log('IMAGE 1:', files.image1);

            const image1Filename = files.image1[0].originalFilename;
            const image2Filename = files.image2[0].originalFilename;
            const image1Path = files.image1[0].filepath;
            const image2Path = files.image2[0].filepath;

            Promise.all([
              sharp(image1Path).toFormat('png').toBuffer(),
              sharp(image2Path).toFormat('png').toBuffer()
            ])
              .then(([image1Buffer, image2Buffer]) => {
                console.log('Image1 Buffer', image1Buffer);
                sharp(image1Buffer).metadata()
                  .then(metadata1 => {
                    sharp(image2Buffer).metadata()
                      .then(metadata2 => {
                        console.log('Metadata image1 and 2:', metadata1, metadata2);
                        const combinedWidth = metadata1.width + metadata2.width;
                        const combinedHeight = Math.max(metadata1.height, metadata2.height);

                        sharp({
                          create: {
                            width: combinedWidth,
                            height: combinedHeight,
                            channels: 4,
                            background: { r: 0, g: 0, b: 0, alpha: 0 }
                          }
                        })
                          .composite([
                            { input: image1Buffer, top: 0, left: 0 },
                            { input: image2Buffer, top: 0, left: metadata1.width }
                          ])
                          .png()
                          .toBuffer()
                          .then(combinedBuffer => {
                          // Delete the temporary files
                            fs.unlink(image1Path, err => {
                              if (err) {
                                serveError(500, 'Internal Server Error');
                              }
                            });
                            fs.unlink(image2Path, err => {
                              if (err) {
                                serveError(500, 'Internal Server Error');
                              }
                            });

                            // Send the combined image as response
                            res.writeHead(200, { 'Content-Type': 'image/png' });
                            res.end(combinedBuffer);
                          })
                          .catch(err => {
                            serveError(500, 'Internal Server Error');
                            console.log(err);
                          });
                      })
                      .catch(err => {
                        serveError(500, 'Internal Server Error');
                        console.log(err);
                      });
                  })
                  .catch(err => {
                    serveError(500, 'Internal Server Error');
                    console.log(err);
                  });
              })
              .catch(err => {
                serveError(500, 'Internal Server Error');
                console.log(err);
              });
          });
          break;
        }
        default:
          serveError(404, 'Not Found');
          break;
      }
      break;
    case '/fusion':
      break;
    default:
      res.writeHead(405, { 'Content-Type': 'text/plain' });
      res.end('Method Not Allowed');
      break;
  }

  function serveFile (fileName, contentType) {
    const filePath = path.join('public', fileName);
    fs.readFile(filePath, (err, data) => {
      if (err) {
        serveError(500, 'Internal Server Error');
      } else {
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(data);
      }
    });
  }

  function serveError (statusCode, message) {
    res.writeHead(statusCode, { 'Content-Type': 'text/plain' });
    res.end(message);
  }
});

FindPort(9000)
  .then(port => {
    server.listen(port, () => {
      console.log(`Listening to : http://localhost:${port}`);
    });
  });

function GetFileName (file) {
  const lastIndex = file.lastIndexOf('.');
  return file.slice(0, lastIndex);
}
