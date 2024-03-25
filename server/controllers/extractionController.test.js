const extract = require('./extractionController');
const { start } = require('../services/extractionService');

// https://stackoverflow.com/a/69579630/1269572
jest.mock('../services/extractionService', () => ({
    start: jest.fn()
}));

afterEach(() => {
    jest.clearAllMocks();
});

test('test extraction controller - every params are passed', async () => {
    const req = {
        body: {
            repoId: 422,
            path: '/acme',
            progLangs: [1,2],
            branches: {'acem-service': 'release/2.1'}
        }
    };
    const resp = {
        sendStatus: jest.fn().mockReturnThis()
    };

    await extract(req, resp);

    expect(resp.sendStatus).toHaveBeenCalledWith(201);
    expect(start).toHaveBeenCalledTimes(1);
});

test('test extraction controller - repoId is NOT passed', async () => {
    const req = {
        body: {
            path: '/acme',
            progLangs: [1,2],
            branches: {'acem-service': 'release/2.1'}
        }
    };
    const resp = {
        status: jest.fn().mockReturnThis(), 
        json: jest.fn().mockReturnThis(),
    };

    await extract(req, resp);

    expect(resp.status).toHaveBeenCalledWith(422);
    expect(resp.json).toHaveBeenCalledWith({ 'message': 'Repository ID is required.' });
    expect(start).toHaveBeenCalledTimes(0);
});

test('test extraction controller - path is NOT passed', async () => {
    const req = {
        body: {
            repoId: 422,
            progLangs: [1,2],
            branches: {'acem-service': 'release/2.1'}
        }
    };
    const resp = {
        status: jest.fn().mockReturnThis(), 
        json: jest.fn().mockReturnThis(),
    };

    await extract(req, resp);

    expect(resp.status).toHaveBeenCalledWith(422);
    expect(resp.json).toHaveBeenCalledWith({ 'message': 'Path is required.' });
    expect(start).toHaveBeenCalledTimes(0);
});

test('test extraction controller - progLangs are NOT passed', async () => {
    const req = {
        body: {
            repoId: 422,
            path: '/acme',
            branches: {'acem-service': 'release/2.1'}
        }
    };
    const resp = {
        status: jest.fn().mockReturnThis(), 
        json: jest.fn().mockReturnThis(),
    };

    await extract(req, resp);

    expect(resp.status).toHaveBeenCalledWith(422);
    expect(resp.json).toHaveBeenCalledWith({ 'message': 'Programming langague array is required.' });
    expect(start).toHaveBeenCalledTimes(0);
});

test('test extraction controller - branches are NOT passed', async () => {
    const req = {
        body: {
            repoId: 422,
            path: '/acme',
            progLangs: [1,2]
        }
    };
    const resp = {
        status: jest.fn().mockReturnThis(), 
        json: jest.fn().mockReturnThis(),
    };

    await extract(req, resp);

    expect(resp.status).toHaveBeenCalledWith(422);
    expect(resp.json).toHaveBeenCalledWith({ 'message': 'The project - branch assignments are required.' });
    expect(start).toHaveBeenCalledTimes(0);
});
