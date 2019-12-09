import * as express from 'express';
import * as path from 'path';

export function getViewServerApp(electronAppPath: string): express.Express {
    console.log(electronAppPath);
    const serverApp = express();
    const VIEW_PATH = path.join(electronAppPath, 'view');
    const STATIC_PATH = path.join(electronAppPath, 'static');

    serverApp.use(express.static(STATIC_PATH));

    serverApp.get('/', function (req: express.Request, res: express.Response) {
        res.sendFile(path.join(VIEW_PATH, 'index.html'));
    });

    return serverApp;
}

export default {
    getViewServerApp: getViewServerApp
}




