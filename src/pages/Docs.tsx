import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { BookOpen, List } from 'lucide-react';
import { Card, Badge, CodeBlock } from '@/components/ui';
import { useApiEndpoint } from '@/features/tokens/useApiEndpoint';
import { systemApi } from '@/api/endpoints';

export const DocsPage: React.FC = () => {
  const { t } = useTranslation();
  const baseUrl = useApiEndpoint();
  const [tab, setTab] = useState<'curl' | 'python' | 'node' | 'anthropic'>('curl');
  const [models, setModels] = useState<string[]>([]);

  useEffect(() => {
    systemApi.getPricing().then((res) => {
      if (res.data && Array.isArray(res.data.data)) {
        const names = [...new Set(res.data.data.map((m: any) => m.model_name))].sort();
        setModels(names as string[]);
      }
    }).catch(() => {});
  }, []);

  const curlExample = `curl ${baseUrl}/v1/chat/completions \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer sk-YOUR_API_KEY" \\
  -d '{
    "model": "gpt-4o",
    "messages": [
      {"role": "system", "content": "You are a helpful assistant."},
      {"role": "user", "content": "Hello!"}
    ]
  }'`;

  const pythonExample = `from openai import OpenAI

client = OpenAI(
    api_key="sk-YOUR_API_KEY",
    base_url="${baseUrl}/v1"
)

response = client.chat.completions.create(
    model="gpt-4o",
    messages=[
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "Hello!"}
    ]
)
print(response.choices[0].message.content)`;

  const nodeExample = `import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: 'sk-YOUR_API_KEY',
  baseURL: '${baseUrl}/v1',
});

const response = await client.chat.completions.create({
  model: 'gpt-4o',
  messages: [
    { role: 'system', content: 'You are a helpful assistant.' },
    { role: 'user', content: 'Hello!' },
  ],
});
console.log(response.choices[0].message.content);`;

  const anthropicExample = `import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: 'sk-YOUR_API_KEY',
  baseURL: '${baseUrl}/anthropic',
});

const message = await client.messages.create({
  model: 'claude-3-5-sonnet-latest',
  max_tokens: 1024,
  messages: [{ role: 'user', content: 'Hello, Claude!' }],
});
console.log(message.content[0].text);`;

  const tabs = [
    { id: 'curl' as const, label: t('docs.curl') },
    { id: 'python' as const, label: t('docs.python') },
    { id: 'node' as const, label: t('docs.node') },
    { id: 'anthropic' as const, label: t('docs.anthropicApi') },
  ];

  const codeMap = {
    curl: { code: curlExample, lang: 'bash', file: 'terminal' },
    python: { code: pythonExample, lang: 'python', file: 'main.py' },
    node: { code: nodeExample, lang: 'javascript', file: 'index.js' },
    anthropic: { code: anthropicExample, lang: 'javascript', file: 'anthropic.js' },
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)] flex items-center gap-3">
          <BookOpen style={{ color: 'var(--color-accent)' }} size={22} /> {t('docs.title')}
        </h1>
        <p className="text-sm text-[var(--color-text-muted)] mt-1">{t('docs.subtitle')}</p>
      </div>

      <Card className="p-5">
        <h2 className="text-base font-semibold text-[var(--color-text-primary)] mb-3">{t('docs.quickStart')}</h2>
        <div className="space-y-3">
          <div>
            <p className="text-xs text-[var(--color-text-muted)] mb-1">OpenAI Compatible Base URL</p>
            <code className="text-sm font-mono px-3 py-1.5 rounded-lg bg-[var(--color-bg-code)] inline-block" style={{ color: 'var(--color-accent-text)' }}>{baseUrl}/v1</code>
          </div>
          <div>
            <p className="text-xs text-[var(--color-text-muted)] mb-1">Anthropic Compatible Base URL</p>
            <code className="text-sm font-mono px-3 py-1.5 rounded-lg bg-[var(--color-bg-code)] inline-block" style={{ color: 'var(--color-accent-text)' }}>{baseUrl}/anthropic</code>
          </div>
          <p className="text-xs text-[var(--color-text-muted)] mt-2">💡 {t('docs.baseUrlNote')}</p>
        </div>
      </Card>

      <Card className="p-5">
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          {tabs.map((tb) => (
            <button key={tb.id} onClick={() => setTab(tb.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${tab === tb.id ? 'bg-[var(--color-accent)] text-white' : 'bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)]'}`}>
              {tb.label}
            </button>
          ))}
        </div>
        <CodeBlock code={codeMap[tab].code} language={codeMap[tab].lang} filename={codeMap[tab].file} />
      </Card>

      {models.length > 0 && (
        <Card className="p-5">
          <h2 className="text-base font-semibold text-[var(--color-text-primary)] mb-3 flex items-center gap-2">
            <List size={16} style={{ color: 'var(--color-accent)' }} /> {t('docs.modelsAvailable')}
          </h2>
          <div className="flex flex-wrap gap-2">
            {models.map((model) => (
              <Badge key={model} variant="default"><code className="text-[11px] font-mono">{model}</code></Badge>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};