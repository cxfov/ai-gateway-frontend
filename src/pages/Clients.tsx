import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Blocks, ExternalLink, Terminal, Monitor, MessageSquare, Bot, Globe, Search } from 'lucide-react';
import { Card, Button, Badge, CodeBlock, CopyButton, EmptyState } from '@/components/ui';
import { clients } from '@/data/clients';
import { useAuthStore } from '@/store/authStore';
import { useApiEndpoint } from '@/features/tokens/useApiEndpoint';
import { tokenApi } from '@/api/endpoints';
import type { Token, ClientDefinition } from '@/types';

const categoryIcons: Record<string, React.ReactNode> = {
  cli: <Terminal size={14} />, ide: <Monitor size={14} />, chat: <MessageSquare size={14} />,
  agent: <Bot size={14} />, browser: <Globe size={14} />,
};

export const ClientsPage: React.FC = () => {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuthStore();
  const baseUrl = useApiEndpoint();
  const [tokens, setTokens] = useState<Token[]>([]);
  const [selectedTokenId, setSelectedTokenId] = useState<number | null>(null);
  const [category, setCategory] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) return;
    tokenApi.getAll(0).then((res) => {
      if (res.data.success && res.data.data) {
        const raw: any = res.data.data;
        const items: Token[] = Array.isArray(raw) ? raw : (raw.items || []);
        setTokens(items);
        if (items.length > 0) setSelectedTokenId(items[0].id);
      }
    });
  }, [isAuthenticated]);

  const selectedToken = tokens.find((t) => t.id === selectedTokenId);
  const apiKey = selectedToken ? `sk-${selectedToken.key}` : 'sk-YOUR_API_KEY';

  const categories = ['all', 'cli', 'ide', 'chat', 'agent', 'browser'];
  const filtered = useMemo(() => {
    return clients.filter((c) => {
      if (category !== 'all' && c.category !== category) return false;
      if (search && !c.name.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [category, search]);

  const renderSetup = (client: ClientDefinition) => {
    const s = client.setup;
    const sections: React.ReactNode[] = [];
    if (s.cliCommand) {
      sections.push(
        <div key="cli" className="space-y-2">
          <h4 className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase">{t('client.cliCommand')}</h4>
          <CodeBlock code={s.cliCommand(baseUrl, apiKey)} language="bash" filename="terminal" />
        </div>
      );
    }
    if (s.envVars) {
      const vars = s.envVars(baseUrl, apiKey);
      const envStr = Object.entries(vars).map(([k, v]) => `export ${k}="${v}"`).join('\n');
      sections.push(
        <div key="env" className="space-y-2">
          <h4 className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase">{t('client.envVars')}</h4>
          <CodeBlock code={envStr} language="bash" filename=".bashrc / .zshrc" />
        </div>
      );
    }
    if (s.configFile) {
      const cfg = s.configFile(baseUrl, apiKey);
      sections.push(
        <div key="config" className="space-y-2">
          <h4 className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase">{t('client.configFile')}</h4>
          <p className="text-xs text-[var(--color-text-muted)]">{t('client.filePath')}: <code className="font-mono">{cfg.path}</code></p>
          <CodeBlock code={cfg.content} language={cfg.format} filename={cfg.path.split('/').pop()} showDownload downloadFilename={cfg.path.split('/').pop()} />
        </div>
      );
    }
    if (s.guiSteps) {
      const steps = s.guiSteps(baseUrl, apiKey);
      sections.push(
        <div key="gui" className="space-y-2">
          <h4 className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase">{t('client.guiSteps')}</h4>
          <ol className="space-y-2">
            {steps.map((step, i) => (
              <li key={i} className="flex gap-3 text-sm text-[var(--color-text-secondary)]">
                <span className="shrink-0 w-6 h-6 rounded-full bg-[var(--color-accent-soft)] text-[var(--color-accent-text)] flex items-center justify-center text-xs font-semibold">{i + 1}</span>
                <span className="pt-0.5">{step}</span>
              </li>
            ))}
          </ol>
        </div>
      );
    }
    return <div className="space-y-4 mt-4 pt-4 border-t border-[var(--color-border)]">{sections}</div>;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)] flex items-center gap-3">
          <Blocks style={{ color: 'var(--color-accent)' }} size={22} /> {t('client.title')}
        </h1>
        <p className="text-sm text-[var(--color-text-muted)] mt-1">{t('client.subtitle')}</p>
      </div>

      {isAuthenticated && tokens.length > 0 && (
        <Card className="p-4">
          <div className="flex items-center gap-4 flex-wrap">
            <label className="text-sm font-medium text-[var(--color-text-secondary)]">{t('client.selectKey')}:</label>
            <select value={selectedTokenId ?? ''} onChange={(e) => setSelectedTokenId(Number(e.target.value))}
              className="rounded-lg bg-[var(--color-bg-input)] border border-[var(--color-border)] text-[var(--color-text-primary)] px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/40">
              {tokens.filter((tk) => tk.status === 1).map((tk) => (
                <option key={tk.id} value={tk.id}>{tk.name} {tk.group ? `(${tk.group})` : ''}</option>
              ))}
            </select>
            {selectedToken && (
              <span className="text-xs text-[var(--color-text-muted)]">{t('client.configuredWith')} <code className="font-mono text-[var(--color-accent-text)]">sk-{selectedToken.key.slice(0, 8)}...</code></span>
            )}
          </div>
        </Card>
      )}

      {!isAuthenticated && (
        <Card className="p-4 text-center text-sm text-[var(--color-text-muted)]">{t('client.loginToSeeKey')}</Card>
      )}

      <div className="flex items-center gap-2 flex-wrap">
        {categories.map((cat) => (
          <button key={cat} onClick={() => setCategory(cat)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${category === cat ? 'bg-[var(--color-accent)] text-white' : 'bg-[var(--color-bg-card)] border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-accent)]/40'}`}>
            {cat !== 'all' && categoryIcons[cat]}
            {t(`client.${cat === 'all' ? 'allCategories' : cat}`)}
          </button>
        ))}
        <div className="relative ml-auto">
          <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
          <input className="pl-8 pr-3 py-1.5 rounded-lg bg-[var(--color-bg-card)] border border-[var(--color-border)] text-[var(--color-text-primary)] text-xs placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/40 w-48"
            placeholder={t('common.search')} value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map((client, i) => (
          <motion.div key={client.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.02 }}>
            <Card className="p-5">
              <div className="flex items-start gap-4 cursor-pointer" onClick={() => setExpandedId(expandedId === client.id ? null : client.id)}>
                <span className="text-2xl">{client.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">{client.name}</h3>
                    <Badge variant="default">{t(`client.${client.category}`)}</Badge>
                  </div>
                  <p className="text-xs text-[var(--color-text-muted)] mb-2">{client.description}</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] text-[var(--color-text-muted)]">{t('client.platforms')}:</span>
                    {client.platforms.map((p) => (
                      <span key={p} className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--color-bg-secondary)] text-[var(--color-text-muted)]">{p}</span>
                    ))}
                  </div>
                </div>
                <a href={client.website} target="_blank" rel="noopener noreferrer"
                  className="shrink-0 p-2 rounded-lg hover:bg-[var(--color-bg-secondary)] text-[var(--color-text-muted)]"
                  onClick={(e) => e.stopPropagation()}>
                  <ExternalLink size={14} />
                </a>
              </div>
              {expandedId === client.id && renderSetup(client)}
            </Card>
          </motion.div>
        ))}
        {filtered.length === 0 && <EmptyState icon={<Blocks size={40} />} title={t('common.noData')} />}
      </div>
    </div>
  );
};