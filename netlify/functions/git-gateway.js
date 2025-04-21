const { createClient } = require('@supabase/supabase-js');
const fetch = require('node-fetch');

const supabase = createClient(
  'https://your-project.supabase.co', // 替换为你的 Supabase API URL
  'your-anon-key' // 替换为你的 Anon Key
);

exports.handler = async (event, context) => {
  const { identity } = context.clientContext;

  if (!identity) {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: 'Unauthorized' }),
    };
  }

  // 获取 Supabase 用户 token
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: 'Not authenticated' }),
    };
  }

  // 模拟 Netlify Identity 的 Git Gateway 行为
  if (event.httpMethod === 'POST' && event.path.includes('/api/v1/token')) {
    return {
      statusCode: 200,
      body: JSON.stringify({
        token: session.access_token,
      }),
    };
  }

  // 转发请求到 GitHub
  const githubToken = process.env.GITHUB_TOKEN; // 需要设置 GitHub Token
  const response = await fetch('https://api.github.com' + event.path.replace('/git/', '/'), {
    method: event.httpMethod,
    headers: {
      Authorization: `Bearer ${githubToken}`,
      'Content-Type': 'application/json',
    },
    body: event.body,
  });

  const data = await response.json();
  return {
    statusCode: response.status,
    body: JSON.stringify(data),
  };
};