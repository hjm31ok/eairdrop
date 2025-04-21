const { createClient } = require('@supabase/supabase-js');
const fetch = require('node-fetch');

const supabase = createClient(
  'https://your-project.supabase.co', // �滻Ϊ��� Supabase API URL
  'your-anon-key' // �滻Ϊ��� Anon Key
);

exports.handler = async (event, context) => {
  const { identity } = context.clientContext;

  if (!identity) {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: 'Unauthorized' }),
    };
  }

  // ��ȡ Supabase �û� token
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: 'Not authenticated' }),
    };
  }

  // ģ�� Netlify Identity �� Git Gateway ��Ϊ
  if (event.httpMethod === 'POST' && event.path.includes('/api/v1/token')) {
    return {
      statusCode: 200,
      body: JSON.stringify({
        token: session.access_token,
      }),
    };
  }

  // ת������ GitHub
  const githubToken = process.env.GITHUB_TOKEN; // ��Ҫ���� GitHub Token
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