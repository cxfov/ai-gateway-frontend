import { useState, useCallback, useEffect } from 'react';
import { tokenApi } from '@/api/endpoints';
import type { Token } from '@/types';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

function extractItems(data: any): Token[] {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (data.items && Array.isArray(data.items)) return data.items;
  return [];
}

function extractTotal(data: any): number {
  if (!data) return 0;
  if (Array.isArray(data)) return data.length;
  if (typeof data.total === 'number') return data.total;
  return 0;
}

export function useTokens() {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const { t } = useTranslation();

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const res = search
        ? await tokenApi.search(search, page)
        : await tokenApi.getAll(page);
      if (res.data.success) {
        setTokens(extractItems(res.data.data));
        setTotal(extractTotal(res.data.data));
      } else {
        setTokens([]);
      }
    } catch (e) {
      console.warn('[Tokens] fetch error:', e);
      setTokens([]);
    }
    setLoading(false);
  }, [search, page, t]);

  useEffect(() => { fetch(); }, [fetch]);

  const create = async (data: Partial<Token>) => {
    try {
      const res = await tokenApi.create(data);
      if (res.data.success) {
        toast.success(t('token.created'));
        fetch();
        return res.data.data;
      } else {
        toast.error(res.data.message || t('common.failed'));
        return null;
      }
    } catch (e: any) {
      toast.error(e?.response?.data?.message || t('common.failed'));
      return null;
    }
  };

  const remove = async (id: number) => {
    try {
      const res = await tokenApi.delete(id);
      if (res.data.success) {
        toast.success(t('token.deleted'));
        fetch();
      } else {
        toast.error(res.data.message);
      }
    } catch (e: any) {
      toast.error(e?.response?.data?.message || t('common.failed'));
    }
  };

  const toggle = async (token: Token) => {
    try {
      const res = await tokenApi.update({ ...token, status: token.status === 1 ? 2 : 1 });
      if (res.data.success) fetch();
      else toast.error(res.data.message);
    } catch (e: any) {
      toast.error(e?.response?.data?.message || t('common.failed'));
    }
  };

  return { tokens, total, loading, search, setSearch, page, setPage, fetch, create, remove, toggle };
}