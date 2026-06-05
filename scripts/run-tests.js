const { spawn } = require('node:child_process');

const serverEnv = {
    ...process.env,
    TESTING: 'true',
};

const serverProcess = spawn(process.execPath, ['index.js'], {
    env: serverEnv,
    stdio: 'inherit',
});

const waitForServer = async (timeoutMs = 15000) => {
    const deadline = Date.now() + timeoutMs;

    while (Date.now() < deadline) {
        try {
            const response = await fetch('http://127.0.0.1:3001/');
            if (response.ok) {
                return;
            }
        } catch {
            // Keep waiting until the API is ready.
        }

        await new Promise((resolve) => setTimeout(resolve, 500));
    }

    throw new Error('API did not become ready before the test timeout expired');
};

const stopServer = () => {
    if (!serverProcess.killed) {
        serverProcess.kill('SIGTERM');
    }
};

process.on('SIGINT', () => {
    stopServer();
    process.exit(130);
});

process.on('SIGTERM', () => {
    stopServer();
    process.exit(143);
});

(async () => {
    try {
        await waitForServer();

        const testProcess = spawn(process.execPath, ['--test', '--test-concurrency=1', 'tests/api_ch3.test.js'], {
            env: serverEnv,
            stdio: 'inherit',
        });

        testProcess.on('exit', (code) => {
            stopServer();
            process.exit(code ?? 1);
        });
    } catch (error) {
        stopServer();
        console.error(error.message || error);
        process.exit(1);
    }
})();