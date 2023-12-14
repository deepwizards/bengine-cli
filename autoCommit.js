const { execSync } = require('child_process');
const axios = require('axios');

const openAIKey = process.env.OPENAI_API_KEY;

async function getGitStatus() {
    try {
        const status = await execSync('git status --porcelain').toString();
        console.log('Git status:', status);
        const lines = status.trim().split('\n');
        const changes = lines.map(line => {
            const [type, file] = line.split(' ').filter(Boolean);
            return { type, file };
        });
        return changes;
    } catch (error) {
        console.error('Error fetching Git status:', error);
        return [];
    }
}

async function generateCommitMessage() {
    const changes = await getGitStatus();
    if (changes.length === 0) {
        console.log('No changes to commit.');
        return '';
    }

    const changeSummary = await changes.map(({ type, file }) => `${type} ${file}`).join('\n');
    const content = `Note: Output must be ONLY the commit message in plain text (no explanations). \n\n Based on the following Git status, generate a commit message compatible with semantic release:\n\n${changeSummary} \n\n Commit message (use feat, fix, chore, etc.):`;

    try {
        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                "messages": [{"role": "user", content}],
                model: "gpt-3.5-turbo",
                max_tokens: 256,
                temperature: 0.7,
                top_p: 1,
            },
            {
                headers: {
                    'Authorization': `Bearer ${openAIKey}`
                }
            }
        );

        return response.data.choices[0].message.content.trim()
    } catch (error) {
        console.error('Error generating commit message:', error);
        return '';
    }
}

async function commitAndPush() {
    try {
        // Add all changes
        execSync('git add -A');

        // Generate commit message
        const commitMessage = await generateCommitMessage();

        // Commit changes
        execSync(`git commit -m "${commitMessage}"`);

        // Push changes
        execSync('git push');
        console.log('Changes committed and pushed successfully.');
    } catch (error) {
        console.error('An error occurred:', error);
    }
}

commitAndPush();
