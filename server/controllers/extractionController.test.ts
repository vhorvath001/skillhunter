import extract from './extractionController'
import { start } from '../services/extractionService'

// https://stackoverflow.com/a/69579630/1269572
jest.mock('../services/extractionService', () => { return {
    start: jest.fn()
}});

afterEach(() => {
    jest.clearAllMocks();
});

test('test extraction controller - every params are passed', async () => {
    const req: any = {
        body: {
            repoId: 422,
            path: '/acme',
            progLangs: [1,2],
            branches: {'acem-service': 'release/2.1'}
        }
    };
    const resp: any = {
        sendStatus: jest.fn().mockReturnThis()
    };

    await extract(req, resp);

    expect(resp.sendStatus).toHaveBeenCalledWith(201);
    expect(start).toHaveBeenCalledTimes(1);
    expect(start).toHaveBeenCalledWith(422, {'acem-service': 'release/2.1'}, '/acme', [1,2])
});

test('test extraction controller - repoId is NOT passed', async () => {
    const req: any = {
        body: {
            path: '/acme',
            progLangs: [1,2],
            branches: {'acem-service': 'release/2.1'}
        }
    };
    const resp: any = {
        status: jest.fn().mockReturnThis(), 
        json: jest.fn().mockReturnThis(),
    };

    await extract(req, resp);

    expect(resp.status).toHaveBeenCalledWith(422);
    expect(resp.json).toHaveBeenCalledWith({ 'message': 'Repository ID is not provided or invalid.' });
    expect(start).toHaveBeenCalledTimes(0);
});

test('test extraction controller - repoId is invalid', async () => {
    const req: any = {
        body: {
            repoId: 'aa',
            path: '/acme',
            progLangs: [1,2],
            branches: {'acem-service': 'release/2.1'}
        }
    };
    const resp: any = {
        status: jest.fn().mockReturnThis(), 
        json: jest.fn().mockReturnThis(),
    };

    await extract(req, resp);

    expect(resp.status).toHaveBeenCalledWith(422);
    expect(resp.json).toHaveBeenCalledWith({ 'message': 'Repository ID is not provided or invalid.' });
    expect(start).toHaveBeenCalledTimes(0);
});

test('test extraction controller - path is NOT passed', async () => {
    const req: any = {
        body: {
            repoId: 422,
            progLangs: [1,2],
            branches: {'acem-service': 'release/2.1'}
        }
    };
    const resp: any = {
        status: jest.fn().mockReturnThis(), 
        json: jest.fn().mockReturnThis(),
    };

    await extract(req, resp);

    expect(resp.status).toHaveBeenCalledWith(422);
    expect(resp.json).toHaveBeenCalledWith({ 'message': 'Path is not provided.' });
    expect(start).toHaveBeenCalledTimes(0);
});

test('test extraction controller - progLangs are NOT passed', async () => {
    const req: any = {
        body: {
            repoId: 422,
            path: '/acme',
            branches: {'acem-service': 'release/2.1'}
        }
    };
    const resp: any = {
        status: jest.fn().mockReturnThis(), 
        json: jest.fn().mockReturnThis(),
    };

    await extract(req, resp);

    expect(resp.status).toHaveBeenCalledWith(422);
    expect(resp.json).toHaveBeenCalledWith({ 'message': 'Programming langague array is not provided.' });
    expect(start).toHaveBeenCalledTimes(0);
});

test('test extraction controller - branches are NOT passed', async () => {
    const req: any = {
        body: {
            repoId: 422,
            path: '/acme',
            progLangs: [1,2]
        }
    };
    const resp: any = {
        status: jest.fn().mockReturnThis(), 
        json: jest.fn().mockReturnThis(),
    };

    await extract(req, resp);

    expect(resp.status).toHaveBeenCalledWith(422);
    expect(resp.json).toHaveBeenCalledWith({ 'message': 'The project - branch assignments are not provided.' });
    expect(start).toHaveBeenCalledTimes(0);
});
